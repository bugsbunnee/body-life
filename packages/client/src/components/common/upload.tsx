import React from 'react';
import Conditional from './conditional';

import { useDropzone } from 'react-dropzone';
import { Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

interface Props {
   file: File;
   onUploadFile: (files: File[]) => void;
}
const Upload: React.FC<Props> = ({ file, onUploadFile }) => {
   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: onUploadFile });

   return (
      <Empty {...getRootProps()} className="border border-dashed">
         <input {...getInputProps()} />

         <EmptyHeader>
            <EmptyMedia variant="icon">
               <Cloud />
            </EmptyMedia>

            <EmptyTitle>Upload File</EmptyTitle>

            <Conditional visible={!!file}>{file && <EmptyDescription>{file.name}</EmptyDescription>}</Conditional>

            <Conditional visible={!file}>
               <EmptyDescription>{isDragActive ? 'Drop the files here ...' : 'Drag and drop some files here, or click to select files'}</EmptyDescription>
            </Conditional>
         </EmptyHeader>

         <EmptyContent>
            <Button type="button" variant="outline" size="sm">
               Click to upload
            </Button>
         </EmptyContent>
      </Empty>
   );
};

export default Upload;
