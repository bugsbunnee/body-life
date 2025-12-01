import React, { useState } from 'react';
import axios from 'axios';

import { HiSparkles } from 'react-icons/hi';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import Markdown from 'react-markdown';
import UpdateMessageSummaryForm from '../forms/updated-message-summary-form';

import type { IMessage, ISummary } from '@/utils/entities';
import { getErrorMessage } from '@/lib/utils';

import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface Props {
   message: IMessage;
}

const MessageSummary: React.FC<Props> = ({ message }) => {
   const [isMessageEditVisible, setMessageEditVisible] = useState(false);

   const mutation = useMutation({
      mutationFn: () => axios.post<{ data: ISummary }>(`/api/message/${message.id}/summarize`),
      onSuccess: () => window.location.reload(),
      onError: (error) =>
         toast('Could not add the messsage', {
            description: getErrorMessage(error),
         }),
   });

   return (
      <div className="border border-[#EFEFEF] rounded-md flex flex-col">
         <div className="border-b border-b-[#EFEFEF] bg-blue-light text-base text-main font-semibold py-3 px-3.5 capitalize flex items-center justify-start">
            <div className="flex-1">
               <span>Message Summary</span>
            </div>

            {isMessageEditVisible && <Badge onClick={() => setMessageEditVisible(false)}>Cancel</Badge>}

            {!isMessageEditVisible && message.summary && <Badge onClick={() => setMessageEditVisible(true)}>Edit</Badge>}
         </div>

         <div className="px-3.5 py-4 gap-x-2">
            {isMessageEditVisible ? (
               <UpdateMessageSummaryForm messageId={message.id} content={message.summary!.content} />
            ) : (
               <ScrollArea className="h-80 rounded-md border p-4">
                  {message.summary ? (
                     <Markdown>{message.summary.content}</Markdown>
                  ) : (
                     <div className="d-flex items-center gap-x-4">
                        <div className="mb-4 bg-blue-light rounded-md p-4 border border-border font-medium text-sm text-center text-main">
                           No summary yet. Click the button to generate
                        </div>
                     </div>
                  )}
               </ScrollArea>
            )}

            <Button
               disabled={mutation.isPending}
               onClick={() => mutation.mutate()}
               className="w-full bg-main rounded-md px-4 py-6 mt-4 text-white"
            >
               {mutation.isPending ? (
                  'Summarizing...'
               ) : (
                  <>
                     <HiSparkles /> {message.summary ? 'Re-generate' : 'Generate'} Summary
                  </>
               )}

               {mutation.isPending && (
                  <span className="relative flex size-3 ml-4">
                     <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-light opacity-75"></span>
                     <span className="relative inline-flex size-3 rounded-full bg-blue-light"></span>
                  </span>
               )}
            </Button>
         </div>
      </div>
   );
};

export default MessageSummary;
