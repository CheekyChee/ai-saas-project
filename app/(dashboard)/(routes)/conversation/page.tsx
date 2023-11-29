import { Heading } from '@/components/heading/heading';
import { MessageSquare } from 'lucide-react';

const ConversationPage = () => {
  return (
    <div>
      <Heading
        title="Conversation"
        description="Choose your destiny."
        icon={MessageSquare}
        bgColor="bg-yellow-500/10"
        iconColor="text-yellow-500"
        key={'conversation-heading'}
      />
    </div>
  );
};

export default ConversationPage;
