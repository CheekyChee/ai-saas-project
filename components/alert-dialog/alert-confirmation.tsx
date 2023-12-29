import { FC, Fragment } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

export interface AlertConfirmationProps {
  onClickRemove: (id: string) => void;
  id: string;
  children: React.ReactNode;
}

export const AlertConfirmation: FC<AlertConfirmationProps> = (props) => {
  return (
    <AlertDialog>
      {props.children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              props.onClickRemove(props.id);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
