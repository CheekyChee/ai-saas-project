import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatPromptTemplate } from 'langchain/prompts';
import { RunnableSequence } from 'langchain/schema/runnable';
import { StringOutputParser } from 'langchain/schema/output_parser';
import type { Document } from 'langchain/document';
import type { VectorStoreRetriever } from 'langchain/vectorstores/base';

export const CONDENSE_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;

export const QA_TEMPLATE = `You are an expert feng shui master. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context or chat history, politely respond that you are tuned to only answer questions that are related to the context.

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

Sustainability and Feng Shui: Discuss the growing relevance of sustainability in Feng Shui practices, emphasizing eco-friendly materials and design choices that align with the principles of harmony and balance.


<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
Helpful answer in markdown:`;

const combineDocumentsFn = (docs: Document[], separator = '\n\n') => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join(separator);
};

export const makeChain = (retriever: VectorStoreRetriever) => {
  const condenseQuestionPrompt =
    ChatPromptTemplate.fromTemplate(CONDENSE_TEMPLATE);
  const answerPrompt = ChatPromptTemplate.fromTemplate(QA_TEMPLATE);

  const model = new ChatOpenAI({
    temperature: 0, // increase temperature to get more creative answers
    modelName: 'gpt-4',
    streaming: true, //change this to gpt-4 if you have access
  });

  // Rephrase the initial question into a dereferenced standalone question based on
  // the chat history to allow effective vectorstore querying.
  const standaloneQuestionChain = RunnableSequence.from([
    condenseQuestionPrompt,
    model,
    new StringOutputParser(),
  ]);

  // Retrieve documents based on a query, then format them.
  const retrievalChain = retriever.pipe(combineDocumentsFn);

  // Generate an answer to the standalone question based on the chat history
  // and retrieved documents. Additionally, we return the source documents directly.
  const answerChain = RunnableSequence.from([
    {
      context: RunnableSequence.from([
        (input) => input.question,
        retrievalChain,
      ]),
      chat_history: (input) => input.chat_history,
      question: (input) => input.question,
    },
    answerPrompt,
    model,
    new StringOutputParser(),
  ]);

  // First generate a standalone question, then answer it based on
  // chat history and retrieved context documents.
  const conversationalRetrievalQAChain = RunnableSequence.from([
    {
      question: standaloneQuestionChain,
      chat_history: (input) => input.chat_history,
    },
    answerChain,
  ]);

  return conversationalRetrievalQAChain;
};
