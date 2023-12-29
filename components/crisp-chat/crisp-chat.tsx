'use client';
import { FC, Fragment } from 'react';
import { useEffect } from 'react';
import { Crisp } from 'crisp-sdk-web';

export interface CrispChatProps {}

export const CrispChat: FC<CrispChatProps> = (props) => {
  useEffect(() => {
    Crisp.configure('ded6a9fb-243e-407a-9662-37df7c5d4a86');
  }, []);

  return null;
};
