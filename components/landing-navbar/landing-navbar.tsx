'use client';
import { FC, Fragment } from 'react';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';

const font = Montserrat({
  weight: '600',
  subsets: ['latin'],
});

export interface LandingNavbarProps {}

export const LandingNavbar: FC<LandingNavbarProps> = (props) => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href={'/'} className="flex items-center">
        <div className="relative h-8 w-8 mr-4">
          <Image src="/Feng_shui_logo.png" alt="Logo" fill />
        </div>
        <h1 className={cn('text-2xl font-bold text-white', font.className)}>
          Feng Shui AI
        </h1>
      </Link>
      <div className="flex items-center gap-x-2">
        <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
          <Button variant={'outline'}>Get Started</Button>
        </Link>
      </div>
    </nav>
  );
};
