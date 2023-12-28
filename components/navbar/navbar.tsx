import { UserButton, auth } from '@clerk/nextjs';
import { FC } from 'react';
import MobileSidebar from '../mobile-sidebar/mobile-sidebar';
import { getApiLimitCount } from '@/lib/api-limit';
import { checkSubscription } from '@/lib/subscription';

export interface NavbarProps {}

export const Navbar: FC<NavbarProps> = async (props) => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();
  const { userId } = auth();
  return (
    <div className="flex items-center p-4">
      <MobileSidebar
        apiLimitCount={apiLimitCount}
        userId={userId as string}
        isPro={isPro}
      />
      <div className="flex justify-end w-full">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};
