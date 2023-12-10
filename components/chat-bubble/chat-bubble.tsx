import { FC, Fragment } from 'react';

import { Message } from 'ai/react';
import Balancer from 'react-wrap-balancer';
import { UserAvatar } from '../user-avatar/user-avatar';
import { BotAvatar } from '../bot-avatar/bot-avatar';
import { cn, formattedText } from '@/lib/utils';
import { Empty } from '../empty/empty';
import ReactMarkdown from 'react-markdown';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
interface ChatLineProps extends Partial<Message> {
  sources: string[];
}

const convertNewLines = (text: string) =>
  text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));

export const ChatLine: FC<ChatLineProps> = ({
  role = 'assistant',
  content,
  sources,
}) => {
  const formattedMessage = convertNewLines(content ?? '');

  return (
    <Fragment>
      {/* {sources && sources.length === 0 && (
        <Empty label="No Conversation started." />
      )}

      <div className="flex flex-col-reverse gap-y-4 ">
        <div
          key={role}
          className={cn(
            'p-8 w-full flex items-start gap-x-8 rounded-lg',
            role === 'user' ? 'bg-white border border-black/10' : 'bg-muted'
          )}
        >
          {role === 'user' ? <UserAvatar /> : <BotAvatar />}
          <p className="text-sm">{formattedMessage}</p>
        </div>
      </div> */}
      <Card className="mb-2">
        <CardHeader>
          <CardTitle
            className={
              role != 'assistant'
                ? 'text-amber-500 dark:text-amber-200'
                : 'text-blue-500 dark:text-blue-200'
            }
          >
            {role == 'assistant' ? <BotAvatar /> : <UserAvatar />}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <Balancer>{formattedMessage}</Balancer>
        </CardContent>
        <CardFooter>
          <CardDescription className="w-full">
            {sources && sources.length ? (
              <Accordion type="single" collapsible className="w-full">
                {sources.map((source, index) => (
                  <AccordionItem value={`source-${index}`} key={index}>
                    <AccordionTrigger>{`Source ${index + 1}`}</AccordionTrigger>
                    <AccordionContent>
                      <ReactMarkdown linkTarget="_blank">
                        {formattedText(source)}
                      </ReactMarkdown>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <></>
            )}
          </CardDescription>
        </CardFooter>
      </Card>
    </Fragment>
  );
};
