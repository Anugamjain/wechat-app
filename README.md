# WeChat – Real-Time Public Audio Chat Rooms

WeChat is a real-time web application built with **WebRTC**, **Socket.IO**, and **React**, allowing users to log in, create or join public chat rooms, and engage in live audio conversations.

## 🚀 Features

- 🔐 **Authentication** – Join with a username, no password required.
- 🏠 **Public Chat Rooms** – Create or join existing public rooms.
- 🎙️ **Speakers & Listeners** – Role-based participation:
  - **Speakers** can talk.
  - **Listeners** can hear the conversation but not speak unless promoted.
- 📡 **Real-time Communication** – Audio streams using WebRTC and signaling via Socket.IO.
- 🔇 **Mute/Unmute Support** – Speakers can mute/unmute themselves, controlling their audio stream.
- ⚡ **Minimal Bandwidth** – Tracks are added only when the user unmutes to conserve resources.

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS  
- **Backend:** Node.js, Express, Socket.IO  
- **Real-Time Media:** WebRTC, FreeICE  
- **State Management:** Custom React Hooks  

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Anugamjain/wechat-app.git
   cd wechat-app
