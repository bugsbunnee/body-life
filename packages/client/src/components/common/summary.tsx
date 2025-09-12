import React from 'react';

interface Props {
   title: string;
   labels: {
      key: string;
      value: string;
   }[];
}

const Summary: React.FC<Props> = ({ title, labels }) => {
   return (
      <div className="border border-[#EFEFEF] rounded-md flex flex-col">
         <div className="border-b border-b-[#EFEFEF] bg-blue-light text-base text-main font-semibold py-3 px-3.5 capitalize">{title}</div>

         <dl className="grid grid-cols-[min-content_1fr] px-3.5 py-4 gap-x-2">
            {labels.map((label) => (
               <React.Fragment key={label.key}>
                  <dt className="text-gray-neutral text-nowrap font-medium text-sm pb-3.5">{label.key}:</dt>
                  <dd className="font-medium text-sm text-dark pb-3.5">{label.value}</dd>
               </React.Fragment>
            ))}
         </dl>
      </div>
   );
};

export default Summary;
