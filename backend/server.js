const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Load environment variables

// Set API keys if not loaded from .env
if (!process.env.LIGHTX_API_KEY) {
  process.env.LIGHTX_API_KEY = '*********************';
}
if (!process.env.GEMINI_API_KEY) {
  process.env.GEMINI_API_KEY = '********************';
}

// Log environment variables for debugging
console.log('🔍 Environment Variables Check:');
console.log('LIGHTX_API_KEY:', process.env.LIGHTX_API_KEY ? '✅ Loaded' : '❌ Not found');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Loaded' : '❌ Not found');
console.log('PORT:', process.env.PORT || '5002');

const { initDatabase, userOperations, wishlistOperations, cartOperations, reviewsOperations, recentlyViewedOperations, gamificationOperations, fashionChallengesOperations, virtualFashionShowsOperations, liveChatOperations, addressesOperations, socialOutfitsOperations } = require("./config/sqlite");

const app = express();
const PORT = 5002;
const JWT_SECRET = "stylefusion_demo_secret_2026";

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize SQLite database
initDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/results", express.static(path.join(__dirname, "results")));
app.use("/admin", express.static(path.join(__dirname, ".")));
// Serve HTML files from backend root
app.use(express.static(path.join(__dirname, ".")));

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "StyleFusion AI Backend Running 🚀 (SQLite Mode)",
    version: "1.0.0",
    mode: "SQLite Database",
    endpoints: {
      auth: "/api/auth",
      clothing: "/api/clothing",
      upload: "/api/upload",
      tryon: "/api/tryon"
    }
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    users: userOperations.count(),
    database: "SQLite"
  });
});

// Admin endpoint to view all users
app.get("/api/admin/users", (req, res) => {
  try {
    const users = userOperations.getAll();
    const userList = users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isActive: user.isActive === 1
    }));
    
    res.json({
      success: true,
      count: userList.length,
      users: userList
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobile } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // First name validation - only alphabets
    if (!/^[a-zA-Z]+$/.test(firstName)) {
      return res.status(400).json({
        success: false,
        message: 'First name can only contain alphabetic characters'
      });
    }

    // Last name validation - only alphabets
    if (!/^[a-zA-Z]+$/.test(lastName)) {
      return res.status(400).json({
        success: false,
        message: 'Last name can only contain alphabetic characters'
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    if (!/^[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must start with a capital letter'
      });
    }

    if (!/[a-zA-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain alphabetic characters'
      });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain numbers'
      });
    }

    if (!/[_@#$%&*!]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one special character (_@#$%&*!)'
      });
    }

    // Check if user exists
    const existingUser = userOperations.findByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const userId = userOperations.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      mobile: mobile || null,
      role: 'user',
      isActive: 1
    });

    const user = userOperations.findById(userId);
    const token = generateToken(userId);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = userOperations.findByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    userOperations.updateLastLogin(user.id);
    const updatedUser = userOperations.findById(user.id);
    
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          mobile: updatedUser.mobile,
          role: updatedUser.role,
          lastLogin: updatedUser.lastLogin
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get user profile
app.get("/api/auth/profile", (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = userOperations.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          isActive: user.isActive === 1
        }
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
});

// Update user profile
app.put("/api/auth/update-profile", async (req, res) => {
  console.log('📝 Update profile endpoint hit');
  console.log('Request body:', req.body);
  console.log('Authorization header:', req.headers.authorization);
  
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token decoded:', decoded);
    
    const user = userOperations.findById(decoded.id);
    console.log('👤 User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { firstName, lastName, email, mobile, address, city, country } = req.body;
    console.log('📋 Update data:', { firstName, lastName, email, mobile, address, city, country });

    // Validation
    if (firstName && !/^[a-zA-Z]+$/.test(firstName)) {
      return res.status(400).json({
        success: false,
        message: 'First name can only contain alphabetic characters'
      });
    }

    if (lastName && !/^[a-zA-Z]+$/.test(lastName)) {
      return res.status(400).json({
        success: false,
        message: 'Last name can only contain alphabetic characters'
      });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = userOperations.findByEmail(email);
      if (existingUser && existingUser.id !== decoded.id) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Update user in database
    const updated = userOperations.update(decoded.id, {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      mobile: mobile !== undefined ? mobile : user.mobile,
      address: address !== undefined ? address : user.address,
      city: city !== undefined ? city : user.city,
      country: country !== undefined ? country : user.country
    });

    console.log('💾 Update result:', updated);

    if (updated) {
      const updatedUser = userOperations.findById(decoded.id);
      console.log('✅ Profile updated successfully');
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: updatedUser.id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            mobile: updatedUser.mobile,
            address: updatedUser.address,
            city: updatedUser.city,
            country: updatedUser.country,
            role: updatedUser.role,
            createdAt: updatedUser.createdAt,
            lastLogin: updatedUser.lastLogin,
            isActive: updatedUser.isActive === 1
          }
        }
      });
    } else {
      console.log('❌ Failed to update profile');
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
});

// Change Password
app.post("/api/auth/change-password", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = userOperations.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If currentPassword is provided, verify it
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password incorrect' });
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const updated = userOperations.update(user.id, { password: hashedPassword });

    if (updated) {
      res.json({ success: true, message: 'Password changed successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to update password' });
    }
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get clothing items
app.get("/api/clothing", (req, res) => {
  res.json([
    { id: 1, name: "Classic White T-Shirt", category: "tops", price: 24.99 },
    { id: 2, name: "Denim Jacket", category: "outerwear", price: 79.99 },
    { id: 3, name: "Leather Pants", category: "bottoms", price: 89.99 },
    { id: 4, name: "Summer Dress", category: "dresses", price: 59.99 },
    { id: 5, name: "Casual Shirt", category: "tops", price: 34.99 },
    { id: 6, name: "Blazer", category: "outerwear", price: 129.99 }
  ]);
});

// Get all users (for admin dashboard)
app.get("/api/users", (req, res) => {
  try {
    const users = userOperations.getAll();
    
    // Format users data
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      mobile: user.mobile || null,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isActive: user.isActive === 1
    }));

    res.json({
      success: true,
      data: formattedUsers
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// ==================== USER STATS ENDPOINT ====================
// Get user activity stats (try-ons, favorites, saved)
app.get("/api/user-stats/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get wishlist count (favorites) - user-specific
    const wishlist = wishlistOperations.getByUser(userId);
    const favoritesCount = wishlist ? wishlist.length : 0;
    
    // Get try-on count from localStorage key for this user
    // Since try-ons are stored in localStorage on frontend, we return 0 from backend
    // Frontend will load from localStorage with user-specific key
    let tryOnCount = 0;
    
    // Get saved combinations count - user-specific
    let savedCount = 0;
    try {
      const socialOutfits = socialOutfitsOperations.getAll ? socialOutfitsOperations.getAll() : [];
      savedCount = socialOutfits.filter(o => o.userId == userId).length;
    } catch(e) {
      savedCount = 0;
    }
    
    res.json({
      success: true,
      data: {
        tryOns: tryOnCount,
        favorites: favoritesCount,
        saved: savedCount
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user stats'
    });
  }
});

// ==================== WISHLIST ENDPOINTS ====================

// Get user wishlist
app.get("/api/wishlist/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = wishlistOperations.getByUser(userId);
    
    res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist'
    });
  }
});

