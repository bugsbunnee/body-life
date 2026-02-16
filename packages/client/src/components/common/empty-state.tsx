import type React from 'react';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty';
import { Button } from '../ui/button';
import { FolderPlusIcon } from 'lucide-react';

interface Props {
   title: string;
   description: string;
   onAdd?: () => void;
}

const EmptyState: React.FC<Props> = ({ title, description, onAdd }) => {
   return (
      <Empty>
         <EmptyHeader>
            <EmptyMedia variant="icon">
               <FolderPlusIcon />
            </EmptyMedia>

            <EmptyTitle className="capitalize">{title}</EmptyTitle>

            <EmptyDescription>{description}</EmptyDescription>
         </EmptyHeader>

         {onAdd && (
            <EmptyContent className="flex-row justify-center gap-2">
               <Button onClick={onAdd} className="bg-main text-white text-sm font-semibold">
                  Add a record
               </Button>
            </EmptyContent>
         )}
      </Empty>
   );
};

export default EmptyState;
