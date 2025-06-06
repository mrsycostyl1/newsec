import { useState, ChangeEvent } from 'react';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { playClickSound } from '@/lib/utils';
import { useRouter } from 'next/router';

const UserSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    const q = query(collection(db, 'users'), where('username', '==', searchTerm));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setResults(users);
  };

  const startChat = async (userId: string) => {
    if (!auth.currentUser) return;
    const chatId = [auth.currentUser.uid, userId].sort().join('_');
    await setDoc(doc(db, 'chats', chatId), {
      users: [auth.currentUser.uid, userId],
      lastMessage: '',
    });
    playClickSound();
    router.push(`/chat/${chatId}`);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search by username"
        value={searchTerm}
        onChange={handleChange}
        className="p-2 rounded bg-gray-800 text-white focus:outline-none"
      />
      <button onClick={handleSearch} className="ml-2 p-2 bg-blue-600 rounded">Search</button>
      <div className="mt-4">
        {results.map((user) => (
          <div key={user.id} className="flex items-center space-x-3 bg-gray-800 p-3 rounded mb-2">
            <img src={user.photoURL} className="w-10 h-10 rounded-full border-2 neon-glow" />
            <p className="text-white">{user.username}</p>
            <button onClick={() => startChat(user.id)} className="ml-auto p-2 bg-green-600 rounded">Chat</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;