// Add to wishlist
app.post("/api/wishlist", (req, res) => {
  try {
    const { userId, item } = req.body;
    
    if (!userId || !item) {
      return res.status(400).json({
        success: false,
        message: 'User ID and item are required'
      });
    }
    
    const added = wishlistOperations.add(userId, item);
    
    if (added) {
      res.json({
        success: true,
        message: 'Item added to wishlist'
      });
    } else {
      res.json({
        success: false,
        message: 'Item already in wishlist'
      });
    }
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist'
    });
  }
});

// Remove from wishlist
app.delete("/api/wishlist/:userId/:itemId", (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const removed = wishlistOperations.remove(userId, itemId);
    
    if (removed) {
      res.json({
        success: true,
        message: 'Item removed from wishlist'
      });
    } else {
      res.json({
        success: false,
        message: 'Item not found in wishlist'
      });
    }
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist'
    });
  }
});

// Check if item in wishlist
app.get("/api/wishlist/:userId/check/:itemId", (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const inWishlist = wishlistOperations.isInWishlist(userId, itemId);
    
    res.json({
      success: true,
      inWishlist: inWishlist
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist'
    });
  }
});

// ==================== CART ENDPOINTS ====================

// Get user cart
app.get("/api/cart/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const cart = cartOperations.getByUser(userId);
    const total = cartOperations.getTotal(userId);
    
    res.json({
      success: true,
      data: {
        items: cart,
        total: total
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart'
    });
  }
});

// Add to cart
app.post("/api/cart", (req, res) => {
  try {
    const { userId, item } = req.body;
    
    if (!userId || !item) {
      return res.status(400).json({
        success: false,
        message: 'User ID and item are required'
      });
    }
    
    const cartId = cartOperations.add(userId, item);
    
    res.json({
      success: true,
      message: 'Item added to cart',
      cartId: cartId
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to cart'
    });
  }
});

// Update cart item
app.put("/api/cart/:cartId", (req, res) => {
  try {
    const { cartId } = req.params;
    const { quantity } = req.body;
    
    const updated = cartOperations.update(cartId, quantity);
    
    if (updated) {
      res.json({
        success: true,
        message: 'Cart updated'
      });
    } else {
      res.json({
        success: false,
        message: 'Cart item not found'
      });
    }
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart'
    });
  }
});

// Remove from cart
app.delete("/api/cart/:cartId", (req, res) => {
  try {
    const { cartId } = req.params;
    const removed = cartOperations.remove(cartId);
    
    if (removed) {
      res.json({
        success: true,
        message: 'Item removed from cart'
      });
    } else {
      res.json({
        success: false,
        message: 'Item not found in cart'
      });
    }
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from cart'
    });
  }
});

// Clear cart
app.delete("/api/cart/clear/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const count = cartOperations.clear(userId);
    
    res.json({
      success: true,
      message: `${count} items removed from cart`
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart'
    });
  }
});

// ==================== REVIEWS ENDPOINTS ====================

// Get reviews for item
app.get("/api/reviews/:itemId", (req, res) => {
  try {
    const { itemId } = req.params;
    const reviews = reviewsOperations.getByItem(itemId);
    const stats = reviewsOperations.getAverageRating(itemId);
    
    res.json({
      success: true,
      data: {
        reviews: reviews,
        averageRating: stats.avgRating || 0,
        totalReviews: stats.count || 0
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Add review
app.post("/api/reviews", (req, res) => {
  try {
    const { userId, userName, itemId, rating, comment } = req.body;
    
    if (!userId || !userName || !itemId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'User ID, name, item ID, and rating are required'
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const reviewId = reviewsOperations.add(userId, userName, itemId, rating, comment);
    
    res.json({
      success: true,
      message: 'Review added successfully',
      reviewId: reviewId
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review'
    });
  }
});

// Delete review
app.delete("/api/reviews/:reviewId", (req, res) => {
  try {
    const { reviewId } = req.params;
    const deleted = reviewsOperations.delete(reviewId);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Review deleted'
      });
    } else {
      res.json({
        success: false,
        message: 'Review not found'
      });
    }
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
});

// ==================== RECENTLY VIEWED ENDPOINTS ====================

// Get recently viewed
app.get("/api/recently-viewed/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const limit = req.query.limit || 10;
    const items = recentlyViewedOperations.getByUser(userId, limit);
    
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Get recently viewed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recently viewed'
    });
  }
});

// Add to recently viewed
app.post("/api/recently-viewed", (req, res) => {
  try {
    const { userId, item } = req.body;
    
    if (!userId || !item) {
      return res.status(400).json({
        success: false,
        message: 'User ID and item are required'
      });
    }
    
    recentlyViewedOperations.add(userId, item);
    
    res.json({
      success: true,
      message: 'Added to recently viewed'
    });
  } catch (error) {
    console.error('Add recently viewed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to recently viewed'
    });
  }
});

// Upload image
app.post("/api/upload", (req, res) => {
  res.json({
    message: "Upload successful",
    imageUrl: "/uploads/demo-image.jpg"
  });
});

