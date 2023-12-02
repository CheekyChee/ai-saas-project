import { useUser } from '@clerk/nextjs';
import { FC, Fragment } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export interface UserAvatarProps {}

export const UserAvatar: FC<UserAvatarProps> = (props) => {
  const { user } = useUser();
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user?.imageUrl} />
      <AvatarFallback>
        {user?.firstName?.charAt(0)}
        {user?.lastName?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};
