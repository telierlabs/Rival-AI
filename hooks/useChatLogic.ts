import { useState } from 'react';
import { Message, ChatSession, UserProfile, ConversationMode } from '../types';
import { gemini } from '../services/geminiService';

export const useChatLogic = (
  session: ChatSession | null,
  profile: UserProfile,
  onUpdateMessages: (messages: Message[]) => void,
  checkImageLimit: () => boolean,
  incrementImageUsage: () => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<ConversationMode>(session?.activeMode || 'general');

  const extractCode = (text: string): string | null => {
    const codeBlockRegex = /```(?:[a-zA-Z]+)?\n([\s\S]*?)\n```/;
    const match = text.match(codeBlockRegex);
    return match ? match[1] : null;
  };

  const cleanTextFromCode = (text: string): string => {
    return text.replace(/```(?:[a-zA-Z]+)?\n[\s\S]*?\n```/g, '').trim();
  };

  const handleSend = async (input: string, selectedImage: string | null, setInput: (v: string) => void, setSelectedImage: (v: string | null) => void, setLimitError: (v: boolean) => void) => {
    if ((!input.trim() && !selectedImage) || isLoading || !session) return;

    if (activeMode === 'image' || selectedImage) {
      if (!checkImageLimit()) {
        setLimitError(true);
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      imageUrl: selectedImage || undefined,
      isImageEditing: !!selectedImage
    };

    const newMessages = [...session.messages, userMessage];
    onUpdateMessages(newMessages);
    const currentInput = input;
    setInput('');
    const currentImage = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let aiResponseText = "";
      let aiImageUrl: string | undefined = undefined;

      let modeInstruction = profile.aiPersona;
      if (activeMode === 'coding') {
        modeInstruction = "You are a Senior Fullstack Architect. When creating web components, provide a complete, self-contained HTML/CSS/JS block inside triple backticks. Focus on clean code. IMPORTANT: Never use double asterisks (**) for bolding.";
      }

      if (currentImage) {
        const result = await gemini.editImage(currentInput || "Optimize this image", currentImage);
        aiResponseText = result.textResponse || `Visual processed.`;
        aiImageUrl = result.editedImageUrl || undefined;
        if (aiImageUrl) incrementImageUsage();
      } else {
        const history = session.messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));
        
        const response = await gemini.chat(currentInput, history, modeInstruction);
        
        if (response.functionCalls && response.functionCalls.length > 0) {
          const call = response.functionCalls[0];
          if (call.name === 'generate_visual') {
            if (!checkImageLimit()) {
               aiResponseText = "Sistem: Batas harian visualisasi tercapai. Mohon langganan Rival Premium untuk akses tak terbatas.";
            } else {
              const promptForImage = (call.args as any).prompt || currentInput;
              const imageResult = await gemini.generateImage(promptForImage);
              aiImageUrl = imageResult.generatedImageUrl || undefined;
              aiResponseText = imageResult.textResponse || `Generated visual for: "${promptForImage}"`;
              if (aiImageUrl) incrementImageUsage();
            }
          }
        } else {
          aiResponseText = response.text || "I couldn't process that.";
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
        imageUrl: aiImageUrl,
        codeSnippet: extractCode(aiResponseText) || undefined
      };

      onUpdateMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error(error);
      onUpdateMessages([...newMessages, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Error in Rival system.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    activeMode,
    setActiveMode,
    extractCode,
    cleanTextFromCode,
    handleSend
  };
};
