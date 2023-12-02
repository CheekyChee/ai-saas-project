import openai from '@/constants/openai-config';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const instructionMessage: ChatCompletionMessageParam = {
  role: 'system',
  content:
    'You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.',
};

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse('Error: Open AI Key not configured', {
        status: 500,
      });
    }

    if (!body.messages) {
      return new NextResponse('Error: Message not provided', { status: 400 });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [instructionMessage, ...body.messages],
    });

    return NextResponse.json(chatCompletion.choices[0].message);
  } catch (error) {
    console.error('[ERROR] code/route.ts POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
