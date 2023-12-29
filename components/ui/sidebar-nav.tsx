'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from './button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    content: string;
    id: string;
  }[];
  onClickRemove: (id: string) => void;
}

export function HistoryNav({
  className,
  items,
  onClickRemove,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader>
            <CardTitle>
              {' '}
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  pathname === item.href
                    ? 'bg-muted hover:bg-muted'
                    : 'hover:bg-transparent hover:underline',
                  'justify-start'
                )}
              >
                {item.title}
              </Link>
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <p className="truncate">{item.content}</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={() => onClickRemove(item.id)}
              variant={'destructive'}
              size={'sm'}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
