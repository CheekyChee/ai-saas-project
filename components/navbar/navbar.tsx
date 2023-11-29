import { UserButton } from '@clerk/nextjs';
import { FC } from 'react';
import MobileSidebar from '../mobile-sidebar/mobile-sidebar';

export interface NavbarProps {}

export const Navbar: FC<NavbarProps> = (props) => {
  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex justify-end w-full">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};
