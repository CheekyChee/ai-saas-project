'use client';
import { FC, Fragment, useState } from 'react';
import { Button } from '../ui/button';
import { Zap } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export interface SubscriptionButtonProps {
  isPro: boolean;
}

export const SubscriptionButton: FC<SubscriptionButtonProps> = ({
  isPro = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get('/api/stripe');

      window.location.href = response.data.url;
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isPro ? 'default' : 'premium'}
      disabled={isLoading}
      onClick={onClick}
    >
      {isPro ? 'Manage Subscription' : 'Upgrade'}
      {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
    </Button>
  );
};
