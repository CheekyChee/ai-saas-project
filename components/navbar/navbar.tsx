import { UserButton } from '@clerk/nextjs';
import { FC } from 'react';
import MobileSidebar from '../mobile-sidebar/mobile-sidebar';
import { getApiLimitCount } from '@/lib/api-limit';

export interface NavbarProps {}

export const Navbar: FC<NavbarProps> = async (props) => {
  const apiLimitCount = await getApiLimitCount();

  return (
    <div className="flex items-center p-4">
      <MobileSidebar apiLimitCount={apiLimitCount} />
      <div className="flex justify-end w-full">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};
