'use client';

import { MessageSquare } from 'lucide-react';
import { useState } from 'react';

import { Heading } from '@/components/heading/heading';

import { useRouter } from 'next/navigation';

import { ChatArea } from '@/components/chat-area/chat-area';
import { useProModalStore } from '@/hooks/use-pro-modal';

const ConversationWithMasterPage = () => {
  const [chatId, setChatId] = useState('');

  return (
    <div>
      <Heading
        title="Master Companion"
        description="Choose your destiny."
        icon={MessageSquare}
        bgColor="bg-yellow-500/10"
        iconColor="text-yellow-500"
        key={'conversation-heading'}
      />

      <ChatArea chatId={chatId} setChatId={setChatId} />
    </div>
  );
};

export default ConversationWithMasterPage;
