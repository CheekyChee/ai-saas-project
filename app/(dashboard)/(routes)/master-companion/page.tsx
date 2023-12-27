'use client';

import { useEffect, useState } from 'react';
import * as z from 'zod';
import ReactMarkdown from 'react-markdown';
import { MessageSquare } from 'lucide-react';

import { Heading } from '@/components/heading/heading';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { BotAvatar } from '@/components/bot-avatar/bot-avatar';
import { Empty } from '@/components/empty/empty';
import { Loader } from '@/components/loader/loader';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar/user-avatar';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';
import { useRouter } from 'next/navigation';
import { ConversationRouteSchema } from './constant';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useProModalStore } from '@/hooks/use-pro-modal';
import axios from 'axios';

const ConversationWithMasterPage = () => {
  const route = useRouter();
  const proModal = useProModalStore();
  // const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: 'Hi, what would you like to learn about feng shui?',
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  const form = useForm<z.infer<typeof ConversationRouteSchema>>({
    resolver: zodResolver(ConversationRouteSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const [isMounted, setIsMounted] = useState(false);

  const onSubmit = async (values: z.infer<typeof ConversationRouteSchema>) => {
    setError(null);
    // setQuery(values.prompt);

    if (!values.prompt) {
      alert('Please input a question');
      return;
    }

    const question = values.prompt.trim();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));

    setLoading(true);
    form.reset();
    try {
      const response = await axios.post('/api/chat', {
        question,
        history,
      });

      const data = response.data;

      if (data.error) {
        setError(data.error);
        console.log('error', data.error);
      } else {
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
      }
      console.log('messageState', messageState);

      setLoading(false);

      //scroll to bottom
      // messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
    } catch (error: any) {
      setLoading(false);

      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        setError(
          'An error occurred while fetching the data. Please try again.'
        );
      }
      setMessageState((state) => ({
        ...state,
        messages: [],
      }));
    } finally {
      // Code to be executed regardless of success or failure
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

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
          {isLoading ||
            (loading && (
              <div className="flex items-center justify-center w-full p-8 rounded-lg bg-muted">
                <Loader />
              </div>
            ))}
          {messageState.messages.length === 0 && !isLoading && (
            <Empty label="No Conversation started." />
          )}

          <div className="flex flex-col-reverse gap-y-4 ">
            {messageState.messages.map((message, index) => {
              const messageContent = message.message as string;
              return (
                <>
                  <div
                    key={message.type}
                    className={cn(
                      'p-8 w-full flex items-start gap-x-8 rounded-lg',
                      message.type !== 'apiMessage'
                        ? 'bg-white border border-black/10'
                        : 'bg-muted'
                    )}
                  >
                    {message.type !== 'apiMessage' ? (
                      <UserAvatar />
                    ) : (
                      <BotAvatar />
                    )}
                    <p className="text-sm">
                      {<ReactMarkdown>{messageContent}</ReactMarkdown>}
                    </p>
                  </div>
                  {/* {message.sourceDocs && (
                    <div className="" key={`sourceDocsAccordion-${index}`}>
                      <Accordion type="single" collapsible className="flex-col">
                        {message.sourceDocs.map((doc, index) => (
                          <div key={`messageSourceDocs-${index}`}>
                            <AccordionItem value={`item-${index}`}>
                              <AccordionTrigger>
                                <h3>Source {index + 1}</h3>
                              </AccordionTrigger>
                              <AccordionContent>
                                <ReactMarkdown linkTarget="_blank">
                                  {doc.pageContent}
                                </ReactMarkdown>
                                <p className="mt-2">
                                  <b>Source:</b> {doc.metadata.source}
                                </p>
                              </AccordionContent>
                            </AccordionItem>
                          </div>
                        ))}
                      </Accordion>
                    </div>
                  )} */}
                </>
              );
            })}
            {error && (
              <div className="p-4 border border-red-400 rounded-md">
                <p className="text-red-500">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationWithMasterPage;
