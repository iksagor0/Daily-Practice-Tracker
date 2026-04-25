# 🎯 Kaizen: Knowledge Management System

A premium, modern web application designed for continuous, small improvements every day. **Kaizen** helps you track daily learning habits, document reflections, and manage a curated vault of resources with elegance. Built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**, it combines professional performance with a stunning glassmorphic UI.

## ✨ Core Features

- **📋 Daily Task Tracker** — Effortlessly add, edit, and organize your daily practice routines with smart daily resets.
- **📝 Integrated Notebook** — A powerful, markdown-supported notebook feature to document your learning journey alongside your tasks.
- **📚 Resource Vault** — A central hub to store and categorize study materials, video links, and articles for quick access.
- **💾 Markdown Portability** — Export your notes as standard `.md` files, or import existing `.md` and `.txt` files directly into your notebook.
- **🔐 Secure Sync** — Full Google Authentication with seamless data persistence via Firebase Realtime Database.
- **📊 Progress Analytics** — Gain insights with daily averages, weekly totals, and achievement milestones.
- **👤 Identity Intelligence** — Start instantly as a Guest; your data will seamlessly sync to your Google account when you sign in.
- **👤 Guest Mode** — Full functionality available immediately with local storage, syncing perfectly when you log in.
- **📊 Advanced Analytics** — Gain insights with daily averages, weekly totals, and monthly milestone tracking.
- **🌅 Smart Daily Reset** — Automated routine refresh at **6:00 AM Bangladesh Time** to keep your focus fresh.
- **✨ Aesthetic Placeholders** — Hand-picked motivational GIFs and quotes that make an empty list feel like a clean slate.
- **🎨 Elite Theme Engine** — Choose from curated, beautiful themes like "Sakura Blossom," "Midnight Horizon," and "Nordic Dark" with instant, flicker-free loading.

## 🏆 Achievement System

The app tracks your consistency and growth across multiple tiers:

- **Daily Goals**: "Deep Work," "Morning Routine," and custom time targets.
- **Weekly Milestones**: Cumulative time tracking from 300 to 1000+ minutes.
- **Monthly Achievements**: Long-term consistency rewards (1K to 5K+ minutes).

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/iksagor0/Daily-Practice-Tracker.git
   cd Daily-Practice-Tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:2000](http://localhost:2000) in your browser.

## 🛠️ Tech Stack

| Technology          | Purpose                                    |
| :------------------ | :----------------------------------------- |
| **Next.js 16**      | Full-stack framework & App Router          |
| **React 19**        | Component-based UI library                 |
| **Tailwind CSS v4** | Next-generation styling with CSS variables |
| **Firebase**        | Authentication & Realtime Database         |
| **TypeScript**      | Type-safe development                      |
| **Lucide React**    | Modern, consistent icon system             |
| **Canvas Confetti** | Celebration effects for milestones         |
| **date-fns**        | Precise date & time manipulation           |

## 📁 Project Structure

```text
Daily-Practice-Tracker/
├── src/
│   ├── app/                # Next.js App Router (Layouts & Pages)
│   ├── components/         # Feature-wise UI Components (notebook/, task/, resource-vault/, layout/)
│   ├── context/            # Global State (Auth, App State, Sync Logic)
│   ├── constants/          # App constants & feature-wise data
│   ├── utils/              # Firebase config, utility functions, & sanitization
│   ├── types/              # Type-safe Interfaces & UI/Utils types
│   └── models/             # API & Data Models
├── public/                 # Static assets & favicon
└── globals.css             # Tailwind v4 CSS-first configuration
```

## 🔧 Firebase Configuration

To use your own instance:

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Google Auth** and **Realtime Database**.
3. Create a `.env.local` file in the root directory.
4. Fill in your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
5. Set Database rules:
   ```json
   {
     "rules": {
       "users": {
         "$uid": {
           ".read": "$uid === auth.uid",
           ".write": "$uid === auth.uid"
         }
       }
     }
   }
   ```

## 👤 Developer

**Mohammad Ibrahim Khalil**
Software Engineer | Cumilla, Bangladesh

🔗 **LinkedIn**: [ibrahim-khalil-js](https://www.linkedin.com/in/ibrahim-khalil-js/)
💻 **GitHub**: [iksagor0](https://github.com/iksagor0)

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
