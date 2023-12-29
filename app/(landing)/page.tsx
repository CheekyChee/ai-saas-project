import { LandingContent } from '@/components/landing-content/landing-content';
import { LandingHero } from '@/components/landing-hero/landing-hero';
import { LandingNavbar } from '@/components/landing-navbar/landing-navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Fragment } from 'react';

const LandingPage = () => {
  return (
    <div className="h-full">
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
    </div>
  );
};

export default LandingPage;
