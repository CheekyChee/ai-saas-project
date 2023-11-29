import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { FC, Fragment } from 'react';

export interface HeadingProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
}

export const Heading: FC<HeadingProps> = ({
  description,
  icon: Icon,
  iconColor,
  title,
  bgColor,
}) => {
  return (
    <>
      <div className="px-4 lg:px-8 flex items-center gap-x-3 mb-8 ">
        <div className={cn('p-2 w-fit rounded-md', bgColor)}>
          <Icon className={cn('h-8 w-8', iconColor)} />
        </div>
        <div>
          <h2 className="text-3xl font-bold">
            <span className={cn('bg-clip-text text-black')}>{title}</span>
          </h2>
          <p>
            <span className="text-muted-foreground text-sm">{description}</span>
          </p>
        </div>
      </div>
    </>
  );
};
