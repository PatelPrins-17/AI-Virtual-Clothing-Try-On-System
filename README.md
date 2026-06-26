# AI Virtual Clothing Try-On System 🎨👗

AI-powered virtual clothing try-on application with live chat support.

## 🚀 Features

### Core Features
- **Virtual Try-On**: AI-powered clothing visualization on user photos
- **Clothing Gallery**: Browse and search through various clothing items
- **User Authentication**: Secure signup/login system with SQLite database
- **Admin Dashboard**: Manage users and view analytics
- **Database Viewer**: View and manage database records

### 🤖 AI-Powered Features
- **AI Style Advisor**: Get personalized clothing recommendations based on body type, skin tone, and style preferences
- **Virtual Wardrobe Mixer**: Mix and match your own clothes to create unique outfits
- **Social Sharing & Voting**: Share your try-on results with the community and vote on others' outfits

### 💬 Live Chat Support
- **Real-time Chat**: Get instant support from our AI assistant
- **User Community**: Chat with other fashion enthusiasts
- **Auto-polling**: Messages update automatically every 3 seconds
- **Message History**: View recent conversation history
- **Floating Widget**: Easy access from bottom-right corner

## 🛠️ Technology Stack

**Backend:**
- Node.js + Express.js
- SQLite database with better-sqlite3
- JWT authentication
- bcrypt password hashing
- CORS enabled

**Frontend:**
- Vanilla JavaScript (ES6+)
- HTML5 & CSS3
- Font Awesome icons
- Responsive design (Mobile-first)

## 📦 Quick Start

### 1. Install Dependencies
```bash
cd "AI Virtual Clothing Try-On System/backend"
npm install
```

### 2. Start Backend Server
```bash
node server.js
```
Backend runs on: **http://localhost:5002**

### 3. Start Frontend
- Open `frontend/index.html` in your browser
- Or use a local server:
```bash
cd frontend
python -m http.server 5001
```
Frontend runs on: **http://localhost:5001**

### 4. Or Use START.bat (Windows)
Double-click `START.bat` to start both backend and frontend automatically.

## 🎯 How to Use

1. **Sign up** for a new account
2. **Upload your photo** for virtual try-on
3. **Browse clothing** in the gallery
4. **Use live chat** widget (bottom-right corner) for support
5. **Send messages** and get real-time responses

## 💬 Live Chat Features

### How to Access
- Look for the chat widget in the bottom-right corner
- Click the header to expand/collapse
- Widget is always accessible on all pages

### How to Use
1. Click on the chat widget to open
2. Type your message in the input box
3. Press Enter or click the send button
4. Messages appear instantly
5. Chat auto-updates every 3 seconds

### Features
- Real-time messaging
- User name display
- Timestamp for each message
- Auto-scroll to latest message
- Persistent chat history
- Support and user message types

## 📊 Database Tables

- **users** - User accounts and authentication
- **live_chat** - Chat messages and history
- **wishlist** - User's favorite items
- **cart** - Shopping cart items
- **reviews** - Product reviews and ratings
- **recently_viewed** - Browsing history

## 🔌 Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Live Chat
- `GET /api/chat/messages` - Get recent messages (last 50)
- `GET /api/chat/messages/after/:timestamp` - Get messages after timestamp
- `POST /api/chat/send` - Send a message
- `DELETE /api/chat/cleanup` - Cleanup old messages (keeps last 1000)

### Clothing
- `GET /api/clothing` - Get all clothing items

### Virtual Try-On
- `POST /api/upload` - Upload user photo
- `POST /api/tryon` - Process virtual try-on

## 🎨 Customization

### Change Theme Colors
Edit CSS variables in `frontend/index.html`:
```css
:root {
    --primary: #06b6d4;    /* Cyan/Teal */
    --secondary: #0891b2;  /* Darker Teal */
    --accent: #f43f5e;     /* Rose/Pink */
}
```

### Customize Chat Widget
Edit styles in `frontend/index.html` under `.chat-widget` class.

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication (7-day expiry)
- SQL injection prevention with prepared statements
- Input validation and sanitization
- CORS configuration
- Secure session management

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 576px, 768px, 992px, 1200px
- Touch-friendly interface
- Chat widget adapts to screen size
- Optimized for all devices

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5002 is available
- Verify Node.js is installed: `node --version`
- Reinstall dependencies: `npm install`

### Database errors
- Delete `database.sqlite` file
- Restart server (auto-creates tables)

### Chat not working
- Verify backend is running on port 5002
- Check browser console for errors
- Clear browser cache and reload
- Make sure you're logged in

### Frontend not loading
- Check browser console for errors
- Verify backend is running
- Try different browser
- Clear cache and cookies

## 📝 Project Structure

```
AI Virtual Clothing Try-On System/
├── backend/
│   ├── config/
│   │   └── sqlite.js          # Database configuration
│   ├── uploads/                # User uploaded photos
│   ├── results/                # Try-on results
│   ├── server.js               # Main server file
│   ├── database.sqlite         # SQLite database
│   ├── admin-dashboard.html    # Admin panel
│   └── database-viewer.html    # Database viewer
├── frontend/
│   ├── index.html              # Main page
│   ├── signup.html             # Signup/Login page
│   ├── profile.html            # User profile
│   ├── live-chat.js            # Live chat functionality
│   └── config.js               # Frontend config
├── START.bat                   # Windows startup script
└── README.md                   # This file
```

## 🚀 Future Enhancements

- [ ] Real AI model for actual try-on
- [ ] Payment gateway integration
- [ ] Social media sharing
- [ ] AR camera try-on
- [ ] Mobile app (React Native)
- [ ] Video chat support
- [ ] File sharing in chat
- [ ] Chat notifications
- [ ] Multi-language support
- [ ] Voice messages

## 📞 Support

Use the live chat widget in the application for instant support!

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ for the future of fashion!