// ==================== AI VIRTUAL TRY-ON ENDPOINT ====================
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Function to upload image to LightX
async function uploadToLightX(filePath, apiKey) {
  const axios = require('axios');
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats.size;
  const contentType = 'image/jpeg'; // LightX prefers jpeg for try-on

  console.log(`📤 Uploading to LightX: ${path.basename(filePath)} (${fileSizeInBytes} bytes)`);

  // Step 1: Generate upload URL
  const uploadUrlResponse = await axios.post('https://api.lightxeditor.com/external/api/v2/uploadImageUrl', {
    uploadType: 'imageUrl',
    size: fileSizeInBytes,
    contentType: contentType
  }, {
    headers: { 'x-api-key': apiKey }
  });

  if (!uploadUrlResponse.data || !uploadUrlResponse.data.body || !uploadUrlResponse.data.body.uploadImage) {
    throw new Error('Failed to generate LightX upload URL');
  }

  const { uploadImage, imageUrl } = uploadUrlResponse.data.body;

  // Step 2: Upload the binary data
  const fileData = fs.readFileSync(filePath);
  await axios.put(uploadImage, fileData, {
    headers: { 'Content-Type': contentType }
  });

  console.log(`✅ Image uploaded to LightX: ${imageUrl}`);
  return imageUrl;
}

// Virtual Try-On API Endpoint with LightX (Andora AI Tools)
app.post('/api/tryon', upload.fields([
  { name: 'personImage', maxCount: 1 },
  { name: 'clothImage', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('🎨 Virtual Try-On Request Received (LightX)');
    
    if (!req.files || !req.files.personImage || !req.files.clothImage) {
      return res.status(400).json({
        success: false,
        message: 'Both person image and cloth image are required'
      });
    }

    const personImagePath = req.files.personImage[0].path;
    const clothImagePath = req.files.clothImage[0].path;
    const apiKey = process.env.LIGHTX_API_KEY;

    if (!apiKey) {
      throw new Error('LIGHTX_API_KEY is not configured in .env');
    }

    console.log('📸 Person Image:', personImagePath);
    console.log('👕 Cloth Image:', clothImagePath);

    const resultDir = path.join(__dirname, 'results');
    if (!fs.existsSync(resultDir)) {
      fs.mkdirSync(resultDir, { recursive: true });
    }

    try {
      console.log('🤖 Preparing LightX API Call...');
      
      // Step 1 & 2: Upload images to LightX
      const personUrl = await uploadToLightX(personImagePath, apiKey);
      const clothUrl = await uploadToLightX(clothImagePath, apiKey);
      
      console.log('✨ Calling LightX Virtual Try-On API...');
      const axios = require('axios');
      const tryonResponse = await axios.post('https://api.lightxeditor.com/external/api/v2/aivirtualtryon', {
        imageUrl: personUrl,
        styleImageUrl: clothUrl
      }, {
        headers: { 'x-api-key': apiKey }
      });

      if (tryonResponse.data && tryonResponse.data.body && tryonResponse.data.body.orderId) {
        const orderId = tryonResponse.data.body.orderId;
        console.log(`⏳ LightX Try-On Order Created: ${orderId}. Polling for status...`);

        let resultImageUrl = null;
        let attempts = 0;
        const maxAttempts = 15; // 45 seconds timeout
        
        while (attempts < maxAttempts && !resultImageUrl) {
          await new Promise(resolve => setTimeout(resolve, 3000));
          attempts++;
          
          const statusRes = await axios.post('https://api.lightxeditor.com/external/api/v2/order-status', {
            orderId: orderId
          }, {
            headers: { 'x-api-key': apiKey }
          });
          
          const statusBody = statusRes.data.body;
          if (statusBody.status === 'active') {
             resultImageUrl = statusBody.output;
             break;
          } else if (statusBody.status === 'failed') {
             throw new Error('LightX API failed to process the order.');
          }
          console.log(`   Polling... Attempt ${attempts}/${maxAttempts} - Status: ${statusBody.status}`);
        }
        
        if (!resultImageUrl) {
           throw new Error('LightX API timed out waiting for order to complete.');
        }

        const resultFileName = `result-${Date.now()}.jpg`;
        const resultPath = path.join(resultDir, resultFileName);
        
        console.log('📥 Downloading result image from:', resultImageUrl);
        const imageResponse = await axios.get(resultImageUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(resultPath, imageResponse.data);
        
        console.log('✅ LightX Try-On Result Generated:', resultFileName);
        
        return res.json({
          success: true,
          message: 'Virtual try-on completed successfully via LightX',
          data: {
            resultImage: `/results/${resultFileName}`,
            personImage: `/uploads/${path.basename(personImagePath)}`,
            clothImage: `/uploads/${path.basename(clothImagePath)}`,
            processedAt: new Date().toISOString()
          }
        });
      } else {
        throw new Error('LightX API did not return an orderId');
      }
      
    } catch (lightXError) {
      console.error('❌ LightX API Error:', lightXError.response ? lightXError.response.data : lightXError.message);
      
      // Fallback: Simple image overlay (Sharp)
      try {
        console.log('🔄 Using fallback image overlay...');
        const sharp = require('sharp');
        
        const personBuffer = fs.readFileSync(personImagePath);
        const clothBuffer = fs.readFileSync(clothImagePath);
        
        const personMeta = await sharp(personBuffer).metadata();
        const clothWidth = Math.floor(personMeta.width * 0.35);
        
        const resizedCloth = await sharp(clothBuffer)
          .resize(clothWidth, null, { fit: 'inside', withoutEnlargement: true })
          .toBuffer();
        
        const clothMeta = await sharp(resizedCloth).metadata();
        const left = Math.floor((personMeta.width - clothMeta.width) / 2);
        const top = Math.floor(personMeta.height * 0.15);
        
        const resultFileName = `result-${Date.now()}.png`;
        const resultPath = path.join(resultDir, resultFileName);
        
        await sharp(personBuffer)
          .composite([{ input: resizedCloth, top: top, left: left, blend: 'over' }])
          .jpeg({ quality: 90 })
          .toFile(resultPath);
        
        console.log('✅ Fallback Result Generated:', resultFileName);
        
        return res.json({
          success: true,
          message: 'Virtual try-on completed (using fallback)',
          data: {
            resultImage: `/results/${resultFileName}`,
            personImage: `/uploads/${path.basename(personImagePath)}`,
            clothImage: `/uploads/${path.basename(clothImagePath)}`,
            processedAt: new Date().toISOString()
          }
        });
      } catch (fallbackError) {
        console.error('❌ Fallback Error:', fallbackError.message);
        throw fallbackError;
      }
    }

  } catch (error) {
    console.error('❌ Try-On Error:', error);
    res.status(500).json({
      success: false,
      message: 'Virtual try-on failed',
      error: error.message
    });
  }
});

// Get all results
app.get('/api/results', (req, res) => {
  try {
    const resultDir = path.join(__dirname, 'results');
    if (!fs.existsSync(resultDir)) {
      return res.json({ success: true, data: [] });
    }

    const files = fs.readdirSync(resultDir);
    const results = files.map(file => ({
      filename: file,
      url: `/results/${file}`,
      createdAt: fs.statSync(path.join(resultDir, file)).mtime
    }));

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch results',
      error: error.message
    });
  }
});

