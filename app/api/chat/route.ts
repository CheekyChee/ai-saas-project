import type { NextApiRequest, NextApiResponse } from 'next';
import type { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

import { pinecone } from '@/lib/pinecone-client';
import { makeChain } from '@/lib/makechain';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { question, history } = await req.json();

  console.log('question', question);
  console.log('history', history);

  const historyArray = Array.isArray(history) ? history : [];

  //only accept post requests
  if (req.method !== 'POST') {
    return new NextResponse('Method not allowed', { status: 500 });
  }

  if (!question) {
    return new NextResponse('Error: Message not provided', { status: 400 });
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
      }
    );
    console.log('vectorStore', vectorStore);
    // Use a callback to get intermediate sources from the middle of the chain
    let resolveWithDocuments: (value: Document[]) => void;
    const documentPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve;
    });

    console.log('documentPromise', documentPromise);
    const retriever = vectorStore.asRetriever({
      callbacks: [
        {
          handleRetrieverEnd(documents) {
            resolveWithDocuments(documents);
          },
        },
      ],
    });
    console.log('retriever', retriever);
    //create chain
    const chain = makeChain(retriever);

    console.log('history', history);

    const pastMessages = historyArray
      .map((message: [string, string]) => {
        return [`Human: ${message[0]}`, `Assistant: ${message[1]}`].join('\n');
      })
      .join('\n');
    console.log(pastMessages);

    //Ask a question using chat history
    const response = await chain.invoke({
      question: sanitizedQuestion,
      chat_history: pastMessages,
    });

    const sourceDocuments = await documentPromise;

    console.log('response', response);
    // res.status(200).json({ text: response, sourceDocuments });
    return NextResponse.json({ text: response, sourceDocuments });
  } catch (error: any) {
    console.log('error', error);
    // res.status(500).json({ error: error.message || 'Something went wrong' });
    return new NextResponse(error.message || 'Something went wrong', {
      status: 500,
    });
  }
}
