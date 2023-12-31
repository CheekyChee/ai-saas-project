'use client';
import { useState, useEffect } from 'react'; // Import useState and useEffect hooks from React
import { useParams } from 'next/navigation'; // Import the useParams hook from Next.js
import { Button } from '@/components/ui/button'; // Import the Button component
import { HistoryNav } from '@/components/ui/sidebar-nav'; // Import the SidebarNav component
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
// Define the shape of each item in the sidebar
interface Item {
  href: string;
  title: string;
  id: string;
  content: string;
}

// Define the props for the Sidebar component
interface HistorySidebarProps {
  userId: string;
}
// reached 22:46
export const HistorySidebar = ({ userId }: HistorySidebarProps) => {
  const params = useParams();
  const [items, setItems] = useState<Item[]>([]);
  const router = useRouter();

  // 2. Function to retrieve sidebar data from an API
  const handleRetrieveSidebar = async () => {
    const response = await fetch('/api/retrieve-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatHistoryAction: 'retrieve', userId }),
    });

    if (response.ok) {
      // 3. Parse and format chat history data
      let chatHistory = await response.json();

      chatHistory = chatHistory.reverse();
      let dbChatHistory = chatHistory.map((item: any) => {
        let parseDate = Number(item.id.replace(`${userId}-`, ''));
        return {
          href: `/master-companion/${item.id}`,
          title: new Date(parseDate).toLocaleString(),
          id: item.id,
          content: item.content,
        };
      });

      // 4. Check if a specific chat ID is provided in the URL params
      if (
        params.id &&
        dbChatHistory.filter(
          (item: { href: string }) =>
            item.href === `/master-companion/${params.id}`
        ).length === 0
      ) {
        const unixTime = params.id.toString().replaceAll(`${userId}-`, '');

        // 5. Add a new chat history item to the beginning of the list
        setItems([
          {
            href: `/master-companion/${userId}-${unixTime}`,
            title: new Date(Number(unixTime)).toLocaleString(),
            id: `${userId}-${unixTime}`,
            content: null,
          },
          ...dbChatHistory,
        ]);
      } else {
        // 6. Set the sidebar items to the retrieved chat history
        setItems(dbChatHistory);
      }
    } else {
      // 7. Handle errors if the API request fails
      console.error('Error retrieving chat history');
      toast.error('Error retrieving chat history');
    }
  };

  const handleDeleteSidebar = async (id: string) => {
    console.log('id', id);

    const response = await axios.delete('/api/retrieve-history', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: { chatHistoryAction: 'delete', id },
    });
    if (response.status === 200) {
      handleRetrieveSidebar();
      toast.success('Chat history deleted');
    } else {
      console.error('Error deleting chat history');
      toast.error('Error deleting chat history');
    }
  };

  // 8. Function to handle creating a new chat and updating the URL
  const handleUpdateSidebar = async () => {
    const chatId = Date.now().toString();
    router.push(`/master-companion/${userId}-${chatId}`);
  };

  // 9. Use useEffect to call handleRetrieveSidebar when the component mounts
  useEffect(() => {
    handleRetrieveSidebar();
  }, []);

  return (
    <div className="w-full p-4">
      <div className="ml-auto w-full">
        {/* 10. Render a button to create a new chat */}
        <Button className="w-full my-2" onClick={handleUpdateSidebar}>
          New Chat
        </Button>
      </div>
      {/* 11. Render the sidebar navigation with the retrieved items */}
      <HistoryNav
        items={items}
        className="flex-col"
        onClickRemove={handleDeleteSidebar}
      />
    </div>
  );
};
