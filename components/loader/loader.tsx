import Image from 'next/image';
import { FC, Fragment } from 'react';

export interface LoaderProps {}

export const Loader: FC<LoaderProps> = (props) => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-y-4">
      <div className="relative w-10 h-10 animate-spin">
        <Image alt="logo" src={'/Feng_shui_logo.png'} fill />
      </div>
      <p className="text-sm text-muted-foreground">Feng Shui is thinking ...</p>
    </div>
  );
};
