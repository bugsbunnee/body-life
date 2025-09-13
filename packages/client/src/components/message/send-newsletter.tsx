import type React from 'react';
import axios from 'axios';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { IMessage } from '@/utils/entities';
import { Button } from '../ui/button';
import { MdEmail } from 'react-icons/md';

interface Props {
   message: IMessage;
}

const SendNewsLetter: React.FC<Props> = ({ message }) => {
   const mutation = useMutation({
      mutationFn: () => axios.post(`/api/message/${message.id}/newsletter`),
      onSuccess: () => toast('Sent out newsletter successfully!'),
      onError: () => toast('Something failed while sending out the newsletter'),
   });

   return (
      <Button
         disabled={mutation.isPending}
         onClick={() => mutation.mutate()}
         className="hover:text-white px-8 text-sm text-main border border-border shadow-none bg-blue-light font-semibold rounded-sm h-12"
      >
         <MdEmail /> {mutation.isPending ? 'Sending out newsletter...' : 'Send Newsletter'}
      </Button>
   );
};

export default SendNewsLetter;
