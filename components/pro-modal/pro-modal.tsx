'use client';

import { FC, Fragment } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useProModalStore } from '@/hooks/use-pro-modal';
import { Badge } from '../ui/badge';
import {
  MessageSquare,
  ImageIcon,
  VideoIcon,
  MusicIcon,
  Code,
  UserIcon,
  Check,
  Zap,
  Paperclip,
} from 'lucide-react';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export const ProModal = () => {
  const proModal = useProModalStore();

  const tools = [
    {
      label: 'Conversation',
      icon: MessageSquare,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Image Generation',
      icon: ImageIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Video Generation',
      icon: VideoIcon,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      label: 'Melody Generation',
      icon: MusicIcon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Code Generation',
      icon: Code,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
    {
      label: 'Master Companion',
      icon: UserIcon,
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
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];
  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold py-1">
              Upgrade to Feng Shui
              <Badge variant="premium" className="uppercase text-sm py-1">
                pro
              </Badge>
            </div>
          </DialogTitle>

          <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {tools.map((tool) => {
              return (
                <Card
                  key={tool.label}
                  className="p-3 border-black/5 flex items-center justify-between"
                >
                  <div className=" flex items-center gap-x-4">
                    <div className={cn('p-2 w-fit rounded-md', tool.bgColor)}>
                      <tool.icon className={cn('w-6 h-6', tool.color)} />
                    </div>
                    <div className="font-semibold text-sm">{tool.label}</div>
                  </div>
                  <Check className="w-5 h-5 text-primary" />
                </Card>
              );
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button size="lg" variant={'premium'} className="w-full ">
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </DialogFooter>
      </DialogContent>{' '}
    </Dialog>
  );
};
