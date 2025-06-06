import { useState, ChangeEvent, FormEvent } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        let photoURL = '';
        if (profileFile) {
          const storageRef = ref(storage, `profiles/${user.uid}`);
          await uploadBytes(storageRef, profileFile);
          photoURL = await getDownloadURL(storageRef);
        }
        await updateProfile(user, { displayName: username, photoURL });
        // Save extra user info in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          username,
          photoURL,
          online: true,
        });
        router.push('/recent');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/recent');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl mb-6">{isSignUp ? 'Sign Up' : 'Login'}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-80">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded bg-gray-800 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded bg-gray-800 focus:outline-none"
          required
        />
        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 rounded bg-gray-800 focus:outline-none"
              required
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div className="w-32 h-32 rounded-full neon-glow overflow-hidden relative mx-auto">
              {profileFile && (
                <motion.img
                  src={URL.createObjectURL(profileFile)}
                  className="object-cover w-full h-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
                />
              )}
              {!profileFile && (
                <div className="flex items-center justify-center w-full h-full bg-gray-800">
                  <p>Select Image</p>
                </div>
              )}
            </div>
          </>
        )}
        <button
          type="submit"
          className="p-2 bg-blue-600 rounded hover:bg-blue-500 transition"
        >
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <p className="mt-4">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="underline text-cyan-400"
        >
          {isSignUp ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
