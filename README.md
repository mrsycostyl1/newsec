# Modern Chat App

This is a Next.js + Firebase real-time chat application with a cyberpunk theme. Features include:

- Login / Signup with username and profile picture (displayed in a circular neon frame).
- Real-time chat with message delete functionality.
- Recent chats list with online/offline indicators and user avatars.
- User search (by username) to initiate new chats.
- Button click sound (replace `public/click.mp3` with your own sound).
- Neon animations, modern styled buttons and message boxes.
- Deployed on Vercel.

## Setup

1. **Clone Repository**
   ```bash
   git clone <repo_url>
   cd chat-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - In `lib/firebase.ts`, replace the placeholder values with your Firebase project configuration.

4. **Provide Click Sound**
   - Replace `public/click.mp3` with a valid click sound file.

5. **Run Locally**
   ```bash
   npm run dev
   ```
   - Open [http://localhost:3000](http://localhost:3000) to view.

6. **Deploy to Vercel**
   - Push to GitHub.
   - Connect your GitHub repo in Vercel.
   - Set environment variables for Firebase config in Vercel dashboard.

## File Structure

```
/chat-app
├── components/
│   ├── AuthForm.tsx
│   ├── ChatBox.tsx
│   ├── RecentChats.tsx
│   └── UserSearch.tsx
├── lib/
│   ├── firebase.ts
│   └── utils.ts
├── pages/
│   ├── _app.tsx
│   ├── index.tsx
│   ├── recent.tsx
│   └── chat/[chatId].tsx
├── public/
│   └── click.mp3
├── styles/
│   └── globals.css
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```