// ==================== END AI TRY-ON ENDPOINT ====================

// ==================== GAMIFICATION ENDPOINTS ====================

// Get user gamification data
app.get("/api/gamification/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const data = gamificationOperations.get(userId);
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Get gamification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gamification data'
    });
  }
});

// Add points
app.post("/api/gamification/points", (req, res) => {
  try {
    const { userId, points, action } = req.body;
    
    if (!userId || !points) {
      return res.status(400).json({
        success: false,
        message: 'User ID and points are required'
      });
    }
    
    const result = gamificationOperations.addPoints(userId, points);
    
    res.json({
      success: true,
      message: `Earned ${points} points for ${action}!`,
      data: result
    });
  } catch (error) {
    console.error('Add points error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add points'
    });
  }
});

// Get leaderboard
app.get("/api/gamification/leaderboard", (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const leaderboard = gamificationOperations.getLeaderboard(limit);
    
    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard'
    });
  }
});

// ==================== FASHION CHALLENGES ENDPOINTS ====================

// Get all challenges
app.get("/api/challenges", (req, res) => {
  try {
    const status = req.query.status;
    const challenges = fashionChallengesOperations.getAll(status);
    
    res.json({
      success: true,
      data: challenges
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenges'
    });
  }
});

// Get challenge by ID
app.get("/api/challenges/:id", (req, res) => {
  try {
    const { id } = req.params;
    const challenge = fashionChallengesOperations.getById(id);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    res.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenge'
    });
  }
});

// Create challenge (admin only)
app.post("/api/challenges", (req, res) => {
  try {
    const challenge = req.body;
    
    if (!challenge.title || !challenge.description || !challenge.startDate || !challenge.endDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const challengeId = fashionChallengesOperations.create(challenge);
    
    res.json({
      success: true,
      message: 'Challenge created successfully',
      challengeId: challengeId
    });
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create challenge'
    });
  }
});

// Join challenge
app.post("/api/challenges/:id/join", (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const joined = fashionChallengesOperations.join(id, userId);
    
    if (joined) {
      // Award points for joining
      gamificationOperations.addPoints(userId, 10);
      
      res.json({
        success: true,
        message: 'Joined challenge successfully! +10 points'
      });
    } else {
      res.json({
        success: false,
        message: 'Already joined this challenge'
      });
    }
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join challenge'
    });
  }
});

// Submit to challenge
app.post("/api/challenges/:id/submit", (req, res) => {
  try {
    const { id } = req.params;
    const submission = req.body;
    
    if (!submission.userId || !submission.userName || !submission.imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    submission.challengeId = id;
    const submissionId = fashionChallengesOperations.submit(submission);
    
    // Award points for submission
    gamificationOperations.addPoints(submission.userId, 50);
    
    res.json({
      success: true,
      message: 'Submission successful! +50 points',
      submissionId: submissionId
    });
  } catch (error) {
    console.error('Submit challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit to challenge'
    });
  }
});

// Get challenge submissions
app.get("/api/challenges/:id/submissions", (req, res) => {
  try {
    const { id } = req.params;
    const submissions = fashionChallengesOperations.getSubmissions(id);
    
    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions'
    });
  }
});

// Vote for submission
app.post("/api/challenges/submissions/:id/vote", (req, res) => {
  try {
    const { id } = req.params;
    const voted = fashionChallengesOperations.vote(id);
    
    if (voted) {
      res.json({
        success: true,
        message: 'Vote recorded successfully'
      });
    } else {
      res.json({
        success: false,
        message: 'Submission not found'
      });
    }
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record vote'
    });
  }
});

// ==================== VIRTUAL FASHION SHOWS ENDPOINTS ====================

// Get all shows
app.get("/api/fashion-shows", (req, res) => {
  try {
    const status = req.query.status;
    const shows = virtualFashionShowsOperations.getAll(status);
    
    res.json({
      success: true,
      data: shows
    });
  } catch (error) {
    console.error('Get shows error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fashion shows'
    });
  }
});

// Get show by ID
app.get("/api/fashion-shows/:id", (req, res) => {
  try {
    const { id } = req.params;
    const show = virtualFashionShowsOperations.getById(id);
    
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Fashion show not found'
      });
    }
    
    res.json({
      success: true,
      data: show
    });
  } catch (error) {
    console.error('Get show error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fashion show'
    });
  }
});

// Create show (admin only)
app.post("/api/fashion-shows", (req, res) => {
  try {
    const show = req.body;
    
    if (!show.title || !show.description || !show.hostName || !show.scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const showId = virtualFashionShowsOperations.create(show);
    
    res.json({
      success: true,
      message: 'Fashion show created successfully',
      showId: showId
    });
  } catch (error) {
    console.error('Create show error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create fashion show'
    });
  }
});

// Register for show
app.post("/api/fashion-shows/:id/register", (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const registered = virtualFashionShowsOperations.register(id, userId);
    
    if (registered) {
      // Award points for registration
      gamificationOperations.addPoints(userId, 20);
      
      res.json({
        success: true,
        message: 'Registered for fashion show! +20 points'
      });
    } else {
      res.json({
        success: false,
        message: 'Already registered for this show'
      });
    }
  } catch (error) {
    console.error('Register show error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for fashion show'
    });
  }
});

// ==================== LIVE CHAT ENDPOINTS ====================

