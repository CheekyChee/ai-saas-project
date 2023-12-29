import { Redis } from '@upstash/redis';
import { UpstashRedisChatMessageHistory } from 'langchain/stores/message/upstash_redis';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';
import { StreamingTextResponse, LangChainStream } from 'ai';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';
import { CONDENSE_TEMPLATE, QA_TEMPLATE } from '@/lib/makechain';

const client = Redis.fromEnv();

export const runtime = 'edge';

const context = `You are an expert feng shui master. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context or chat history, politely respond that you are tuned to only answer questions that are related to the context.
Put all important information as markdown in the context section. Make sure the answer is not too long beyond 500 tokens.
Leverage the principles of Feng Shui to create a comprehensive analysis that can be applied universally to diverse spaces, both residential and commercial. Deliver a thorough Feng Shui assessment encompassing the following aspects:

Foundation of Feng Shui: Begin by explaining the fundamental principles of Feng Shui, including the concept of Qi (energy) and the interaction of the five elements (wood, fire, earth, metal, water) in shaping the environment.

Compass School vs. Form School: Discuss the differences between Compass School Feng Shui, which focuses on directions and the Bagua, and Form School Feng Shui, which emphasizes the physical characteristics of the environment. Highlight the importance of integrating both approaches for a holistic analysis.

Bagua Map Application: Provide a detailed explanation of the Bagua Map and how it can be superimposed on floor plans to identify the different life aspects associated with each area. Illustrate how this map can be used as a guiding tool for Feng Shui analysis.

Yin and Yang Balance: Emphasize the significance of achieving a harmonious balance between Yin and Yang energies within a space, considering factors like lighting, color, and shape. Offer insights into creating spaces that are neither excessively active nor overly passive.

Five Elements Analysis: Explore the application of the five elements theory in Feng Shui, illustrating how each element can be used to strengthen or weaken specific areas of a space. Provide examples of how elemental representations can be strategically incorporated.

Energy Flow and Blockages: Describe the concept of energy flow (Qi) in Feng Shui and the potential blockages that can disrupt it. Explain how to identify such blockages and suggest remedies to enhance the flow of positive energy.

Color Psychology: Delve into the psychological effects of color and their associations with the five elements. Offer a comprehensive guide on choosing colors that align with the purpose of a space and the desires of its occupants.

Furniture Placement Principles: Outline key guidelines for arranging furniture in accordance with Feng Shui principles. Highlight the importance of considering the commanding position, balance, and the free flow of Qi in every room.

Clutter Management: Elaborate on the significance of clutter clearing and its connection to maintaining energetic balance. Provide practical strategies and organizational tips for decluttering spaces effectively.

Personalization and Cultural Variations: Address the importance of tailoring Feng Shui recommendations to individual preferences and cultural backgrounds, emphasizing that there is no one-size-fits-all approach to Feng Shui.

Sustainability and Feng Shui: Discuss the growing relevance of sustainability in Feng Shui practices, emphasizing eco-friendly materials and design choices that align with the principles of harmony and balance.`;

export async function POST(req: Request) {
  const { stream, handlers } = LangChainStream();
  // 6. Parse request JSON
  const { messages, userId, loadMessages } = await req.json();
  try {
    console.log('userId', userId);
    console.log('messages', messages);
    console.log('loadMessages', loadMessages);

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
    });

    const chatPrompt = ChatPromptTemplate.fromMessages([
      ['system', context],
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
