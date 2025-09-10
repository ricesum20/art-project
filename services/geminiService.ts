import { GoogleGenAI, Type } from "@google/genai";
import type { Artwork, ArtworkInfo } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const artworkInfoSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "작품의 제목"
    },
    artist: {
      type: Type.STRING,
      description: "작가의 이름"
    },
    description: {
      type: Type.STRING,
      description: "초등학생 2학년이 이해할 수 있는 쉬운 한글 설명 (2-3문장)"
    },
  },
  required: ["title", "artist", "description"]
};

export const searchArtworks = async (theme: string): Promise<Artwork[]> => {
  try {
    const prompt = `'${theme}'라는 주제와 관련된 유명 미술 작품 4개를 추천해줘. 작품은 전 세계의 것이어야 하고, 초등학교 2학년 학생이 감상하기에 적절해야 해. 각 작품에 대한 정보를 JSON 형식으로 제공해줘.`;
    
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            artworks: {
              type: Type.ARRAY,
              items: artworkInfoSchema
            }
          }
        }
      }
    });

    const responseJson = JSON.parse(result.text);
    const artworkInfos: ArtworkInfo[] = responseJson.artworks;

    if (artworkInfos.length === 0) {
      throw new Error("No artworks found for the given theme.");
    }
    
    const artworkPromises = artworkInfos.map(async (info) => {
      const imagePrompt = `유명한 미술 작품인 '${info.title}' by ${info.artist}를 모티브로 한 밝고 다채로운 디지털 아트 이미지를 생성해줘. 원작의 느낌을 살리되, 아이들이 좋아할 만한 스타일로 그려줘.`;
      
      const imageResult = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: imagePrompt,
        config: {
            numberOfImages: 1,
            aspectRatio: '1:1',
        }
      });
      
      const imageBase64 = imageResult.generatedImages[0].image.imageBytes;
      
      return {
        ...info,
        image: imageBase64,
      };
    });

    return Promise.all(artworkPromises);
  } catch (error) {
    console.error("Error searching artworks:", error);
    throw new Error("Failed to fetch artworks from Gemini API.");
  }
};

export const generateColoringPage = async (artwork: Artwork, level: 'lower' | 'upper'): Promise<string> => {
  try {
    let prompt: string;
    if (level === 'lower') {
      prompt = `${artwork.artist}의 작품 '${artwork.title}'를 모티브로 한 초등학교 저학년용 컬러링 도안을 만들어줘. 초등학교 2학년이 색칠할 수 있도록, 선은 매우 굵고 명확해야 하며, 아주 복잡하지 않은 단순한 흑백 그림이어야 해.`;
    } else { // 'upper'
      prompt = `${artwork.artist}의 작품 '${artwork.title}'를 모티브로 한 초등학교 고학년용 컬러링 도안을 만들어줘. 선은 굵고 명확해야 하며, 디테일이 약간 있는 흑백 그림이어야 해.`;
    }

    const imageResult = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
          numberOfImages: 1,
          aspectRatio: '1:1',
      }
    });

    return imageResult.generatedImages[0].image.imageBytes;
  } catch (error) {
    console.error("Error generating coloring page:", error);
    throw new Error("Failed to generate coloring page from Gemini API.");
  }
};