# 🎯 Daily Practice Tracker

A premium, modern web application designed to help you track daily learning habits, set meaningful goals, and visualize your progress with elegance. Built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**, this tracker combines professional performance with a stunning glassmorphic UI.

![Daily Practice Tracker](https://github.com/iksagor0/Daily-Practice-Tracker/raw/main/public/favicon.svg)

## ✨ Premium Features

- **📋 Smart Task Management** — Effortlessly add, edit, and organize your daily practice routines.
- **⚡ Quick Completion** — Mark tasks done with 0 minutes for rapid tracking of habit-based tasks.
- **📊 Advanced Analytics** — Gain insights with daily averages, weekly totals, and monthly milestone tracking.
- **🔐 Secure Sync** — Full Google Authentication with seamless data persistence via Firebase.
- **🌌 Glassmorphic UI** — Experience a state-of-the-art interface with smooth animations and subtle transparency.
- **🎨 Theme Store** — Choose from 10+ curated, beautiful themes like "Sakura Blossom," "Arctic Aurora," and "Emerald Mint."
- **👤 Guest Mode** — Full functionality available immediately with local storage, syncing perfectly when you log in.
- **🌅 Smart Daily Reset** — Automated routine refresh at **6:00 AM Bangladesh Time** to keep your focus fresh.
- **✨ Aesthetic Placeholders** — Hand-picked motivational GIFs and quotes that make an empty list feel like a clean slate.

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
   Open [http://localhost:2000](http://localhost:2000) (or your configured port) in your browser.

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
│   ├── components/         # Premium UI Components (Theme Store, Task Cards, Modals)
│   ├── context/            # Global State (Auth, App State, Sync Logic)
│   ├── constants/          # App constants & Initial task data
│   ├── shared/             # Atomic & Shared components
│   ├── utils/              # Firebase config, utility functions, & sanitization
│   ├── types/              # TypeScript Interfaces
│   └── models/             # API & Data Models
├── public/                 # Static assets & favicon
└── tailwind.config.js      # Custom theme configuration
```

## 🔧 Firebase Configuration

To use your own instance:

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Google Auth** and **Realtime Database**.
3. Create a `.env.local` file in the root directory (you can use `.env.example` as a template).
4. Fill in your Firebase credentials in `.env.local`:
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
