'use client';

import { useEffect, useState } from 'react';
import * as z from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { MusicIcon, VideoIcon } from 'lucide-react';
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
import { useProModalStore } from '@/hooks/use-pro-modal';

const MelodyPage = () => {
  const route = useRouter();
  const proModal = useProModalStore();

  const [isMounted, setIsMounted] = useState(false);
  const [video, setVideo] = useState<string>();
  const form = useForm<z.infer<typeof MessageRouteSchema>>({
    resolver: zodResolver(MessageRouteSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof MessageRouteSchema>) => {
    try {
      setVideo(undefined);

      const response = await axios.post('/api/video', values);
      setVideo(response.data[0]);
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
        title="Video Generation"
        description="Create a video from a text prompt"
        icon={VideoIcon}
        bgColor="bg-cyan-500/10"
        iconColor="text-cyan-500"
        key={'video-heading'}
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
                          placeholder="Prompt: Feng Shui advices for room de-cluttering video."
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
          {!video && !isLoading && <Empty label="No Video Generated." />}

          {video && (
            <video
              controls
              className="w-full aspect-video mt-8 rounded-lg border bg-black"
            >
              <source src={video} />
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default MelodyPage;
