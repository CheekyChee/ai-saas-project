'use client';

import { useEffect, useState } from 'react';
import * as z from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { Code } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Heading } from '@/components/heading/heading';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

import { BotAvatar } from '@/components/bot-avatar/bot-avatar';
import { Empty } from '@/components/empty/empty';
import { Loader } from '@/components/loader/loader';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar/user-avatar';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { CodeGenerationRouteSchema } from './constant';

const CodePage = () => {
  const route = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const form = useForm<z.infer<typeof CodeGenerationRouteSchema>>({
    resolver: zodResolver(CodeGenerationRouteSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (
    values: z.infer<typeof CodeGenerationRouteSchema>
  ) => {
    try {
      const userMessage: ChatCompletionMessageParam = {
        role: 'user',
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];
      console.log('newMessages', newMessages);

      const response = await axios.post('/api/code', {
        messages: newMessages,
      });

      setMessages((current) => [...current, userMessage, response.data]);
      form.reset();
    } catch (error) {
      //TODO : open pro modal
      console.error(error);
    } finally {
      route.refresh();
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate code using descriptive text."
        icon={Code}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
        key={'-heading'}
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
                          placeholder="Prompt: simple toggle button with react"
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
                  <ReactMarkdown
                    components={{
                      pre: ({ node, ...props }) => (
                        <div className="w-full p-2 my-2 overflow-auto rounded-lg bg-black/10">
                          <pre {...props} />
                        </div>
                      ),
                      code: ({ node, ...props }) => (
                        <code
                          className="p-1 rounded-lg bg-black/10"
                          {...props}
                        />
                      ),
                    }}
                    className={'text-sm overflow-hidden leading-7'}
                  >
                    {messageContent || ''}
                  </ReactMarkdown>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;
