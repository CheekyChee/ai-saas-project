'use client';

import { FC, Fragment } from 'react';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  MusicIcon,
  Paperclip,
  Settings,
  UserIcon,
  VideoIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { FreeCounter } from '../free-counter/free-counter';
import { auth } from '@clerk/nextjs';

const monteserrat = Montserrat({
  weight: '600',
  subsets: ['latin'],
});

export interface SidebarProps {
  apiLimitCount: number;
  userId: string;
}

const Sidebar: FC<SidebarProps> = ({ apiLimitCount = 0, userId }) => {
  const pathname = usePathname();

  const timestamp = Math.round(new Date().getTime());

  const routes = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      color: 'text-red-500',
    },
    {
      label: 'Conversation',
      icon: MessageSquare,
      href: '/conversation',
      color: 'text-yellow-500',
    },
    {
      label: 'Image Generation',
      icon: ImageIcon,
      href: '/image-generation',
      color: 'text-green-500',
    },
    {
      label: 'Video Generation',
      icon: VideoIcon,
      href: '/video-generation',
      color: 'text-cyan-500',
    },
    {
      label: 'Melody Generation',
      icon: MusicIcon,
      href: '/melody-generation',
      color: 'text-purple-500',
    },
    {
      label: 'Code Generation',
      icon: Code,
      href: '/code-generation',
      color: 'text-pink-700',
    },
    {
      label: 'Master Companion',
      icon: UserIcon,
      href: `/master-companion/${userId}-${timestamp}`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'History',
      icon: Paperclip,
      href: '/history',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Master Conversation',
      icon: UserIcon,
      href: '/conversation-with-master',
      color: 'text-orange-500',
    },
    {
      label: 'Settngs',
      icon: Settings,
      href: '/settings',
      color: 'text-white',
    },
  ];
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="flex-1 px-3 py-2">
        <Link href={'/dashboard'} className="flex items-center pl-3 mb-14 ">
          <div className="relative w-8 h-8 mr-4">
            <Image fill alt="logo" src={'/Feng_shui_logo.png'} />
          </div>
          <h1 className={cn('text-2xl font-bold', monteserrat.className)}>
            Feng Shui AI
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                'flex justify-start w-full p-3 text-sm font-medium transition rounded-lg cursor-pointer group hover:text-white hover:bg-white/10',
                pathname === route.href
                  ? 'text-white bg-white/10'
                  : 'text-zinc-400'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <FreeCounter apiLimitCount={apiLimitCount} />
    </div>
  );
};

export default Sidebar;
