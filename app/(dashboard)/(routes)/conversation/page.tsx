'use client';

import * as z from 'zod';
import { useEffect, useState } from 'react';

import { MessageSquare, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Heading } from '@/components/heading/heading';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';

import { ConversationRouteSchema } from './constant';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

import { Empty } from '@/components/empty/empty';
import { Loader } from '@/components/loader/loader';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/user-avatar/user-avatar';
import { BotAvatar } from '@/components/bot-avatar/bot-avatar';
import { ChatCompletionMessageParam } from 'openai/resources';
import { useProModalStore } from '@/hooks/use-pro-modal';
import ReactMarkdown from 'react-markdown';

const ConversationPage = () => {
  const route = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const form = useForm<z.infer<typeof ConversationRouteSchema>>({
    resolver: zodResolver(ConversationRouteSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const proModal = useProModalStore();

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof ConversationRouteSchema>) => {
    try {
      const userMessage: ChatCompletionMessageParam = {
        role: 'user',
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];
      console.log('newMessages', newMessages);

      const response = await axios.post('/api/conversation', {
        messages: newMessages,
      });

      setMessages((current) => [...current, userMessage, response.data]);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      }
      console.error(error);
    } finally {
      route.refresh();
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const { watch } = form;

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
      <div className="px-4 pb-8 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid w-full grid-cols-12 gap-2 p-4 px-3 border rounded-lg md:px-6 focus-within:shadow-sm"
            >
              <FormField
                name="prompt"
                render={({ field }) => {
                  return (
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="p-1 m-0">
                        <Input
                          className="border-0 outline-none focus-visible:ring-0 focus-within:ring-transparent"
                          disabled={isLoading}
                          placeholder="Prompt: What are simple Feng Shui tips for improving energy in a bedroom?"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <Button
                disabled={isLoading}
                className="w-full col-span-12 lg:col-span-2"
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>

        <div className="mt-4 space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center w-full p-8 rounded-lg bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No Conversation started." />
          )}

          <div className="flex flex-col-reverse gap-y-4 ">
            {messages.map((message, index) => {
              const messageContent = message.content as string;
              return (
                <div
                  key={message.role}
                  className={cn(
                    'p-8 w-full flex items-start gap-x-8 rounded-lg',
                    message.role === 'user'
                      ? 'bg-white border border-black/10'
                      : 'bg-muted'
                  )}
                >
                  {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
                  <p className="text-sm">
                    {
                      <ReactMarkdown linkTarget="_blank">
                        {messageContent}
                      </ReactMarkdown>
                    }
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
