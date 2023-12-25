import openai from '@/constants/openai-config';
import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const { userId } = auth();

    const { prompt, amount = 1, resolution = '512x512' } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!prompt) {
      return new NextResponse('Error: Prompt not provided', { status: 400 });
    }
    if (!amount) {
      return new NextResponse('Error: Amount not provided', { status: 400 });
    }
    if (!resolution) {
      return new NextResponse('Error: Resolution not provided', {
        status: 400,
      });
    }

    if (!openai.apiKey) {
      return new NextResponse('Error: Open AI Key not configured', {
        status: 500,
      });
    }

    const freeTrial = await checkApiLimit();
    if (!freeTrial) {
      return new NextResponse('Error: Free trial limit exceeded', {
        status: 403,
      });
    }

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });
    await increaseApiLimit();
    console.log('[INFO] image/route.ts POST', response);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('[ERROR] image/route.ts POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
