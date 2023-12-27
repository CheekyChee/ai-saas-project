'use client';

import { FC, Fragment, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from '@/components/sidebar/sidebar';
import { auth } from '@clerk/nextjs';

interface MobileSidebarProps {
  apiLimitCount: number;
  userId: string;
}

const MobileSidebar: FC<MobileSidebarProps> = ({ apiLimitCount, userId }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant={'ghost'} size={'icon'} className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={'left'} className="p-0">
        <Sidebar apiLimitCount={apiLimitCount} userId={userId as string} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
