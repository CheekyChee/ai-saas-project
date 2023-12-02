import Image from 'next/image';
import { FC, Fragment } from 'react';

export interface EmptyProps {
  label: string;
}

export const Empty: FC<EmptyProps> = ({ label }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-20">
      <div className="relative h-72 w-72">
        <Image alt="empty" fill src={'/empty.png'} />
      </div>
      <p className="text-sm text-center text-muted-foreground">{label}</p>
    </div>
  );
};
