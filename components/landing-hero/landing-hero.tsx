'use client';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { FC, Fragment } from 'react';
import TypewriterComponent from 'typewriter-effect';
import { Button } from '../ui/button';

export interface LandingHeroProps {}

export const LandingHero: FC<LandingHeroProps> = (props) => {
  const { isSignedIn } = useAuth();

  return (
    <div className="text-white font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>
          {' '}
          FengShui AI: AI-driven, personalized Feng Shui solutions for optimal
          space harmony with
        </h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600 ">
          <TypewriterComponent
            options={{
              strings: [
                'Chatbot.',
                'Photo Generation.',
                'Melody Generation.',
                'Video Generation.',
                'Master Companion.',
              ],
              autoStart: true,
              loop: true,
              delay: 50,
              deleteSpeed: 100,
            }}
          />
        </div>
      </div>
      <div className="text-sm md:text-xl font-light text-zinc-400">
        Blending ancient wisdom with AI for personalized, space-enhancing
        solutions in homes and offices, directly from your device.
      </div>
      <div>
        <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
          <Button
            variant={'premium'}
            className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
          >
            Elevate Your Space Now
          </Button>
        </Link>
      </div>
      <div className="text-zinc-400 text-xs md:text-sm font-normal">
        No credit card required.
      </div>
    </div>
  );
};