// Get recent messages
app.get("/api/chat/messages", (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const messages = liveChatOperations.getRecent(limit);
    
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// Send message
app.post("/api/chat/messages", (req, res) => {
  try {
    const { userId, userName, message, type } = req.body;
    
    if (!userId || !userName || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const messageId = liveChatOperations.send(userId, userName, message, type || 'user');
    
    res.json({
      success: true,
      message: 'Message sent successfully',
      messageId: messageId
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// Get messages after timestamp (for polling)
app.get("/api/chat/messages/after/:timestamp", (req, res) => {
  try {
    const { timestamp } = req.params;
    const messages = liveChatOperations.getAfter(timestamp);
    
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Get new messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch new messages'
    });
  }
});

// ==================== END ENGAGEMENT FEATURES ====================

// ==================== ADDRESSES API ====================

// Get all addresses for logged-in user
app.get("/api/addresses", (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const addresses = addressesOperations.getByUser(decoded.id);
    
    res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses'
    });
  }
});

// Add new address
app.post("/api/addresses", (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const { fullName, mobile, house, street, city, state, pincode, country, isDefault } = req.body;
    
    if (!fullName || !mobile || !house || !street || !city || !state || !pincode || !country) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    const addressId = addressesOperations.add(decoded.id, {
      fullName,
      mobile,
      house,
      street,
      city,
      state,
      pincode,
      country,
      isDefault: isDefault || false
    });
    
    res.json({
      success: true,
      message: 'Address added successfully',
      addressId: addressId
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add address'
    });
  }
});

// Update address
app.put("/api/addresses/:id", (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const addressId = req.params.id;
    const { fullName, mobile, house, street, city, state, pincode, country, isDefault } = req.body;
    
    if (!fullName || !mobile || !house || !street || !city || !state || !pincode || !country) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    const updated = addressesOperations.update(addressId, decoded.id, {
      fullName,
      mobile,
      house,
      street,
      city,
      state,
      pincode,
      country,
      isDefault: isDefault || false
    });
    
    if (updated) {
      res.json({
        success: true,
        message: 'Address updated successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update address'
    });
  }
});

// Delete address
app.delete("/api/addresses/:id", (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const addressId = req.params.id;
    
    const deleted = addressesOperations.delete(addressId, decoded.id);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Address deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete address'
    });
  }
});

// Set default address
app.put("/api/addresses/:id/default", (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const addressId = req.params.id;
    
    const updated = addressesOperations.setDefault(addressId, decoded.id);
    
    if (updated) {
      res.json({
        success: true,
        message: 'Default address updated successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set default address'
    });
  }
});



// Gemini AI Live Chat Support Endpoint (with retry + multi-model fallback)
app.post('/api/ai-chat-support', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    const user = JSON.parse(req.body.user || '{}');
    const userId = user.id || 'guest';
    const userName = user.name || user.username || 'Guest';
    
    console.log('📩 Received chat message:', message);
    
    // Save user message to database
    try {
      liveChatOperations.send(userId, userName, message, 'user');
      console.log('✅ User message saved to database');
    } catch (dbError) {
      console.log('⚠️ Could not save to database:', dbError.message);
    }
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ Gemini API key not found');
      return useFallbackResponse(message, res);
    }
    
    console.log('✅ Gemini API key found');
    
    // Build chat context from history
    let historyContext = '';
    if (chatHistory && chatHistory.length > 0) {
      historyContext = '\n\nRecent chat history:\n' + chatHistory.map(m => 
        `${m.type === 'user' ? 'User' : 'Assistant'}: ${m.message}`
      ).join('\n') + '\n\n';
    }
    
    const systemContext = `You are a friendly and intelligent AI assistant for "Dressify" - an AI Virtual Clothing Try-On platform.

🎯 PRIMARY ROLE - Dressify Support:
When users ask about Dressify, provide expert help:
- AI-powered virtual try-on for clothes
- Upload your photo and clothing images
- See how clothes look on you instantly
- Free to use, no payment required
- Supports JPG, PNG, JPEG formats (max 10MB)
- AI Style Advisor for personalized fashion recommendations
- Wardrobe Mixer to create outfit combinations
- Social sharing features

🌟 SECONDARY ROLE - General Assistant:
When users ask general questions (not about Dressify), be a helpful AI companion:
- Answer questions on any topic (technology, science, life, entertainment, etc.)
- Have casual conversations naturally
- Provide information, explanations, and advice
- Be creative and engaging
- Help with problem-solving and brainstorming

📋 GUIDELINES:
- Detect if question is about Dressify or general topic
- For Dressify questions: Focus on platform features and support
- For general questions: Be helpful, informative, and conversational
- Keep responses concise (2-4 sentences usually)
- Use emojis occasionally to be friendly 😊
- Give DIFFERENT responses each time, don't repeat yourself
- Be natural, warm, and engaging
- ACTUALLY ANSWER the question, don't just say you can help
${historyContext}
User's message: ${message}`;

    // Try multiple models with retry
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-flash-latest'];
    
    for (const modelName of modelsToTry) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          console.log(`🤖 Trying ${modelName} (attempt ${attempt + 1})...`);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(systemContext);
          const aiResponse = result.response.text();
          
          console.log('✅ AI Response generated:', aiResponse.substring(0, 100) + '...');
          
          // Save AI response to database
          try {
            liveChatOperations.send('support', 'Dressify Support', aiResponse, 'support');
            console.log('✅ Support message saved to database');
          } catch (dbError) {
            console.log('⚠️ Could not save support response to database:', dbError.message);
          }
          
          return res.json({
            success: true,
            data: {
              message: aiResponse,
              timestamp: new Date().toISOString(),
              model: modelName
            }
          });
        } catch (apiError) {
          console.log(`⚠️ ${modelName} attempt ${attempt + 1} failed:`, apiError.message?.substring(0, 120));
          
          // If rate limited and first attempt, wait and retry
          if (apiError.status === 429 && attempt === 0) {
            console.log('⏳ Rate limited, waiting 3 seconds before retry...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            continue;
          }
          break; // Move to next model
        }
      }
    }
    
    // All models failed, use smart fallback
    console.log('⚠️ All Gemini models failed, using smart fallback');
    return useFallbackResponse(message, res, userId, userName);
    
  } catch (error) {
    console.error('❌ Chat Error:', error);
    return useFallbackResponse(message, res);
  }
});

