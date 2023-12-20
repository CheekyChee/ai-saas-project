'use client';

import { useEffect, useState } from 'react';
import * as z from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { Download, DownloadIcon, ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Heading } from '@/components/heading/heading';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FormSchema, amountOptions, resolutionOptions } from './constant';

import { Empty } from '@/components/empty/empty';
import { Loader } from '@/components/loader/loader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardFooter } from '@/components/ui/card';
import Image from 'next/image';

const ImagePage = () => {
  const route = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: '',
      amount: '1',
      resolution: '512x512',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      setImages([]);

      const response = await axios.post('/api/image', values);

      const urls = response.data.map((image: { url: string }) => image.url);

      setImages(urls);

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

  const { watch } = form;
  const promptValue = watch('prompt');

  return (
    <div>
      <Heading
        title="Image Generation"
        description="Turn your props into an image."
        icon={ImageIcon}
        bgColor="text-green-500/10"
        iconColor="text-green-500"
        key={'image-generation-heading'}
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
                    <FormItem className="col-span-12 lg:col-span-6">
                      <FormControl className="p-1 m-0">
                        <Input
                          className="border-0 outline-none focus-visible:ring-0 focus-within:ring-transparent"
                          disabled={isLoading}
                          placeholder="A picture of feng shui for the bedroom"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="amount"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem className="col-span-12 lg:col-span-2">
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {amountOptions.map((option) => {
                            return (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="resolution"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem className="col-span-12 lg:col-span-2">
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {resolutionOptions.map((option) => {
                            return (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
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
            <div className="p-20">
              <Loader />
            </div>
          )}
          {images.length === 0 && !isLoading && (
            <Empty label="No Images generated." />
          )}

          <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((src) => {
              return (
                <Card key={src} className="overflow-hidden rounded-lg">
                  <div className="relative aspect-square">
                    <Image alt="image" fill src={src} />
                  </div>
                  <CardFooter className="p-2">
                    <Button
                      onClick={() => {
                        window.open(src, '_blank');
                      }}
                      variant={'secondary'}
                      className="w-full"
                    >
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
