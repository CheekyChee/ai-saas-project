import { HistorySidebar } from '@/components/sidebar/history-sidebar';
import Sidebar from '@/components/sidebar/sidebar';
import { auth } from '@clerk/nextjs';
import { Fragment } from 'react';

const HistoryPage = () => {
  const { userId } = auth();

  return (
    <Fragment>
      <HistorySidebar userId={userId as string} />
    </Fragment>
  );
};

export default HistoryPage;
