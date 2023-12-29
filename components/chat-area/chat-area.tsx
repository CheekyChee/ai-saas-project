'use client';
import { ConversationRouteSchema } from '@/app/(dashboard)/(routes)/conversation/constant';
import { BotAvatar } from '@/components/bot-avatar/bot-avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChat } from 'ai/react'; // Custom chat-related hook
import { useParams } from 'next/navigation';
import { FC, FormEvent, useEffect, useLayoutEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import { z } from 'zod';
import { Empty } from '../empty/empty';
import { Loader } from '../loader/loader';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import { UserAvatar } from '../user-avatar/user-avatar';
import { clerkClient } from '@clerk/nextjs';
export interface ChatAreaProps {
  chatId: string;
  setChatId: (chatId: string) => void;
  // userName: string;
  // userBirthday: string;
}

export const ChatArea: FC<ChatAreaProps> = ({ chatId, setChatId }) => {
  const params = useParams();
  const form = useForm<z.infer<typeof ConversationRouteSchema>>({
    resolver: zodResolver(ConversationRouteSchema),
    defaultValues: {
      prompt: '',
    },
  });
  // 3. Using custom chat hook
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
  } = useChat({
    api: '/api/conversation-with-master',
  });

  const handleLoadChat = async () => {
    if (params.id && typeof params.id === 'string') {
      setChatId(params.id);
      fetch('/api/conversation-with-master', {
        method: 'POST',
        body: JSON.stringify({
          test: 'testing',
          userId: params.id,
          loadMessages: true,
        }),
      }).then((resp) => {
        resp.json().then((data: any[]) => {
          if (data.length === 0) {
            return;
          }
          if (data.length > 0) {
            // 5. Filtering and mapping chat data
            data = data.reverse();
            data = data.filter((item) => item.data.content);
            data = data.map((item, i) => {
              return {
                content: item.data.content,
                role: item.type === 'human' ? 'user' : 'ai',
              };
            });
          }
          setMessages(data);
        });
      });
    }
  };

  // 6. Function to handle all submits
  const handleAllSubmits = (e: any) => {
    if (e.key === 'Enter') {
      handleSubmit(e as FormEvent<HTMLFormElement>, {
        options: {
          body: {
            userId: chatId,
          },
        },
      });
    }
  };

  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight || 0;
    }
  }, [messages]);
  // 9. Using useEffect to load chat messages when the component mounts
  useEffect(() => {
    handleLoadChat();
  }, []);

  return (
    <div className="px-4 pb-8 lg:px-8" ref={containerRef}>
      <div>
        <Form {...form}>
          <form
            onSubmit={handleAllSubmits}
            className="grid w-full grid-cols-12 gap-2 p-4 px-3 border rounded-lg md:px-6 focus-within:shadow-sm"
          >
            <FormField
              name="prompt"
              render={({ field }) => {
                return (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="p-1 m-0">
                      <Input
                        value={input}
                        className="border-0 outline-none focus-visible:ring-0 focus-within:ring-transparent"
                        disabled={isLoading}
                        onChange={handleInputChange}
                        onKeyDown={handleAllSubmits}
                        placeholder="Prompt: What are simple Feng Shui tips for improving energy in a bedroom?"
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <Button
              disabled={isLoading}
              type="submit"
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
                key={message.id}
                className={cn(
                  'p-8 w-full flex items-start gap-x-8 rounded-lg',
                  message.role === 'user'
                    ? 'bg-white border border-black/10'
                    : 'bg-muted'
                )}
              >
                {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm ">
                  <ReactMarkdown className="markdown">
                    {messageContent}
                  </ReactMarkdown>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
