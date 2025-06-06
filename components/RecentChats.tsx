import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { db } from '@/lib/firebase';

interface User {
  id: string;
  username: string;
  photoURL: string;
  online: boolean;
}

interface ChatPreview {
  id: string;
  user: User;
  lastMessage: string;
}

const RecentChats: React.FC = () => {
  const [recent, setRecent] = useState<ChatPreview[]>([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'chats'), where('users', 'array-contains', currentUser.uid));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chats: ChatPreview[] = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const otherUserId = data.users.find((uid: string) => uid !== currentUser.uid);
        const userDoc = await getDoc(doc(db, 'users', otherUserId));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          chats.push({
            id: docSnap.id,
            user: {
              id: otherUserId,
              username: userData.username,
              photoURL: userData.photoURL,
              online: userData.online,
            },
            lastMessage: data.lastMessage || '',
          });
        }
      }
      setRecent(chats);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4 text-white">Recent Chats</h2>
      {recent.map((chat) => (
        <Link key={chat.id} href={`/chat/${chat.id}`}>
          <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded mb-2 cursor-pointer hover:bg-gray-700">
            <div className="relative">
              <img
                src={chat.user.photoURL}
                className="w-12 h-12 rounded-full border-2"
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                  chat.user.online ? 'bg-green-400' : 'bg-gray-500'
                }`}
              />
            </div>
            <div>
              <p className="font-bold text-white">{chat.user.username}</p>
              <p className="text-sm text-gray-400">{chat.lastMessage}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecentChats;
