import { GoogleGenAI } from "@google/genai";

class APIKeyManager {
  private keyIndex: number = 0;
  private keys: string[] = [];

  constructor() {
    this.loadKeys();
  }

  private loadKeys(): void {
    const rawKeys = process.env.API_KEY || '';
    this.keys = rawKeys.split(',').map(k => k.trim()).filter(k => k.length > 0);
    
    if (this.keys.length === 0) {
      throw new Error("API Key tidak ditemukan di environment variable.");
    }
  }

  public getRotatedAI(): GoogleGenAI {
    const currentKey = this.keys[this.keyIndex % this.keys.length];
    this.keyIndex++;
    return new GoogleGenAI({ apiKey: currentKey });
  }

  public resetRotation(): void {
    this.keyIndex = 0;
  }

  public getKeyCount(): number {
    return this.keys.length;
  }
}

export const apiKeyManager = new APIKeyManager();
