import Replicate from 'replicate';
import { QA_TEMPLATE } from '@/lib/makechain';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!prompt) {
      return new NextResponse('Error: Prompt not provided', { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    if (!freeTrial) {
      return new NextResponse('Error: Free trial limit exceeded', {
        status: 403,
      });
    }

    const response = await replicate.run(
      'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
      {
        input: {
          prompt: prompt,
        },
      }
    );

    await increaseApiLimit();

    return NextResponse.json(response);
  } catch (error) {
    console.error('[ERROR] video/route.ts POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
