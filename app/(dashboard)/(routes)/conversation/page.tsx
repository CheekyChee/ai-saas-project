'use client';

import * as z from 'zod';

import { MessageSquare } from 'lucide-react';
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

import { ConversationRouteSchema } from './constant';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const ConversationPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  const form = useForm<z.infer<typeof ConversationRouteSchema>>({
    resolver: zodResolver(ConversationRouteSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof ConversationRouteSchema>) => {
    console.log(values);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const { watch } = form;
  const promptValue = watch('prompt');

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
      <div className="px-4 lg:px-8">
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
                          placeholder="Enter your prompt..."
                          {...field}
                        />
                      </FormControl>
                      {!promptValue && (
                        <FormDescription className="text-gray-400">
                          {
                            'Example: What are simple Feng Shui tips for improving energy in a bedroom?'
                          }
                        </FormDescription>
                      )}
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
      </div>
    </div>
  );
};

export default ConversationPage;
