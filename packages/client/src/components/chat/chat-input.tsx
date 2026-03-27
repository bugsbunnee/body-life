import type { KeyboardEvent } from 'react';

import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { SendIcon } from 'lucide-react';

export type ChatFormData = {
   prompt: string;
};

export type ChatInputProps = {
   onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit }: ChatInputProps) => {
   const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

   const submit = handleSubmit((data) => {
      reset({ prompt: '' });
      onSubmit(data);
   });

   const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         submit();
      }
   };

   return (
      <form onSubmit={submit} onKeyDown={handleKeyDown} className="flex flex-col gap-2 items-end border  p-4 rounded-2xl">
         <textarea
            {...register('prompt', {
               required: true,
               validate: (data) => data.trim().length > 0,
            })}
            autoFocus
            className="w-full border-0 focus:outline-0 resize-none"
            placeholder="Ask anything"
            maxLength={1000}
         />

         <div className="flex items-center justify-center gap-x-2">
            <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
               <SendIcon />
            </Button>
         </div>
      </form>
   );
};

export default ChatInput;
