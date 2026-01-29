import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackResponse } from '../types';

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

const fileToPart = (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeSubmission = async (
  name: string,
  weekLabel: string,
  file: File
): Promise<FeedbackResponse> => {
  try {
    const ai = getGeminiClient();
    
    // We prioritize image analysis if the file is an image
    const isImage = file.type.startsWith('image/');
    
    let contents: any[] = [];
    
    if (isImage) {
      const imagePart = await fileToPart(file);
      contents = [
        imagePart,
        { text: `훈련생 이름: ${name}, 해당 주차: ${weekLabel}. 이 이미지는 훈련생이 제출한 제자훈련 과제물(큐티, 워크시트 등)입니다. 내용을 읽을 수 있다면 간단히 요약하고, 훈련생에게 따뜻한 격려의 말을 건네주세요. 내용을 읽을 수 없다면 제출에 대한 감사와 격려만 해주세요.` }
      ];
    } else {
      // For non-image files (PDF/Docs), we can't easily parse client-side without heavy libraries.
      // So we ask Gemini to generate a generic encouragement based on the metadata.
      contents = [
        { text: `훈련생 이름: ${name}, 해당 주차: ${weekLabel}. 과제 파일을 제출했습니다. 파일 내용 확인 전에, 훈련생에게 제출에 대한 감사와 해당 주차 주제와 관련된 짧은 영적 격려의 메시지를 생성해주세요. 격려의 말은 따뜻하고 부드러운 어조로 해주세요.` }
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: contents },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING, description: "A brief summary or acknowledgment of the submission." },
            encouragement: { type: Type.STRING, description: "A warm, spiritual encouragement message for the trainee." }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    return JSON.parse(resultText) as FeedbackResponse;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback response if AI fails
    return {
      message: `${name}님의 ${weekLabel} 과제가 성공적으로 접수되었습니다.`,
      encouragement: "수고하셨습니다! 훈련을 통해 더욱 성장하시길 축복합니다."
    };
  }
};