// Smart conversational fallback response function
function useFallbackResponse(userMessage, res, userId = 'guest', userName = 'Guest') {
  const lowerMsg = userMessage.toLowerCase().trim();
  let response = '';
  
  // ===== GREETINGS =====
  if (/^(hi|hello|hey|hola|namaste|hii+|helloo+|yo|sup|heyy+)\b/.test(lowerMsg)) {
    const greetings = [
      "Hey there! 👋 Welcome to Dressify! How can I help you today?",
      "Hello! 😊 Great to see you! I'm your Dressify assistant — ask me anything!",
      "Hi! 👋 I'm here to help. Want to try some virtual outfits or just chat?"
    ];
    response = greetings[Math.floor(Math.random() * greetings.length)];
  }
  // ===== HOW ARE YOU / WHAT'S UP =====
  else if (lowerMsg.includes('how are you') || lowerMsg.includes('how r u') || lowerMsg.includes('kaise ho') || lowerMsg.includes('kya haal')) {
    const howAreYou = [
      "I'm doing great, thanks for asking! 😄 Ready to help you find the perfect look. What's on your mind?",
      "Feeling awesome! 🌟 Always excited to chat. How about you? Need help with anything?",
      "I'm fantastic! 💪 Thanks for asking. Is there something I can help you with today?"
    ];
    response = howAreYou[Math.floor(Math.random() * howAreYou.length)];
  }
  // ===== WHAT'S UP =====
  else if (lowerMsg.includes("what's up") || lowerMsg.includes('whats up') || lowerMsg.includes('wassup') || lowerMsg === 'sup') {
    response = "Not much, just here helping people look awesome with virtual try-ons! 😎 What's up with you?";
  }
  // ===== GOOD MORNING/AFTERNOON/NIGHT =====
  else if (lowerMsg.includes('good morning')) {
    response = "Good morning! ☀️ Hope you're having a wonderful start to your day! How can I help?";
  }
  else if (lowerMsg.includes('good afternoon')) {
    response = "Good afternoon! 🌤️ Hope your day is going well! What can I do for you?";
  }
  else if (lowerMsg.includes('good night') || lowerMsg.includes('goodnight')) {
    response = "Good night! 🌙 Sleep well and come back to try some amazing outfits tomorrow! Sweet dreams! 😊";
  }
  else if (lowerMsg.includes('good evening')) {
    response = "Good evening! 🌆 Hope you had a great day! Need any help with fashion or anything else?";
  }
  // ===== THANK YOU =====
  else if (lowerMsg.includes('thank') || lowerMsg.includes('thanks') || lowerMsg.includes('shukriya') || lowerMsg.includes('dhanyavaad')) {
    const thanks = [
      "You're welcome! 😊 Happy to help anytime!",
      "No problem at all! 🤗 Let me know if you need anything else!",
      "Glad I could help! Feel free to ask me anything anytime! 💫"
    ];
    response = thanks[Math.floor(Math.random() * thanks.length)];
  }
  // ===== BYE =====
  else if (/^(bye|goodbye|see ya|tata|alvida|cya)\b/.test(lowerMsg) || lowerMsg.includes('bye')) {
    response = "Goodbye! 👋 It was nice chatting with you. Come back anytime for virtual try-ons or a chat! 😊";
  }
  // ===== YOUR NAME / WHO ARE YOU =====
  else if (lowerMsg.includes('your name') || lowerMsg.includes('who are you') || lowerMsg.includes('kaun ho')) {
    response = "I'm Dressify's AI assistant! 🤖 I help you try on clothes virtually, give fashion advice, and I can chat about pretty much anything. Nice to meet you! 😊";
  }
  // ===== JOKES =====
  else if (lowerMsg.includes('joke') || lowerMsg.includes('funny') || lowerMsg.includes('mazaak')) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything! 😄",
      "What do you call a bear with no teeth? A gummy bear! 🐻",
      "What do you call a fake noodle? An impasta! 🍝",
      "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾😂",
      "What do you call a sleeping T-Rex? A dino-snore! 🦖💤"
    ];
    response = jokes[Math.floor(Math.random() * jokes.length)];
  }
  // ===== WEATHER =====
  else if (lowerMsg.includes('weather') || lowerMsg.includes('mausam')) {
    response = "I can't check real-time weather, but I can help you pick outfits for any weather! ☀️🌧️ Sunny? Try a light dress. Rainy? How about a cool jacket? Want to try one on virtually?";
  }
  // ===== TIME =====
  else if (lowerMsg.includes('what time') || lowerMsg.includes('kitne baje') || lowerMsg.includes('time kya')) {
    const now = new Date();
    response = `It's currently ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} 🕐 Anything else I can help with?`;
  }
  // ===== LOVE / EMOTIONS =====
  else if (lowerMsg.includes('i love you') || lowerMsg.includes('love you')) {
    response = "Aww, that's so sweet! 🥰 I appreciate you too! Now, let's channel that love into finding you the perfect outfit! 😄";
  }
  else if (lowerMsg.includes('i am sad') || lowerMsg.includes('sad') || lowerMsg.includes('feeling down') || lowerMsg.includes('dukhi')) {
    response = "I'm sorry to hear that. 🤗 Here's a virtual hug! Sometimes trying on a fresh new outfit can really lift your mood — want to give it a try? Fashion therapy is real! 😊✨";
  }
  else if (lowerMsg.includes('bored') || lowerMsg.includes('boring')) {
    response = "Bored? Let's fix that! 🎨 How about trying some virtual outfit combinations? Mix and match different styles — it's like playing dress-up but way cooler! 😎";
  }
  // ===== HELP =====
  else if (lowerMsg.includes('help') || lowerMsg.includes('madad')) {
    response = "I'm here to help! 🙌 Here's what I can do:\n• 👗 Virtual try-on: Upload photo + clothing\n• 🎨 Style advice: Get personalized recommendations\n• 👕 Wardrobe mixer: Create outfit combos\n• 💬 Chat: Ask me anything!\n\nWhat would you like to try?";
  }
  // ===== DRESSIFY FEATURES =====
  else if (lowerMsg.includes('dressify') || lowerMsg.includes('try on') || lowerMsg.includes('try-on')) {
    response = "Dressify lets you virtually try on clothes using AI! 🌟 Just upload your photo and a clothing image, and see how it looks on you instantly. It's 100% free! Want to give it a go?";
  }
  else if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('pay') || lowerMsg.includes('free') || lowerMsg.includes('charge')) {
    response = "Great news — Dressify is completely FREE! 🎉 No hidden charges, no subscriptions. Try unlimited outfits without spending a penny!";
  }
  else if (lowerMsg.includes('upload') || lowerMsg.includes('photo') || lowerMsg.includes('image')) {
    response = "You can upload JPG, PNG, or JPEG images up to 10MB! 📤 Just click the upload button, select your photo and clothing image, then hit 'Try On'. Super easy!";
  }
  else if (lowerMsg.includes('feature') || lowerMsg.includes('what can')) {
    response = "Dressify has amazing features! 🌟\n• AI Virtual Try-On\n• Style Advisor for personalized recs\n• Wardrobe Mixer to create outfits\n• Social sharing & voting\n\nAll completely free!";
  }
  else if (lowerMsg.includes('how') && (lowerMsg.includes('use') || lowerMsg.includes('work'))) {
    response = "It's super easy! 📸\n1. Upload a photo of yourself\n2. Upload a clothing image\n3. Click 'Try On'\n4. See the result instantly!\n\nOur AI does all the magic. Give it a try!";
  }
  else if (lowerMsg.includes('wardrobe') || lowerMsg.includes('mixer')) {
    response = "The Wardrobe Mixer lets you combine different clothing items to create unique outfits! 🎨 Mix tops, bottoms, and accessories to find your perfect look!";
  }
  else if (lowerMsg.includes('style') || lowerMsg.includes('advisor') || lowerMsg.includes('fashion')) {
    response = "Our AI Style Advisor gives you personalized fashion recommendations based on your preferences! 👗✨ It's like having a personal stylist right in your browser!";
  }
  // ===== GENERAL CATCH-ALL (much better) =====
  else {
    const smartResponses = [
      `That's interesting! 😊 I'd love to give you a detailed answer. While my AI brain is warming up, feel free to try our virtual try-on feature or ask me something else!`,
      `Great question! 🤔 I'm a fashion-focused AI but I love chatting about everything. Could you tell me a bit more about what you'd like to know?`,
      `Hmm, let me think about that! 💭 While I process, did you know you can virtually try on any outfit on Dressify? It's free and fun! 😊`,
      `That's a cool topic! 🌟 I'm here for both chatting and helping with virtual fashion. Ask me anything specific and I'll do my best to help!`
    ];
    response = smartResponses[Math.floor(Math.random() * smartResponses.length)];
  }
  
  // Save support response to database
  try {
    liveChatOperations.send('support', 'Dressify Support', response, 'support');
    console.log('✅ Fallback response saved to database');
  } catch (dbError) {
    console.log('⚠️ Could not save fallback response to database:', dbError.message);
  }
  
  return res.json({
    success: true,
    data: {
      message: response,
      timestamp: new Date().toISOString(),
      model: 'fallback-smart'
    }
  });
}

