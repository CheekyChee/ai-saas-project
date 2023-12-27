import { Redis } from '@upstash/redis';

const client = Redis.fromEnv();
export const runtime = 'edge';

interface RequestJson {
  timestamp: number;
  userId: string;
  chatHistoryAction: string;
}

export async function POST(req: Request): Promise<Response> {
  const { userId, chatHistoryAction } = (await req.json()) as RequestJson;

  // 7. Checking the chatHistoryAction for retrieval
  if (chatHistoryAction === 'retrieve') {
    // 8. Retrieving chat keys based on userId
    const chatKeys = await client.keys(`${userId}-*`);
    return new Response(JSON.stringify(chatKeys));
  }

  // 9. Returning an error response if chatHistoryAction is not 'retrieve'
  return new Response('error');
}
