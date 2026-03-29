import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../ui/input-group';

const PasswordInput: React.FC<React.ComponentProps<'input'>> = (field) => {
   const [isPasswordVisible, setPasswordVisible] = useState(false);

   return (
      <InputGroup className="h-[3.5rem] rounded-xl border border-border px-2 shadow-none w-full">
         <InputGroupInput {...field} id={field.name} type={isPasswordVisible ? 'text' : 'password'} autoComplete="off" />

         <InputGroupAddon align="inline-end">
            <InputGroupButton aria-label="Toggle" title="Toggle" size="icon-xs" onClick={() => setPasswordVisible((prev) => !prev)}>
               {isPasswordVisible ? <EyeIcon /> : <EyeOffIcon className="text-base" />}
            </InputGroupButton>
         </InputGroupAddon>
      </InputGroup>
   );
};

export default PasswordInput;
