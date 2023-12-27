'use client';

import { FC, Fragment, useEffect, useState } from 'react';
import { ProModal } from '../pro-modal/pro-modal';

export interface ModalProviderProps {}

export const ModalProvider: FC<ModalProviderProps> = (props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <ProModal />
    </>
  );
};
