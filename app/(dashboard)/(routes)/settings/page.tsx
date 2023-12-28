import { Heading } from '@/components/heading/heading';
import { SubscriptionButton } from '@/components/subscription-button/subscription-button';
import { checkSubscription } from '@/lib/subscription';
import { Settings } from 'lucide-react';
import { Fragment } from 'react';

const SettingPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div>
      <Heading
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        iconColor="text-gray-500"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-4 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro
            ? "You're a Feng Shui Pro!"
            : "You're currently on a Feng Shui Free Plan!"}
        </div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default SettingPage;
