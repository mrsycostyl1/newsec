import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/lib/firebase';
import RecentChats from '@/components/RecentChats';
import UserSearch from '@/components/UserSearch';

const RecentPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      router.push('/');
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="w-1/4 border-r border-gray-700">
        <RecentChats />
      </div>
      <div className="flex-1 relative">
        <div className="absolute bottom-4 left-4">
          <UserSearch />
        </div>
      </div>
    </div>
  );
};

export default RecentPage;
