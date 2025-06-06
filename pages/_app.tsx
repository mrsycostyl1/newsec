import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        await updateDoc(userDoc, { online: true });
      } else {
        // handle sign out if needed
      }
    });
    return () => unsubscribe();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
