import React, { useEffect, useRef } from 'react';
import Conditional from './conditional';

import type { PickerOption } from '@/utils/entities';
import type { ComboboxRootChangeEventDetails } from '@base-ui/react';

import { FaSpinner } from 'react-icons/fa';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';

interface Props {
   isTriggered: boolean;
   data: PickerOption[];
   placeholder: string;
   value: PickerOption | undefined;
   onTriggerSearch: (search: string) => void;
   onValueChange: (value: PickerOption | null) => void;
}

const SearchableSelect: React.FC<Props> = ({ data, placeholder, value, isTriggered, onValueChange, onTriggerSearch }) => {
   const debounceRef = useRef<NodeJS.Timeout | null>(null);

   const handleValueInputChange = (value: string, details: ComboboxRootChangeEventDetails) => {
      if (details.reason === 'item-press') {
         return;
      }

      if (debounceRef.current) {
         clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => onTriggerSearch(value), 400);
   };

   useEffect(() => {
      return () => {
         if (debounceRef.current) {
            clearTimeout(debounceRef.current);
         }
      };
   }, []);

   return (
      <Combobox filter={null} value={value} onValueChange={onValueChange} items={data} autoHighlight onInputValueChange={handleValueInputChange}>
         <ComboboxInput className="rounded-lg border border-border px-1 shadow-none w-full h-14" placeholder={placeholder} />

         <ComboboxContent>
            <Conditional visible={isTriggered}>
               <div className="flex items-center text-left gap-x-2 text-sm text-dark p-3">
                  <div className="animate-spin">
                     <FaSpinner />
                  </div>

                  <span>Searching...</span>
               </div>
            </Conditional>

            <Conditional visible={data.length === 0}>
               <ComboboxEmpty className="flex items-center justify-start p-3 text-sm text-dark text-left">No items found.</ComboboxEmpty>
            </Conditional>

            <Conditional visible={data.length > 0}>
               <ComboboxList>
                  {(item: PickerOption) => (
                     <ComboboxItem key={item.label} value={item}>
                        {item.label}
                     </ComboboxItem>
                  )}
               </ComboboxList>
            </Conditional>
         </ComboboxContent>
      </Combobox>
   );
};

export default SearchableSelect;
