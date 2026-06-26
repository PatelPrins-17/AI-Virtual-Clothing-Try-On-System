# 🚀 How to Run the Project

## ✅ Complete Setup & Run Instructions

### Step 1: Start Backend Server (Port 5002)

Open **Command Prompt** or **PowerShell** and run:

```bash
cd "AI Virtual Clothing Try-On System/backend"
node server.js
```

You should see:
```
🚀 Server running on http://localhost:5002
✅ SQLite database connected
```

**Keep this window open!**

---

### Step 2: Start Frontend Server (Port 5001)

Open **another Command Prompt** or **PowerShell** window and run:

```bash
cd "AI Virtual Clothing Try-On System/frontend"
python -m http.server 5001
```

You should see:
```
Serving HTTP on :: port 5001 (http://[::]:5001/) ...
```

**Keep this window open too!**

---

### Step 3: Open in Browser

Open your browser and go to:
```
http://localhost:5001
```

---

## 🎯 Testing the 3 New Features

### 1. Login First
- Click "Sign In" or "Get Started"
- Create an account or login

### 2. Scroll to "Exclusive Features" Section
You'll see 3 feature cards:

#### 🤖 AI Style Advisor
- Click **"Get Recommendations"** button
- Fill out the questionnaire (body type, skin tone, style, colors, budget)
- Get personalized recommendations

#### 🎨 Virtual Wardrobe Mixer
- Click **"Start Mixing"** button
- Upload your own clothes (tops, bottoms, shoes)
- Mix and match to create outfits
- Save your favorite combinations

#### 👥 Social Sharing & Voting
- Click **"View Community"** button
- See community outfits feed
- Vote on outfits you like
- Share your own try-on results

---

## 🐛 Troubleshooting

### Issue: "Style Advisor not loaded yet" error

**Solution:**
1. Make sure BOTH servers are running (backend + frontend)
2. Hard refresh the page: `Ctrl + Shift + R` or `Ctrl + F5`
3. Clear browser cache
4. Check browser console (F12) for errors

### Issue: 404 File Not Found

**Solution:**
- You must use `http://localhost:3000` (with server running)
- Don't open `index.html` directly from file explorer
- Make sure frontend server is running on port 3000

### Issue: Backend API errors

**Solution:**
- Make sure backend server is running on port 5002
- Check backend console for errors
- Verify `database.sqlite` file exists in backend folder

---

## 📁 Project Structure

```
AI Virtual Clothing Try-On System/
├── backend/
│   ├── server.js              (Backend server - Port 5002)
│   ├── database.sqlite        (SQLite database)
│   └── config/sqlite.js       (Database config)
├── frontend/
│   ├── index.html             (Main page)
│   ├── style-advisor.js       (AI Style Advisor feature)
│   ├── wardrobe-mixer.js      (Wardrobe Mixer feature)
│   ├── social-sharing.js      (Social Sharing feature)
│   ├── features-styles.css    (Feature styles)
│   └── live-chat.js           (Live chat widget)
└── START.bat                  (Auto-start script)
```

---

## 🎉 Quick Start (Easiest Way)

Just double-click **`START.bat`** file in the main folder!

It will:
1. ✅ Start backend server (Port 5002)
2. ✅ Start frontend server (Port 3000)
3. ✅ Open browser automatically

---

## 📝 Notes

- Backend runs on: `http://localhost:5002`
- Frontend runs on: `http://localhost:5001`
- Admin Dashboard: `http://localhost:5002/admin/admin-dashboard.html`
- Database Viewer: `http://localhost:5002/database-viewer.html`

---

## ✨ Features Summary

### Core Features:
- ✅ User Registration & Login
- ✅ Virtual Try-On (upload photo + select clothes)
- ✅ Clothing Gallery
- ✅ Live Chat Support

### New Exclusive Features:
- ✅ 🤖 AI Style Advisor (Personalized recommendations)
- ✅ 🎨 Virtual Wardrobe Mixer (Mix & match your clothes)
- ✅ 👥 Social Sharing & Voting (Community feed)

---

**Need Help?** Check browser console (F12) for detailed error messages!
