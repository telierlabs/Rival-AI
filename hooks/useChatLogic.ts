import { useState } from 'react';
import { Message, ChatSession, UserProfile, ConversationMode } from '../types';
import { gemini } from '../services/geminiService';
import { webSearchService } from '../services/webSearchService';
import { youtubeService } from '../services/youtubeService';
import { documentService } from '../services/documentService';
import { locationService } from '../services/locationService';
import { ebookService } from '../services/ebookService';

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

  const handleSend = async (
    input: string, 
    selectedImages: string[] | null, 
    setInput: (v: string) => void, 
    setSelectedImages: (v: string[] | null) => void, 
    setLimitError: (v: boolean) => void
  ) => {
    if ((!input.trim() && (!selectedImages || selectedImages.length === 0)) || isLoading || !session) return;

    if (activeMode === 'image' || (selectedImages && selectedImages.length > 0)) {
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
      imageUrls: selectedImages || undefined,
    };

    const newMessages = [...session.messages, userMessage];
    onUpdateMessages(newMessages);
    const currentInput = input;
    setInput('');
    setSelectedImages(null);
    setIsLoading(true);

    try {
      let aiResponseText = "";
      let aiImageUrl: string | undefined = undefined;
      let documentUrl: string | undefined = undefined;
      let mapData = undefined;
      let ebookData = undefined;
      let sources = undefined;

      let modeInstruction = profile.aiPersona;
      if (activeMode === 'coding') {
        modeInstruction = "You are a Senior Fullstack Architect. Provide production-ready code in ANY programming language requested. Support: Python, JavaScript, TypeScript, React, Vue, Angular, Node.js, Java, C++, Go, Rust, PHP, Ruby, Swift, Kotlin, etc. Always include proper structure, error handling, and best practices. IMPORTANT: Never use double asterisks (**) for bolding.";
      }

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
        } else if (call.name === 'search_web') {
          const query = (call.args as any).query;
          const searchResult = await webSearchService.searchWeb(query);
          sources = searchResult.sources;
          aiResponseText = searchResult.summary;
        } else if (call.name === 'generate_document') {
          const { title, content, format } = call.args as any;
          documentUrl = await documentService.generateDocument(title, content, format);
          aiResponseText = `Dokumen "${title}" berhasil dibuat dalam format ${format.toUpperCase()}.`;
        } else if (call.name === 'summarize_youtube') {
          const url = (call.args as any).url;
          aiResponseText = await youtubeService.summarizeVideo(url);
        } else if (call.name === 'find_location') {
          const query = (call.args as any).query;
          mapData = await locationService.findLocation(query);
          aiResponseText = `Lokasi "${mapData.placeName}" ditemukan di ${mapData.address}`;
        } else if (call.name === 'generate_ebook') {
          const { title, topic, pages } = call.args as any;
          ebookData = await ebookService.generateEbook(title, topic, pages);
          aiResponseText = `eBook "${title}" dengan ${ebookData.pages.length} halaman berhasil dibuat!`;
        }
      } else {
        aiResponseText = response.text || "I couldn't process that.";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
        imageUrl: aiImageUrl,
        codeSnippet: extractCode(aiResponseText) || undefined,
        documentUrl,
        mapData,
        ebookData,
        sources,
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
