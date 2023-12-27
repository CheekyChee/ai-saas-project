import { Navbar } from '@/components/navbar/navbar';
import Sidebar from '@/components/sidebar/sidebar';
import { getApiLimitCount } from '@/lib/api-limit';
import { auth } from '@clerk/nextjs';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const apiLimitCount = await getApiLimitCount();
  const { userId } = auth();
  return (
    <div className="relative h-full">
      <div className="hidden h-full md:flex md:w-72 md:flex-col  md:fixed md:inset-y-0  bg-gray-900">
        <Sidebar apiLimitCount={apiLimitCount} userId={userId as string} />
      </div>

      <main className="md:pl-72">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
