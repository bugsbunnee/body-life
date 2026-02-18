import http from './http.service';

export const sendMessage = async <T>(prompt: string, conversationId: string) => {
   const { data } = await http.post<T>('/api/chat', {
      prompt,
      conversationId,
   });

   return data;
};

export const transcribeAudio = async <T>(blob: Blob) => {
   const formData = new FormData();
   formData.append('file', blob, 'recording.webm');

   const response = await http.post<T>('/api/chat/transcribe', formData);
   return response.data;
};
