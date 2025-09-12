import React, { useState, useRef, useEffect } from 'react';
import { FaCircle, FaStop } from 'react-icons/fa';
import { motion } from 'motion/react';

import type { ChatInputProps } from '@/components/chat/chat-input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { transcribeAudio } from '@/services/chat.service';

const ChatRecorder: React.FC<ChatInputProps> = ({ onSubmit }) => {
   const [recording, setRecording] = useState(false);
   const [audioURL, setAudioURL] = useState<string | null>(null);
   const [levels, setLevels] = useState([5, 10, 15, 10, 5]);

   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
   const chunks = useRef<BlobPart[]>([]);

   const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
         if (event.data.size > 0) chunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
         const blob = new Blob(chunks.current, { type: 'audio/webm' });
         setAudioURL(URL.createObjectURL(blob));

         const { message } = await transcribeAudio<{ message: string }>(blob);
         onSubmit({ prompt: message });

         chunks.current = [];
      };

      mediaRecorderRef.current.start();
      setRecording(true);
   };

   const stopRecording = () => {
      if (mediaRecorderRef.current) {
         mediaRecorderRef.current.stop();
         setRecording(false);
      }
   };

   useEffect(() => {
      if (recording) {
         const interval = setInterval(() => {
            setLevels((previous) => previous.map(() => Math.floor(Math.random() * 20) + 5));
         }, 200);

         return () => clearInterval(interval);
      }
   }, [recording]);

   return (
      <div className="flex items-center justify-center gap-x-2">
         <Button
            onClick={recording ? stopRecording : startRecording}
            className={cn(['rounded-full w-9 h-9', recording ? 'bg-red-500' : 'bg-green-500'])}
         >
            {recording ? <FaStop /> : <FaCircle />}
         </Button>

         {recording ? (
            <div className="flex items-center gap-1 h-16">
               {levels.map((height, i) => (
                  <motion.div
                     key={i}
                     className="w-1 bg-red-500 rounded-full"
                     animate={{ height }}
                     style={{ height }}
                     transition={{
                        type: 'spring',
                        stiffness: 100,
                        damping: 12,
                     }}
                  />
               ))}
            </div>
         ) : (
            audioURL && <audio controls src={audioURL}></audio>
         )}
      </div>
   );
};

export default ChatRecorder;
