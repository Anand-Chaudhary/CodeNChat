# CodeNChat - Real-time Collaborative Code Editor

CodeNChat is a powerful web-based collaborative code editor that allows multiple users to work together in real-time. It features a built-in chat system, file management, and live code execution environment.

## 🌟 Features

- **Real-time Collaboration**
  - Multiple users can edit code simultaneously
  - Live chat functionality for team communication
  - User presence indicators

- **Code Editor**
  - Syntax highlighting
  - File tree navigation
  - Multiple file support
  - Real-time code updates

- **Live Code Execution**
  - Built-in WebContainer for running code
  - Support for Node.js projects
  - Live preview of running applications
  - Automatic dependency installation

- **Project Management**
  - Create and manage multiple projects
  - Add/remove team members
  - File system management
  - Project settings

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser with WebContainer support

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Anand-Chaudhary/CodeNChat.git
   cd codenchat
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm start
   ```

## 💻 Usage

1. **Creating a Project**
   - Click "New Project" button
   - Enter project name and description
   - Select initial files to include

2. **Adding Team Members**
   - Open project settings
   - Click "Add Collaborators"
   - Search and select team members
   - Set permission levels

3. **Collaborative Coding**
   - Open files from the file tree
   - Edit code in real-time
   - Use the chat panel for communication
   - Run code using the "Run" button

4. **Running Code**
   - Ensure your project has a valid `package.json`
   - Click the "Run" button
   - View output in the preview panel
   - Debug using the console output

## 🔧 Technical Stack

- **Frontend**
  - React.js
  - Socket.IO Client
  - WebContainer API
  - Tailwind CSS
  - Highlight.js

- **Backend**
  - Node.js
  - Express.js
  - Socket.IO
  - MongoDB
  - JWT Authentication

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [WebContainer API](https://webcontainers.io/) for the in-browser code execution
- [Socket.IO](https://socket.io/) for real-time communication
- [Highlight.js](https://highlightjs.org/) for code syntax highlighting
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📧 Contact

Anand Chaudhary - [Linkedin](https://www.linkedin.com/in/anand-chaudhary-b3a92b287/)
Email - chaudharyaakash234@gmail.co
[Instagram](https://www.instagram.com/aakash.cpp/)