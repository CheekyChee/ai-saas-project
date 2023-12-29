import { FC, Fragment } from 'react';
import { useEffect, useRef, useLayoutEffect, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useChat } from 'ai/react'; // Custom chat-related hook
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { UserAvatar } from '../user-avatar/user-avatar';
import { BotAvatar } from '@/components/bot-avatar/bot-avatar';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import { Loader } from '../loader/loader';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ConversationRouteSchema } from '@/app/(dashboard)/(routes)/conversation/constant';
import { z } from 'zod';
import { Empty } from '../empty/empty';
export interface ChatAreaProps {
  chatId: string;
  setChatId: (chatId: string) => void;
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

  console.log('messages', messages);

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
    // <div className="h-screen w-full m-5 flex flex-col justify-between ">
    //   <div
    //     ref={containerRef}
    //     className="h-full flex flex-col overflow-y-auto overflow-x-hidden"
    //   >
    //     {messages.length > 0
    //       ? messages.map((m) => (
    //           <div
    //             key={m.id}
    //             className={`${
    //               m.role === 'user' ? 'flex justify-end' : 'flex justify-start'
    //             } my-1`}
    //           >
    //             <div
    //               className={`max-w-3/4 px-4 py-2 rounded-lg ${
    //                 m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200'
    //               }`}
    //             >
    //               {m.content}
    //             </div>
    //           </div>
    //         ))
    //       : null}
    //   </div>
    // <form onSubmit={handleAllSubmits} className="">
    //   <Textarea
    //     value={input}
    //     placeholder="Say something..."
    //     onChange={handleInputChange}
    //     onKeyDown={handleAllSubmits}
    //     className="w-full my-2"
    //   />
    //   <Button className="w-full mb-2">Send</Button>
    // </form>
    // </div>
    <div className="px-4 pb-8 lg:px-8" ref={containerRef}>
      <div>
        {/* <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAllSubmits(e);
          }}
          className=""
        >
          <Textarea
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            onKeyDown={handleAllSubmits}
            className="w-full my-2"
          />
          <Button type="submit" className="w-full mb-2">
            Send
          </Button>
        </form> */}
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
