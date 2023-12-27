import { auth } from '@clerk/nextjs';
import prismadb from './prismadb';
import { MAX_FREE_COUNTS } from '@/constants';

const RATE_LIMIT_DURATION = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 100; // Maximum number of requests allowed per hour

const rateLimitMap = new Map<
  string,
  { count: number; lastRequestTime: number }
>();

export const increaseApiLimit = async () => {
  const { userId } = auth();

  if (!userId) return;

  const rateLimitKey = `increaseApiLimit:${userId}`;
  let rateLimit = rateLimitMap.get(rateLimitKey);

  if (!rateLimit) {
    rateLimit = { count: 0, lastRequestTime: Date.now() };
    rateLimitMap.set(rateLimitKey, rateLimit);
  }

  if (rateLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    throw new Error('Rate limit exceeded');
  }

  const currentTime = Date.now();
  if (currentTime - rateLimit.lastRequestTime > RATE_LIMIT_DURATION) {
    rateLimit.count = 0;
    rateLimit.lastRequestTime = currentTime;
  }

  rateLimit.count++;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: {
        userId: userId,
      },
      data: {
        count: userApiLimit.count + 1,
      },
    });
  } else {
    await prismadb.userApiLimit.create({
      data: {
        userId,
        count: 1,
      },
    });
  }
};

export const checkApiLimit = async () => {
  const { userId } = auth();

  if (!userId) return;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) return true;
  else {
    return false;
  }
};

export const getApiLimitCount = async () => {
  const { userId } = auth();

  if (!userId) return 0;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userApiLimit) return 0;

  return userApiLimit.count;
};
