import { useEffect, useRef, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '@/lib/firebase';
import { collection, doc, onSnapshot, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { playClickSound } from '@/lib/utils';

interface MessageData {
  id: string;
  text: string;
  uid: string;
  photoURL: string;
  createdAt: any;
}

const ChatBox: React.FC = () => {
  const router = useRouter();
  const { chatId } = router.query as { chatId: string };
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chatId) return;
    const msgsRef = collection(db, 'chats', chatId, 'messages');
    const unsubscribe = onSnapshot(msgsRef, (snapshot) => {
      const msgs: MessageData[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MessageData));
      setMessages(msgs.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds));
      scrollToBottom();
    });
    return () => unsubscribe();
  }, [chatId]);

  const scrollToBottom = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !auth.currentUser) return;
    const msgsRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(msgsRef, {
      text: input,
      uid: auth.currentUser.uid,
      photoURL: auth.currentUser.photoURL,
      createdAt: serverTimestamp(),
    });
    playClickSound();
    setInput('');
  };

  const handleDelete = async (msgId: string) => {
    const msgDoc = doc(db, 'chats', chatId, 'messages', msgId);
    await deleteDoc(msgDoc);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end ${msg.uid === auth.currentUser?.uid ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-xs break-words bg-blue-600 text-white p-2 rounded relative">
              <p>{msg.text}</p>
              {msg.uid === auth.currentUser?.uid && (
                <button onClick={() => handleDelete(msg.id)} className="absolute top-0 right-0 text-red-400 text-xs">✕</button>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex p-4 bg-gray-800">
        <input
          type="text"
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded bg-gray-700 text-white focus:outline-none"
        />
        <button type="submit" className="ml-2 p-2 bg-green-600 rounded">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
