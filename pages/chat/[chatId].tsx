import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/lib/firebase';
import ChatBox from '@/components/ChatBox';

const ChatPage: React.FC = () => {
  const router = useRouter();
  const { chatId } = router.query;

  useEffect(() => {
    if (!auth.currentUser) {
      router.push('/');
    }
  }, []);

  return (
    <div className="h-screen bg-gray-900">
      <ChatBox />
    </div>
  );
};

export default ChatPage;
