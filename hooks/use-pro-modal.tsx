import { create } from 'zustand';

import { FC, Fragment } from 'react';

export interface UseProModalStoreProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useProModalStore = create<UseProModalStoreProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

// export const UseProModalStore: FC<UseProModalStoreProps> = ({
//   isOpen,
//   onClose,
//   onOpen,
// }) => {

//   return <Fragment></Fragment>;
// };
