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

    const chatData = await Promise.all(
      chatKeys.map((key) => client.lrange(key, 0, -1))
    );

    // Creating an array of objects with id and title properties
    const response = chatKeys.map((key, index) => {
      // Assuming each chatData item is an array of messages
      const messages = chatData[index];
      // Using the first message as the title
      const content =
        //@ts-ignore
        messages.length > 0 ? messages[0].data.content : 'No title';
      return {
        id: key,
        content: content,
      };
    });

    return new Response(JSON.stringify(response));
  }

  return new Response('error POST', { status: 500 });
}

// Checking the chatHistoryAction for deletion
export async function DELETE(req: Request): Promise<Response> {
  const { id, chatHistoryAction } = await req.json();
  console.log('id', id);

  if (chatHistoryAction === 'delete') {
    // Deleting chat keys based on userId
    const deleteResult = await client.del(`${id}`);
    return new Response(
      JSON.stringify({ success: deleteResult === 1, status: 200 })
    );
  }
  // 9. Returning an error response if chatHistoryAction is not 'retrieve'
  return new Response('error DELETE', { status: 500 });
}
