import { FC, Fragment } from 'react';
import { Avatar, AvatarImage } from '../ui/avatar';

export interface BotAvatarProps {}

export const BotAvatar: FC<BotAvatarProps> = (props) => {
  return (
    <Avatar className="w-8 h-8 scale-125">
      <AvatarImage className="p-1" src={'/Feng_shui_logo.png'} />
    </Avatar>
  );
};
