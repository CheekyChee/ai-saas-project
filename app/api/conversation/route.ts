import openai from '@/constants/openai-config';
import { QA_TEMPLATE } from '@/lib/makechain';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { increaseApiLimit, checkApiLimit } from '@/lib/api-limit';

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

    const freeTrial = await checkApiLimit();
    if (!freeTrial) {
      return new NextResponse('Error: Free trial limit exceeded', {
        status: 403,
      });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k-0613',
      messages: [
        { role: 'system', content: QA_TEMPLATE },
        { role: 'user', content: 'Help me to understand feng shui.' },

        ...body.messages,
      ],
      temperature: 0,
      max_tokens: 500,
    });

    await increaseApiLimit();

    return NextResponse.json(chatCompletion.choices[0].message);
  } catch (error) {
    console.error('[ERROR] conversation/route.ts POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
