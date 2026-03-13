# 🎯 Daily Practice Tracker

A beautiful, modern web app to track your daily learning habits, set goals, and celebrate achievements. Built with vanilla HTML, JavaScript, and Tailwind CSS.

![Daily Practice Tracker](public/favicon.svg)

## ✨ Features

- **📋 Task Management** — Add, edit, delete, and complete daily practice tasks
- **⏱️ Time Tracking** — Set target times and log actual practice minutes
- **📊 Analytics Dashboard** — View daily averages, weekly totals, and monthly progress
- **🎆 Achievement System** — Unlock milestones with confetti celebrations
- **🔐 Google Authentication** — Sign in with Google to sync data across devices
- **👤 Guest Mode** — Use the app without signing in (data stored locally)
- **☁️ Cloud Sync** — Guest data automatically syncs to the cloud when you sign in
- **📱 Responsive Design** — Works beautifully on desktop, tablet, and mobile
- **🌅 Smart Daily Reset** — Tasks reset at 6:00 AM Bangladesh Time automatically

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/daily-practice-tracker.git
   cd daily-practice-tracker
   ```

2. **Open in browser**
   Simply open `index.html` in your browser, or serve it locally:
   ```bash
   npx serve .
   ```

3. **Start tracking!**
   - Sign in with Google or continue as a guest
   - Complete tasks and watch your progress grow

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure & semantics |
| JavaScript (ES6+) | Application logic |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Firebase](https://firebase.google.com/) | Authentication & Realtime Database |
| [Lucide Icons](https://lucide.dev/) | Beautiful icon set |
| [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) | Achievement celebrations |
| [date-fns](https://date-fns.org/) | Date utilities |

## 📁 Project Structure

```
daily-practice-tracker/
├── index.html              # Main HTML entry point
├── public/
│   └── favicon.svg         # App icon / favicon
├── css/
│   └── styles.css          # Custom styles & animations
├── js/
│   ├── app.js              # Core application logic
│   ├── data.js             # Static data (tasks, icons, achievements)
│   └── tailwind.config.js  # Tailwind theme configuration
├── README.md
└── LICENSE
```

## 🏆 Achievements

Unlock milestones as you build your practice habits:

| Category | Milestones |
|----------|------------|
| **Daily** | All tasks done, 100 / 200 / 300 min |
| **Weekly** | 300 / 500 / 700 / 1000 min |
| **Monthly** | 1K / 2K / 3K / 5K min |

## 🔧 Firebase Setup (For Your Own Instance)

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Google Authentication** in Authentication → Sign-in method
3. Create a **Realtime Database**
4. Set security rules:
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
5. Replace the `firebaseConfig` in `js/app.js` with your own credentials

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icon set
- [Firebase](https://firebase.google.com/) for authentication and database
- [Canvas Confetti](https://github.com/catdad/canvas-confetti) for celebration effects
