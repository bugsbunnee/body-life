import type React from 'react';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
   visible: boolean;
}

const Conditional: React.FC<Props> = ({ children, visible }) => {
   return visible ? children : null;
};

export default Conditional;