// ==================== ADDITIONAL UNIQUE ENDPOINTS ====================

// Update streak
app.post("/api/gamification/streak/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const streak = gamificationOperations.updateStreak(userId);
    
    res.json({
      success: true,
      streak: streak
    });
  } catch (error) {
    console.error('Update streak error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update streak'
    });
  }
});

// Update fashion show status
app.patch("/api/fashion-shows/:id/status", (req, res) => {
  try {
    const updated = virtualFashionShowsOperations.updateStatus(req.params.id, req.body.status);
    res.json({ success: updated });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Send chat message (alternate endpoint)
app.post("/api/chat/send", (req, res) => {
  try {
    const { userId, userName, message, type } = req.body;
    const messageId = liveChatOperations.send(userId, userName, message, type || 'user');
    res.json({ success: true, messageId });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Update chat message
app.put("/api/chat/messages/:id", (req, res) => {
  try {
    const { message, userId } = req.body;
    const { id } = req.params;
    
    if (!message || !userId) {
      return res.status(400).json({ success: false, message: 'Missing parameters' });
    }
    
    const updated = liveChatOperations.update(id, userId, message);
    if (updated) {
      res.json({ success: true, message: 'Message updated' });
    } else {
      res.status(404).json({ success: false, message: 'Message not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Cleanup old messages
app.delete("/api/chat/cleanup", (req, res) => {
  try {
    const deleted = liveChatOperations.cleanup();
    res.json({ success: true, message: `Cleaned up ${deleted} old messages` });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// ==================== STYLE ADVISOR ENDPOINTS ====================

// Get user style profile
app.get("/api/style-profile/:userId", (req, res) => {
  res.json({ success: true, data: null });
});

// Save user style profile
app.post("/api/style-profile", (req, res) => {
  res.json({ success: true, data: req.body });
});

// Generate AI Style Advice (with retry + multi-model fallback)
app.post("/api/ai-style-advice", async (req, res) => {
  try {
    const profile = req.body;
    console.log('👗 Generating AI Style advice for profile:', profile.preferredStyle);

    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ Gemini API key not found for style advisor');
      return useStyleFallback(profile, res);
    }

    const prompt = `
      You are an expert AI Fashion & Style Advisor for "Dressify". 
      Based on the following user profile, generate exactly 4 personalized clothing recommendations.
      Each recommendation must be clearly distinct (e.g., tops, bottoms, full outfits, accessories, or specific styles).
      
      User Profile:
      - Body Type: ${profile.bodyType || 'Not specified'}
      - Skin Tone: ${profile.skinTone || 'Not specified'}
      - Preferred Style: ${profile.preferredStyle || 'Not specified'}
      - Favorite Colors: ${profile.favoriteColors ? (Array.isArray(profile.favoriteColors) ? profile.favoriteColors.join(', ') : profile.favoriteColors) : 'Not specified'}
      - Budget: ${profile.budget || 'Not specified'}
      
      Output the recommendations strictly as a JSON array of objects without any markdown formatting, backticks, or extra text. Each object must have the following keys:
      - "badge": A short emoji and phrase (e.g., "👔 Perfect Fit")
      - "title": A short, catchy title (e.g., "Fitted Shirts & Slim Jeans")
      - "description": A 1-2 sentence explanation of why this fits their profile
      - "tags": An array of 3 string tags (e.g., ["Fitted", "Modern", "Stylish"])
    `;

    // Try multiple models with retry (similar to chat support)
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-flash-latest'];
    
    for (const modelName of modelsToTry) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          console.log(`🤖 Style Advisor: Trying ${modelName} (attempt ${attempt + 1})...`);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          let responseText = result.response.text();
          
          // Clean up formatting
          responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          
          const recommendations = JSON.parse(responseText);
          console.log('✅ Style advice generated successfully');
          
          return res.json({
            success: true,
            data: recommendations
          });
        } catch (apiError) {
          console.log(`⚠️ Style Advisor: ${modelName} attempt ${attempt + 1} failed`);
          
          if (apiError.status === 429 && attempt === 0) {
            console.log('⏳ Style Advisor: Rate limited, waiting 3 seconds...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            continue;
          }
          break; // Move to next model
        }
      }
    }

    // All models failed, use smart style fallback
    console.log('⚠️ All Gemini models failed for style advisor, using smart fallback');
    return useStyleFallback(profile, res);

  } catch (error) {
    console.error('❌ Style Advisor Critical Error:', error);
    return useStyleFallback(req.body, res);
  }
});

// Intelligent Preference-Aware Style Fallback
function useStyleFallback(profile, res) {
  const style = (profile.preferredStyle || '').toLowerCase();
  let recommendations = [];

  // Default Classic Recommendations
  const classicRecs = [
    { badge: "👕 Classic Pick", title: "Classic Fitted T-Shirt", description: "A well-fitted tee in a neutral color works for any occasion.", tags: ["Casual", "Versatile", "Essential"] },
    { badge: "👖 Perfect Bottom", title: "Slim Fit Chinos", description: "Comfortable chinos that pair well with both casual and formal tops.", tags: ["Smart Casual", "Essential", "Comfortable"] },
    { badge: "🧥 Layer Up", title: "Light Layering Jacket", description: "Add a structured jacket to elevate any simple outfit instantly.", tags: ["Layering", "Trendy", "Modern"] },
    { badge: "👟 Step Out", title: "Minimalist Sneakers", description: "Clean white sneakers complete any modern casual look perfectly.", tags: ["Footwear", "Modern", "Versatile"] }
  ];

  // Formal/Professional recommendations
  if (style.includes('formal') || style.includes('office') || style.includes('business')) {
    recommendations = [
      { badge: "👔 Sharp Look", title: "Crisp Oxford Shirt", description: "A clean white or light blue oxford shirt is the foundation of a great formal look.", tags: ["Professional", "Formal", "Sharp"] },
      { badge: "💼 Power Choice", title: "Structured Navy Blazer", description: "Instantly adds authority and style to your professional wardrobe.", tags: ["Executive", "Formal", "Sophisticated"] },
      { badge: "👞 Elegant Step", title: "Leather Loafers", description: "Perfect for a professional setting while remaining comfortable all day.", tags: ["Footwear", "Formal", "Classy"] },
      { badge: "⌚ Pro Accessory", title: "Minimalist Watch", description: "A subtle timepiece to complete your sophisticated business attire.", tags: ["Accessory", "Timeless", "Office"] }
    ];
  }
  // Trendy/Streetwear recommendations
  else if (style.includes('trendy') || style.includes('street') || style.includes('modern') || style.includes('bold')) {
    recommendations = [
      { badge: "🔥 Trend Setter", title: "Oversized Graphic Tee", description: "A bold graphic print that reflects your personality and current street trends.", tags: ["Streetwear", "Bold", "Urban"] },
      { badge: "🛹 Urban Style", title: "Distressed Cargo Pants", description: "Practical and stylish, these pants define the modern urban aesthetic.", tags: ["Modern", "Utility", "Streetwear"] },
      { badge: "🧢 Cool Vibe", title: "Premium Snapback Hat", description: "The perfect accessory to round off your contemporary casual look.", tags: ["Accessory", "Urban", "Casual"] },
      { badge: "⚡ Hype Pick", title: "High-Top Chunky Sneakers", description: "Make a statement with footwear designed to stand out in a crowd.", tags: ["Footwear", "Hype", "Limited"] }
    ];
  }
  // Ethnic/Traditional recommendations
  else if (style.includes('ethnic') || style.includes('traditional') || style.includes('kurta')) {
    recommendations = [
      { badge: "🥻 Cultural Gem", title: "Embroidered Cotton Kurta", description: "Elegant and comfortable, perfect for festive occasions or daily ethnic wear.", tags: ["Traditional", "Elegant", "Festive"] },
      { badge: "✨ Ethnic Blend", title: "Nehru Jacket Layer", description: "Layer this over a kurta or shirt for a sophisticated Indo-western fusion.", tags: ["Traditional", "Fusion", "Classy"] },
      { badge: "👖 Comfort Fit", title: "Straight Cut Pajamas", description: "High-quality cotton fabric ensuring style without compromising on comfort.", tags: ["Ethnic", "Comfort", "Essential"] },
      { badge: "🧎 Sharp Add-on", title: "Traditional Jutti", description: "Complete your ethnic ensemble with these hand-stitched traditional shoes.", tags: ["Footwear", "Ethnic", "Artisanal"] }
    ];
  }
  // Default to Classic if no match
  else {
    recommendations = classicRecs;
  }

  // Adjust for colors if specified
  if (profile.favoriteColors && profile.favoriteColors.length > 0) {
    const color = Array.isArray(profile.favoriteColors) ? profile.favoriteColors[0] : profile.favoriteColors;
    recommendations[0].description += ` Look for this in ${color} to match your favorite color!`;
  }

  return res.json({
    success: true,
    data: recommendations
  });
}

// ==================== SOCIAL SHARING ENDPOINTS ====================

// Share outfit to community
app.post("/api/social/share", (req, res) => {
  try {
    const { userId, userName, imageUrl, description } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }
    
    const outfitId = socialOutfitsOperations.share(
      userId || 0,
      userName || 'Anonymous',
      imageUrl,
      description || 'Check out my new look!'
    );
    
    const outfit = socialOutfitsOperations.getById(outfitId);
    
    res.json({
      success: true,
      message: 'Outfit shared successfully!',
      data: { ...outfit, voted: false, comments: [] }
    });
  } catch (error) {
    console.error('Error sharing outfit:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to share outfit'
    });
  }
});

// Get shared outfits
app.get("/api/social/outfits", (req, res) => {
  try {
    const userId = req.query.userId || null;
    const outfits = socialOutfitsOperations.getAll(userId);
    
    res.json({
      success: true,
      data: outfits
    });
  } catch (error) {
    console.error('Error getting outfits:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get outfits'
    });
  }
});

// Vote for outfit (toggle)
app.post("/api/social/vote/:outfitId", (req, res) => {
  try {
    const { outfitId } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const result = socialOutfitsOperations.vote(parseInt(outfitId), parseInt(userId));
    const outfit = socialOutfitsOperations.getById(parseInt(outfitId));
    
    res.json({
      success: true,
      action: result.action,
      votes: outfit ? outfit.votes : 0
    });
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to vote'
    });
  }
});

// Delete shared outfit (owner only)
app.delete("/api/social/outfits/:outfitId", (req, res) => {
  try {
    const { outfitId } = req.params;
    const { userId } = req.body;
    
    const deleted = socialOutfitsOperations.delete(parseInt(outfitId), parseInt(userId));
    
    res.json({
      success: deleted,
      message: deleted ? 'Outfit deleted' : 'Not authorized or not found'
    });
  } catch (error) {
    console.error('Error deleting outfit:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete outfit'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 StyleFusion AI Backend Server (SQLite MODE)`);
  console.log(`📍 Server running at http://localhost:${PORT}`);
  console.log(`💾 Using SQLite database`);
  console.log(`🌍 Environment: development`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log(`\n✅ Ready to accept requests!\n`);
});
