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
      'riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05',
      {
        input: {
          alpha: 0.5,
          prompt_a: prompt,

          denoising: 0.75,
          seed_image_id: 'vibes',
          num_inference_steps: 50,
        },
      }
    );
    await increaseApiLimit();
    return NextResponse.json(response);
  } catch (error) {
    console.error('[ERROR] melody/route.ts POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
