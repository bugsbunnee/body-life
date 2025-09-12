import { useRef, useState } from 'react';
import { sendMessage } from '@/services/chat.service';

import type { Message } from './chat-messages';
import ChatInput, { type ChatFormData } from './chat-input';
import ChatMessages from './chat-messages';
import TypingIndicator from './typing-indicator';

import popSound from '@/assets/sounds/pop.mp3';
import notificationSound from '@/assets/sounds/notification.mp3';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState('');
   const conversationId = useRef(crypto.randomUUID());

   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);
         setError('');

         popAudio.play();

         const data = await sendMessage<ChatResponse>(prompt, conversationId.current);

         setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);

         notificationAudio.play();
      } catch (error) {
         console.error(error);
         setError('Something went wrong, try again!');
      } finally {
         setIsBotTyping(false);
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
            <ChatMessages messages={messages} />

            {isBotTyping && <TypingIndicator />}

            {error && <p className="text-red-500">{error}</p>}
         </div>

         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBot;
