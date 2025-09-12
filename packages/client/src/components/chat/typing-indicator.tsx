import React from 'react';

type DotProps = {
   className?: string;
};

const Dot: React.FC<DotProps> = ({ className }) => <div className={`w-2 h-2 rounded-full bg-gray-800 animate-pulse ${className}`}></div>;

const TypingIndicator: React.FC = () => {
   return (
      <div className="flex self-start gap-1 px-3 py-3 bg-gray-200 rounded-xl">
         <Dot />
         <Dot className="[animation-delay:0.2s]" />
         <Dot className="[animation-delay:0.4s]" />
      </div>
   );
};

export default TypingIndicator;
