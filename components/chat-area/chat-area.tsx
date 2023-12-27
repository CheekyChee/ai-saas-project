import { FC, Fragment } from 'react';

export interface ChatAreaProps {
  chatId: string;
  setChatId: (chatId: string) => void;
}

export const ChatArea: FC<ChatAreaProps> = ({ chatId, setChatId }) => {
  return <Fragment></Fragment>;
};
