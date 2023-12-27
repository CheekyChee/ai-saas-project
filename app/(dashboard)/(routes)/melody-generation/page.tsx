'use client';

import { useEffect, useState } from 'react';
import * as z from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { MusicIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Heading } from '@/components/heading/heading';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { MessageRouteSchema } from './constant';

import { Empty } from '@/components/empty/empty';
import { Loader } from '@/components/loader/loader';
import { ChatCompletionMessageParam } from 'openai/resources';
import { useProModalStore } from '@/hooks/use-pro-modal';

const MelodyPage = () => {
  const route = useRouter();
  const proModal = useProModalStore();

  const [isMounted, setIsMounted] = useState(false);
  const [music, setMusic] = useState<string>();
  const form = useForm<z.infer<typeof MessageRouteSchema>>({
    resolver: zodResolver(MessageRouteSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof MessageRouteSchema>) => {
    try {
      setMusic(undefined);

      const response = await axios.post('/api/melody', values);
      setMusic(response.data.audio);
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
  const promptValue = watch('prompt');

  return (
    <div>
      <Heading
        title="Melody Generation"
        description="Listen to the music of the future."
        icon={MusicIcon}
        bgColor="bg-purple-500/10"
        iconColor="text-purple-500"
        key={'melody-heading'}
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
                          placeholder="Prompt: Feng Shui Music"
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
          {!music && !isLoading && <Empty label="No Melody started." />}

          {music && (
            <audio controls className="w-full mt-8">
              <source src={music} />
            </audio>
          )}
        </div>
      </div>
    </div>
  );
};

export default MelodyPage;
