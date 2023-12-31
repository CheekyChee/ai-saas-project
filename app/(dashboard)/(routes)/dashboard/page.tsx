'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { auth, useAuth } from '@clerk/nextjs';
import {
  ArrowRight,
  Code,
  ImageIcon,
  MessageSquare,
  MusicIcon,
  Paperclip,
  UserIcon,
  VideoIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const router = useRouter();
  // const { userId } = auth();
  const { userId } = useAuth();
  const timestamp = Math.round(new Date().getTime());

  const tools = [
    {
      label: 'Conversation',
      icon: MessageSquare,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      href: '/conversation',
    },
    {
      label: 'Image Generation',
      icon: ImageIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      href: '/image-generation',
    },
    {
      label: 'Video Generation',
      icon: VideoIcon,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      href: '/video-generation',
    },
    {
      label: 'Melody Generation',
      icon: MusicIcon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      href: '/melody-generation',
    },
    {
      label: 'Code Generation',
      icon: Code,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      href: '/code-generation',
    },
    {
      label: 'Master Companion',
      icon: UserIcon,
      href: `/master-companion/${userId}-${timestamp}`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Master Conversation',
      icon: UserIcon,
      href: '/conversation-with-master',
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
  ];
  return (
    <div className="pb-8">
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold text-center md:text-4xl">
          Explore the World of Feng Shui AI
        </h2>
        <p className="text-sm font-light text-center text-muted-foreground md:text-lg">
          Welcome to Feng Shui AI, your personal guide to harmonizing your
          surroundings. Improve your wellbeing, productivity, and prosperity
          with our intuitive and easy-to-use tool.
        </p>
      </div>
      <div className="px-4 space-y-4 md:px-20 lg:px-32">
        {tools.map((tool) => {
          return (
            <Card
              onClick={() => router.push(tool.href)}
              key={tool.href}
              className="flex items-center justify-between p-4 transition cursor-pointer border-black-5 hover:shadow-md"
            >
              <div className="flex items-center gap-x-4">
                <div className={cn('p-2 w-fit rounded-md', tool.bgColor)}>
                  <tool.icon className={cn('h-8 w-8', tool.color)} />
                </div>
                <div className="font-semibold">{tool.label}</div>
              </div>
              <ArrowRight className="w-5 h-5 text-black-5" />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
