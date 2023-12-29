import dynamicAIPrompt from '@/constants/ai-prompt';
import { currentUser } from '@clerk/nextjs';
import { Redis } from '@upstash/redis';
import { LangChainStream, StreamingTextResponse } from 'ai';
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory } from 'langchain/memory';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from 'langchain/prompts';
import { UpstashRedisChatMessageHistory } from 'langchain/stores/message/upstash_redis';

const client = Redis.fromEnv();

export const runtime = 'edge';

export async function POST(req: Request) {
  const { stream, handlers } = LangChainStream();
  const { messages, userId, loadMessages } = await req.json();
  const testPrompt = dynamicAIPrompt;

  const user = await currentUser();

  try {
    if (userId && loadMessages) {
      const populateHistoricChat = await client.lrange(userId, 0, -1);
      return new Response(JSON.stringify(populateHistoricChat));
    }

    const memory = new BufferMemory({
      chatHistory: new UpstashRedisChatMessageHistory({
        sessionId: userId,
        client: Redis.fromEnv(),
      }),
      returnMessages: true,
      memoryKey: 'history',
      inputKey: 'input',
    });

    const multipleInputPrompt = new PromptTemplate({
      inputVariables: ['client_name', 'client_birthdate', 'history', 'input'],
      template: testPrompt,
    });

    const formattedMultipleInputPrompt = await multipleInputPrompt.format({
      client_birthdate: user?.birthday || '',
      client_name: `${user?.firstName} ${user?.lastName}` || '',
      history: messages.map((message: any) => message.content).join('\n'),
      input: messages[messages.length - 1].content,
    });

    const chatPrompt = ChatPromptTemplate.fromMessages([
      ['system', formattedMultipleInputPrompt],
      new MessagesPlaceholder('history'),
      ['human', '{input}'],
    ]);

    const model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0,
      streaming: true,
      maxTokens: 350,
    });

    const chain = new ConversationChain({
      memory,
      llm: model,
      prompt: chatPrompt,
    });

    const lastMessage = messages[messages.length - 1].content;

    chain.call({
      input: lastMessage,
      callbacks: [handlers],
    });
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
    });
  }
}
