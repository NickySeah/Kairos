# 🗓️ Kairos - Calendar Application with AI Assistant

Kairos is a modern **calendar application** with an integrated **AI assistant**.  
It combines traditional calendar functionality with natural language processing (NLP) to help users manage their schedule through conversation.

---

## ✨ Features

### 📅 Calendar
- **Monthly Calendar View** – Interactive grid displaying days of the month with event indicators  
- **Day Detail View** – Timeline view showing all events scheduled for a selected day  
- **Event Management (CRUD)** – Create, read, update, and delete calendar events  
- **Multi-day Events** – Support for events spanning multiple days with proper visual indication  

### 🤖 AI Assistant
- **Natural Language Processing** – Interact with your calendar using plain text  
- **Event Scheduling** – AI creates events from text descriptions  
- **Conflict Detection** – Identifies scheduling conflicts and suggests alternatives  
- **Smart Suggestions** – AI recommends available time slots based on your schedule  

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Lynx.js](https://lynxjs.dev/) with React integration  
- **Build Tools**:  
  - RSpeedy – development & build  
  - TypeScript – type safety  
  - ESLint – code quality  
  - Prettier – formatting  
  - Vitest – testing  

### Backend
- **Server**: Node.js with Express  
- **Database**: MySQL (via `mysql2`)  

---

## 🔌 APIs

- **Express REST API**  
  - `/events` → CRUD operations for calendar events  
  - `/prompt` → NLP endpoint for AI assistant  

- **LLama 3.1 API**  
  - Accessed via [Ollama](http://127.0.0.1:11434/api/generate)  
  - Powers natural language understanding  

- **MySQL Database**  
  - Persistent event data storage  

---

## 🎨 Assets & Styling

- **UI Design Assets**:  
  - Custom icons  
  - `lynx-logo.png`, `react-logo.png`, `arrow.png`  
  - `UIMockup.png` for design reference  

- **Styling**:  
  - Custom responsive CSS for all components  

---

## 📚 Libraries

### Frontend
- `@lynx-js/react` – React integration  
- `@lynx-js/web-core` – Core Lynx components  
- `@lynx-js/web-elements` – UI elements  
- `@lynx-js/preact-devtools` – Dev tools  
- `@lynx-js/rspeedy` – Build system  

### Backend
- `express` – Web framework  
- `mysql2` – MySQL client  
- `axios` – HTTP client  
- `body-parser` – Request parsing middleware  
- `cors` – CORS handling  

---

## 📂 Architecture

Kairos features a **clean separation** between the frontend UI and backend API:  

- **Frontend (Lynx.js + React)**  
  Provides a modern, responsive calendar interface with monthly and daily views.  

- **Backend (Node.js + Express)**  
  Handles event management and AI prompt processing.  

- **AI Chatbox Component**  
  Enables natural language interaction, powered by **LLama 3.1** to interpret user input and manage events.  

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/kairos.git
cd kairos

# Install dependencies
npm install

# Start development server
npm run dev
