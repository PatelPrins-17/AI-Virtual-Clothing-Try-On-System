const Database = require('better-sqlite3');
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create users table
const createUsersTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            mobile TEXT,
            role TEXT DEFAULT 'user',
            isActive INTEGER DEFAULT 1,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            lastLogin TEXT
        )
    `;
    
    db.exec(sql);
    
    // Remove address, city, country columns if they exist
    // SQLite doesn't support DROP COLUMN directly, so we need to recreate the table
    try {
        // Check if old columns exist
        const tableInfo = db.prepare("PRAGMA table_info(users)").all();
        const columnNames = tableInfo.map(col => col.name);
        const hasOldColumns = columnNames.some(name => ['address', 'city', 'country'].includes(name));
        const hasMobile = columnNames.includes('mobile');
        
        console.log('📊 Current users table columns:', columnNames);
        console.log('🔍 Has old columns (address/city/country):', hasOldColumns);
        console.log('🔍 Has mobile column:', hasMobile);
        
        if (hasOldColumns || !hasMobile) {
            console.log('🔄 Migrating users table...');
            
            // Create new table with correct structure
            db.exec(`
                CREATE TABLE users_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    firstName TEXT NOT NULL,
                    lastName TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    mobile TEXT,
                    role TEXT DEFAULT 'user',
                    isActive INTEGER DEFAULT 1,
                    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                    lastLogin TEXT
                )
            `);
            
            // Copy data from old table to new table (handle missing mobile column)
            if (hasMobile) {
                db.exec(`
                    INSERT INTO users_new (id, firstName, lastName, email, password, mobile, role, isActive, createdAt, lastLogin)
                    SELECT id, firstName, lastName, email, password, mobile, role, isActive, createdAt, lastLogin
                    FROM users
                `);
            } else {
                db.exec(`
                    INSERT INTO users_new (id, firstName, lastName, email, password, role, isActive, createdAt, lastLogin)
                    SELECT id, firstName, lastName, email, password, role, isActive, createdAt, lastLogin
                    FROM users
                `);
            }
            
            // Drop old table
            db.exec(`DROP TABLE users`);
            
            // Rename new table to users
            db.exec(`ALTER TABLE users_new RENAME TO users`);
            
            console.log('✅ Users table migrated successfully');
            if (hasOldColumns) {
                console.log('   - Removed: address, city, country columns');
            }
            if (!hasMobile) {
                console.log('   - Added: mobile column');
            }
        } else {
            console.log('✅ Users table already has correct structure');
        }
    } catch (error) {
        console.error('❌ Migration error:', error.message);
        throw error;
    }
    
    console.log('✅ Users table created/verified');
};

// Create wishlist table
const createWishlistTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS wishlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            itemId INTEGER NOT NULL,
            itemName TEXT NOT NULL,
            itemPrice REAL NOT NULL,
            itemImage TEXT NOT NULL,
            itemCategory TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(userId, itemId)
        )
    `;
    
    db.exec(sql);
    console.log('✅ Wishlist table created/verified');
};

// Create cart table
const createCartTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            itemId INTEGER NOT NULL,
            itemName TEXT NOT NULL,
            itemPrice REAL NOT NULL,
            itemImage TEXT NOT NULL,
            itemCategory TEXT,
            quantity INTEGER DEFAULT 1,
            size TEXT,
            color TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    
    db.exec(sql);
    console.log('✅ Cart table created/verified');
};

// Create reviews table
const createReviewsTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            itemId INTEGER NOT NULL,
            rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
            comment TEXT,
            userName TEXT NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    
    db.exec(sql);
    console.log('✅ Reviews table created/verified');
};

// Create recently viewed table
const createRecentlyViewedTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS recently_viewed (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            itemId INTEGER NOT NULL,
            itemName TEXT NOT NULL,
            itemPrice REAL NOT NULL,
            itemImage TEXT NOT NULL,
            itemCategory TEXT,
            viewedAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(userId, itemId)
        )
    `;
    
    db.exec(sql);
    console.log('✅ Recently viewed table created/verified');
};

// Create gamification table
const createGamificationTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS gamification (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL UNIQUE,
            points INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            badges TEXT DEFAULT '[]',
            achievements TEXT DEFAULT '[]',
            streak INTEGER DEFAULT 0,
            lastActivity TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    
    db.exec(sql);
    console.log('✅ Gamification table created/verified');
};

// Create fashion challenges table
const createFashionChallengesTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS fashion_challenges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            points INTEGER DEFAULT 100,
            startDate TEXT NOT NULL,
            endDate TEXT NOT NULL,
            participants TEXT DEFAULT '[]',
            winners TEXT DEFAULT '[]',
            status TEXT DEFAULT 'active',
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.exec(sql);
    console.log('✅ Fashion challenges table created/verified');
};

// Create challenge submissions table
const createChallengeSubmissionsTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS challenge_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            challengeId INTEGER NOT NULL,
            userId INTEGER NOT NULL,
            userName TEXT NOT NULL,
            imageUrl TEXT NOT NULL,
            description TEXT,
            votes INTEGER DEFAULT 0,
            submittedAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (challengeId) REFERENCES fashion_challenges(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    
    db.exec(sql);
    console.log('✅ Challenge submissions table created/verified');
};

// Create virtual fashion shows table
const createVirtualFashionShowsTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS virtual_fashion_shows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            hostName TEXT NOT NULL,
            scheduledDate TEXT NOT NULL,
            duration INTEGER DEFAULT 60,
            status TEXT DEFAULT 'upcoming',
            attendees TEXT DEFAULT '[]',
            looks TEXT DEFAULT '[]',
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.exec(sql);
    console.log('✅ Virtual fashion shows table created/verified');
};

// Create live chat table
const createLiveChatTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS live_chat (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            userName TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT DEFAULT 'user',
            timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    
    db.exec(sql);
    console.log('✅ Live chat table created/verified');
};

// Create addresses table
const createAddressesTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS addresses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            fullName TEXT NOT NULL,
            mobile TEXT NOT NULL,
            house TEXT NOT NULL,
            street TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            pincode TEXT NOT NULL,
            country TEXT NOT NULL,
            isDefault INTEGER DEFAULT 0,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    
    db.exec(sql);
    console.log('✅ Addresses table created/verified');
};

// Initialize database
const initDatabase = () => {
    try {
        createUsersTable();
        createWishlistTable();
        createCartTable();
        createReviewsTable();
        createRecentlyViewedTable();
        createGamificationTable();
        createFashionChallengesTable();
        createChallengeSubmissionsTable();
        createVirtualFashionShowsTable();
        createLiveChatTable();
        createAddressesTable();
        createSocialOutfitsTable();
        createSocialVotesTable();
        console.log('✅ SQLite Database initialized successfully');
        console.log('📁 Database location:', dbPath);
        return true;
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        return false;
    }
};

// User operations
const userOperations = {
    // Create user
    create: (userData) => {
        const stmt = db.prepare(`
            INSERT INTO users (firstName, lastName, email, password, mobile, role, isActive, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.password,
            userData.mobile || null,
            userData.role || 'user',
            userData.isActive !== undefined ? (userData.isActive ? 1 : 0) : 1,
            new Date().toISOString()
        );
        
        return result.lastInsertRowid;
    },
    
    // Find user by email
    findByEmail: (email) => {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        return stmt.get(email.toLowerCase());
    },
    
    // Find user by ID
    findById: (id) => {
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        return stmt.get(id);
    },
    
    // Update user
    update: (id, userData) => {
        const fields = [];
        const values = [];
        
        if (userData.firstName) {
            fields.push('firstName = ?');
            values.push(userData.firstName);
        }
        if (userData.lastName) {
            fields.push('lastName = ?');
            values.push(userData.lastName);
        }
        if (userData.email) {
            fields.push('email = ?');
            values.push(userData.email);
        }
        if (userData.password) {
            fields.push('password = ?');
            values.push(userData.password);
        }
        if (userData.mobile !== undefined) {
            fields.push('mobile = ?');
            values.push(userData.mobile);
        }
        if (userData.lastLogin) {
            fields.push('lastLogin = ?');
            values.push(userData.lastLogin);
        }
        
        if (fields.length === 0) return false;
        
        values.push(id);
        const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(...values);
        
        return result.changes > 0;
    },
    
    // Update last login
    updateLastLogin: (id) => {
        const stmt = db.prepare('UPDATE users SET lastLogin = ? WHERE id = ?');
        const result = stmt.run(new Date().toISOString(), id);
        return result.changes > 0;
    },
    
    // Get all users
    getAll: () => {
        const stmt = db.prepare('SELECT * FROM users ORDER BY createdAt DESC');
        return stmt.all();
    },
    
    // Delete user
    delete: (id) => {
        const stmt = db.prepare('DELETE FROM users WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    },
    
    // Count users
    count: () => {
        const stmt = db.prepare('SELECT COUNT(*) as count FROM users');
        return stmt.get().count;
    }
};

// Wishlist operations
const wishlistOperations = {
    // Add to wishlist
    add: (userId, item) => {
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO wishlist (userId, itemId, itemName, itemPrice, itemImage, itemCategory, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            userId,
            item.id,
            item.name,
            item.price,
            item.image,
            item.category || '',
            new Date().toISOString()
        );
        
        return result.changes > 0;
    },
    
    // Remove from wishlist
    remove: (userId, itemId) => {
        const stmt = db.prepare('DELETE FROM wishlist WHERE userId = ? AND itemId = ?');
        const result = stmt.run(userId, itemId);
        return result.changes > 0;
    },
    
    // Get user wishlist
    getByUser: (userId) => {
        const stmt = db.prepare('SELECT * FROM wishlist WHERE userId = ? ORDER BY createdAt DESC');
        return stmt.all(userId);
    },
    
    // Check if item in wishlist
    isInWishlist: (userId, itemId) => {
        const stmt = db.prepare('SELECT COUNT(*) as count FROM wishlist WHERE userId = ? AND itemId = ?');
        return stmt.get(userId, itemId).count > 0;
    },
    
    // Clear wishlist
    clear: (userId) => {
        const stmt = db.prepare('DELETE FROM wishlist WHERE userId = ?');
        const result = stmt.run(userId);
        return result.changes;
    }
};

// Cart operations
const cartOperations = {
    // Add to cart
    add: (userId, item) => {
        const stmt = db.prepare(`
            INSERT INTO cart (userId, itemId, itemName, itemPrice, itemImage, itemCategory, quantity, size, color, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            userId,
            item.id,
            item.name,
            item.price,
            item.image,
            item.category || '',
            item.quantity || 1,
            item.size || 'M',
            item.color || '',
            new Date().toISOString()
        );
        
        return result.lastInsertRowid;
    },
    
    // Update cart item
    update: (cartId, quantity) => {
        const stmt = db.prepare('UPDATE cart SET quantity = ? WHERE id = ?');
        const result = stmt.run(quantity, cartId);
        return result.changes > 0;
    },
    
    // Remove from cart
    remove: (cartId) => {
        const stmt = db.prepare('DELETE FROM cart WHERE id = ?');
        const result = stmt.run(cartId);
        return result.changes > 0;
    },
    
    // Get user cart
    getByUser: (userId) => {
        const stmt = db.prepare('SELECT * FROM cart WHERE userId = ? ORDER BY createdAt DESC');
        return stmt.all(userId);
    },
    
    // Clear cart
    clear: (userId) => {
        const stmt = db.prepare('DELETE FROM cart WHERE userId = ?');
        const result = stmt.run(userId);
        return result.changes;
    },
    
    // Get cart total
    getTotal: (userId) => {
        const stmt = db.prepare('SELECT SUM(itemPrice * quantity) as total FROM cart WHERE userId = ?');
        return stmt.get(userId).total || 0;
    }
};

// Reviews operations
const reviewsOperations = {
    // Add review
    add: (userId, userName, itemId, rating, comment) => {
        const stmt = db.prepare(`
            INSERT INTO reviews (userId, userName, itemId, rating, comment, createdAt)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            userId,
            userName,
            itemId,
            rating,
            comment || '',
            new Date().toISOString()
        );
        
        return result.lastInsertRowid;
    },
    
    // Get reviews for item
    getByItem: (itemId) => {
        const stmt = db.prepare('SELECT * FROM reviews WHERE itemId = ? ORDER BY createdAt DESC');
        return stmt.all(itemId);
    },
    
    // Get average rating
    getAverageRating: (itemId) => {
        const stmt = db.prepare('SELECT AVG(rating) as avgRating, COUNT(*) as count FROM reviews WHERE itemId = ?');
        return stmt.get(itemId);
    },
    
    // Delete review
    delete: (reviewId) => {
        const stmt = db.prepare('DELETE FROM reviews WHERE id = ?');
        const result = stmt.run(reviewId);
        return result.changes > 0;
    }
};

// Recently viewed operations
const recentlyViewedOperations = {
    // Add to recently viewed
    add: (userId, item) => {
        // First try to update viewedAt if exists
        const updateStmt = db.prepare('UPDATE recently_viewed SET viewedAt = ? WHERE userId = ? AND itemId = ?');
        const updated = updateStmt.run(new Date().toISOString(), userId, item.id);
        
        if (updated.changes === 0) {
            // If not exists, insert new
            const insertStmt = db.prepare(`
                INSERT INTO recently_viewed (userId, itemId, itemName, itemPrice, itemImage, itemCategory, viewedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            
            insertStmt.run(
                userId,
                item.id,
                item.name,
                item.price,
                item.image,
                item.category || '',
                new Date().toISOString()
            );
        }
        
        return true;
    },
    
    // Get recently viewed
    getByUser: (userId, limit = 10) => {
        const stmt = db.prepare('SELECT * FROM recently_viewed WHERE userId = ? ORDER BY viewedAt DESC LIMIT ?');
        return stmt.all(userId, limit);
    },
    
    // Clear recently viewed
    clear: (userId) => {
        const stmt = db.prepare('DELETE FROM recently_viewed WHERE userId = ?');
        const result = stmt.run(userId);
        return result.changes;
    }
};

// Gamification operations
const gamificationOperations = {
    // Initialize user gamification
    init: (userId) => {
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO gamification (userId, points, level, badges, achievements, streak, lastActivity)
            VALUES (?, 0, 1, '[]', '[]', 0, ?)
        `);
        stmt.run(userId, new Date().toISOString());
    },
    
    // Get user gamification data
    get: (userId) => {
        const stmt = db.prepare('SELECT * FROM gamification WHERE userId = ?');
        let data = stmt.get(userId);
        if (!data) {
            gamificationOperations.init(userId);
            data = stmt.get(userId);
        }
        // Parse JSON fields
        data.badges = JSON.parse(data.badges);
        data.achievements = JSON.parse(data.achievements);
        return data;
    },
    
    // Add points
    addPoints: (userId, points) => {
        const current = gamificationOperations.get(userId);
        const newPoints = current.points + points;
        const newLevel = Math.floor(newPoints / 1000) + 1;
        
        const stmt = db.prepare('UPDATE gamification SET points = ?, level = ?, lastActivity = ? WHERE userId = ?');
        stmt.run(newPoints, newLevel, new Date().toISOString(), userId);
        
        return { points: newPoints, level: newLevel };
    },
    
    // Add badge
    addBadge: (userId, badge) => {
        const current = gamificationOperations.get(userId);
        if (!current.badges.includes(badge)) {
            current.badges.push(badge);
            const stmt = db.prepare('UPDATE gamification SET badges = ? WHERE userId = ?');
            stmt.run(JSON.stringify(current.badges), userId);
        }
    },
    
    // Update streak
    updateStreak: (userId) => {
        const current = gamificationOperations.get(userId);
        const lastActivity = new Date(current.lastActivity);
        const now = new Date();
        const daysDiff = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));
        
        let newStreak = current.streak;
        if (daysDiff === 1) {
            newStreak += 1;
        } else if (daysDiff > 1) {
            newStreak = 1;
        }
        
        const stmt = db.prepare('UPDATE gamification SET streak = ?, lastActivity = ? WHERE userId = ?');
        stmt.run(newStreak, new Date().toISOString(), userId);
        
        return newStreak;
    },
    
    // Get leaderboard
    getLeaderboard: (limit = 10) => {
        const stmt = db.prepare(`
            SELECT g.*, u.firstName, u.lastName 
            FROM gamification g 
            JOIN users u ON g.userId = u.id 
            ORDER BY g.points DESC 
            LIMIT ?
        `);
        return stmt.all(limit);
    }
};

// Fashion challenges operations
const fashionChallengesOperations = {
    // Create challenge
    create: (challenge) => {
        const stmt = db.prepare(`
            INSERT INTO fashion_challenges (title, description, category, difficulty, points, startDate, endDate, status, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            challenge.title,
            challenge.description,
            challenge.category,
            challenge.difficulty,
            challenge.points || 100,
            challenge.startDate,
            challenge.endDate,
            'active',
            new Date().toISOString()
        );
        
        return result.lastInsertRowid;
    },
    
    // Get all challenges
    getAll: (status = null) => {
        let stmt;
        if (status) {
            stmt = db.prepare('SELECT * FROM fashion_challenges WHERE status = ? ORDER BY createdAt DESC');
            return stmt.all(status);
        } else {
            stmt = db.prepare('SELECT * FROM fashion_challenges ORDER BY createdAt DESC');
            return stmt.all();
        }
    },
    
    // Get challenge by ID
    getById: (id) => {
        const stmt = db.prepare('SELECT * FROM fashion_challenges WHERE id = ?');
        return stmt.get(id);
    },
    
    // Join challenge
    join: (challengeId, userId) => {
        const challenge = fashionChallengesOperations.getById(challengeId);
        if (challenge) {
            const participants = JSON.parse(challenge.participants || '[]');
            if (!participants.includes(userId)) {
                participants.push(userId);
                const stmt = db.prepare('UPDATE fashion_challenges SET participants = ? WHERE id = ?');
                stmt.run(JSON.stringify(participants), challengeId);
                return true;
            }
        }
        return false;
    },
    
    // Submit to challenge
    submit: (submission) => {
        const stmt = db.prepare(`
            INSERT INTO challenge_submissions (challengeId, userId, userName, imageUrl, description, submittedAt)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            submission.challengeId,
            submission.userId,
            submission.userName,
            submission.imageUrl,
            submission.description || '',
            new Date().toISOString()
        );
        
        return result.lastInsertRowid;
    },
    
    // Get submissions for challenge
    getSubmissions: (challengeId) => {
        const stmt = db.prepare('SELECT * FROM challenge_submissions WHERE challengeId = ? ORDER BY votes DESC, submittedAt DESC');
        return stmt.all(challengeId);
    },
    
    // Vote for submission
    vote: (submissionId) => {
        const stmt = db.prepare('UPDATE challenge_submissions SET votes = votes + 1 WHERE id = ?');
        const result = stmt.run(submissionId);
        return result.changes > 0;
    }
};

// Virtual fashion shows operations
const virtualFashionShowsOperations = {
    // Create show
    create: (show) => {
        const stmt = db.prepare(`
            INSERT INTO virtual_fashion_shows (title, description, hostName, scheduledDate, duration, status, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            show.title,
            show.description,
            show.hostName,
            show.scheduledDate,
            show.duration || 60,
            'upcoming',
            new Date().toISOString()
        );
        
        return result.lastInsertRowid;
    },
    
    // Get all shows
    getAll: (status = null) => {
        let stmt;
        if (status) {
            stmt = db.prepare('SELECT * FROM virtual_fashion_shows WHERE status = ? ORDER BY scheduledDate ASC');
            return stmt.all(status);
        } else {
            stmt = db.prepare('SELECT * FROM virtual_fashion_shows ORDER BY scheduledDate ASC');
            return stmt.all();
        }
    },
    
    // Get show by ID
    getById: (id) => {
        const stmt = db.prepare('SELECT * FROM virtual_fashion_shows WHERE id = ?');
        const show = stmt.get(id);
        if (show) {
            show.attendees = JSON.parse(show.attendees || '[]');
            show.looks = JSON.parse(show.looks || '[]');
        }
        return show;
    },
    
    // Register for show
    register: (showId, userId) => {
        const show = virtualFashionShowsOperations.getById(showId);
        if (show) {
            if (!show.attendees.includes(userId)) {
                show.attendees.push(userId);
                const stmt = db.prepare('UPDATE virtual_fashion_shows SET attendees = ? WHERE id = ?');
                stmt.run(JSON.stringify(show.attendees), showId);
                return true;
            }
        }
        return false;
    },
    
    // Update show status
    updateStatus: (showId, status) => {
        const stmt = db.prepare('UPDATE virtual_fashion_shows SET status = ? WHERE id = ?');
        const result = stmt.run(status, showId);
        return result.changes > 0;
    }
};

// Live chat operations
const liveChatOperations = {
    // Send message
    send: (userId, userName, message, type = 'user') => {
        const stmt = db.prepare(`
            INSERT INTO live_chat (userId, userName, message, type, timestamp)
            VALUES (?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            userId,
            userName,
            message,
            type,
            new Date().toISOString()
        );
        
        return result.lastInsertRowid;
    },
    
    // Get recent messages
    getRecent: (limit = 50) => {
        const stmt = db.prepare('SELECT * FROM live_chat ORDER BY timestamp DESC LIMIT ?');
        return stmt.all(limit).reverse();
    },
    
    // Get messages after timestamp
    getAfter: (timestamp) => {
        const stmt = db.prepare('SELECT * FROM live_chat WHERE timestamp > ? ORDER BY timestamp ASC');
        return stmt.all(timestamp);
    },
    
    // Update message
    update: (id, userId, message) => {
        const stmt = db.prepare('UPDATE live_chat SET message = ? WHERE id = ? AND userId = ?');
        const result = stmt.run(message, id, userId);
        return result.changes > 0;
    },
    
    // Clear old messages (keep last 1000)
    cleanup: () => {
        const stmt = db.prepare(`
            DELETE FROM live_chat 
            WHERE id NOT IN (
                SELECT id FROM live_chat 
                ORDER BY timestamp DESC 
                LIMIT 1000
            )
        `);
        const result = stmt.run();
        return result.changes;
    }
};

// Create social outfits table
const createSocialOutfitsTable = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS social_outfits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            userName TEXT NOT NULL,
            imageUrl TEXT NOT NULL,
            description TEXT DEFAULT '',
            votes INTEGER DEFAULT 0,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('✅ Social outfits table created/verified');
};

// Create social votes table (tracks who voted to prevent duplicates)
const createSocialVotesTable = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS social_votes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            outfitId INTEGER NOT NULL,
            userId INTEGER NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (outfitId) REFERENCES social_outfits(id) ON DELETE CASCADE,
            UNIQUE(outfitId, userId)
        )
    `);
    console.log('✅ Social votes table created/verified');
};

// Social outfits operations
const socialOutfitsOperations = {
    // Share an outfit
    share: (userId, userName, imageUrl, description) => {
        const stmt = db.prepare(`
            INSERT INTO social_outfits (userId, userName, imageUrl, description, votes, createdAt)
            VALUES (?, ?, ?, ?, 0, ?)
        `);
        const result = stmt.run(userId, userName, imageUrl, description || '', new Date().toISOString());
        return result.lastInsertRowid;
    },

    // Get all shared outfits (with vote status for a specific user)
    getAll: (currentUserId = null) => {
        const outfits = db.prepare('SELECT * FROM social_outfits ORDER BY createdAt DESC').all();
        return outfits.map(outfit => {
            let voted = false;
            if (currentUserId) {
                const vote = db.prepare('SELECT COUNT(*) as count FROM social_votes WHERE outfitId = ? AND userId = ?').get(outfit.id, currentUserId);
                voted = vote.count > 0;
            }
            return { ...outfit, voted, comments: [] };
        });
    },

    // Get outfit by ID
    getById: (id) => {
        return db.prepare('SELECT * FROM social_outfits WHERE id = ?').get(id);
    },

    // Vote for an outfit (toggle)
    vote: (outfitId, userId) => {
        const existing = db.prepare('SELECT * FROM social_votes WHERE outfitId = ? AND userId = ?').get(outfitId, userId);
        if (existing) {
            // Already voted — unvote
            db.prepare('DELETE FROM social_votes WHERE outfitId = ? AND userId = ?').run(outfitId, userId);
            db.prepare('UPDATE social_outfits SET votes = votes - 1 WHERE id = ? AND votes > 0').run(outfitId);
            return { action: 'unvoted' };
        } else {
            // Not voted — vote
            db.prepare('INSERT INTO social_votes (outfitId, userId, createdAt) VALUES (?, ?, ?)').run(outfitId, userId, new Date().toISOString());
            db.prepare('UPDATE social_outfits SET votes = votes + 1 WHERE id = ?').run(outfitId);
            return { action: 'voted' };
        }
    },

    // Delete an outfit (owner only)
    delete: (outfitId, userId) => {
        const result = db.prepare('DELETE FROM social_outfits WHERE id = ? AND userId = ?').run(outfitId, userId);
        return result.changes > 0;
    },

    // Count outfits
    count: () => {
        return db.prepare('SELECT COUNT(*) as count FROM social_outfits').get().count;
    },

    // Seed sample outfits if table is empty
    seed: () => {
        const count = socialOutfitsOperations.count();
        if (count === 0) {
            const samples = [
                { userName: 'Priya', imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', description: 'Loving this casual summer look! ☀️👗' },
                { userName: 'Rahul', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', description: 'Smart casual for the office 💼' },
                { userName: 'Anita', imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400', description: 'Ready for the weekend party! 🎉✨' }
            ];
            samples.forEach(s => {
                socialOutfitsOperations.share(0, s.userName, s.imageUrl, s.description);
            });
            console.log('✅ Seeded 3 sample social outfits');
        }
    }
};

// Addresses operations
const addressesOperations = {
    // Add address
    add: (userId, address) => {
        // If this is set as default, unset all other defaults for this user
        if (address.isDefault) {
            const unsetStmt = db.prepare('UPDATE addresses SET isDefault = 0 WHERE userId = ?');
            unsetStmt.run(userId);
        }
        
        const stmt = db.prepare(`
            INSERT INTO addresses (userId, fullName, mobile, house, street, city, state, pincode, country, isDefault, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            userId,
            address.fullName,
            address.mobile,
            address.house,
            address.street,
            address.city,
            address.state,
            address.pincode,
            address.country,
            address.isDefault ? 1 : 0,
            new Date().toISOString()
        );
        
        return result.lastInsertRowid;
    },
    
    // Get all addresses for user
    getByUser: (userId) => {
        const stmt = db.prepare('SELECT * FROM addresses WHERE userId = ? ORDER BY isDefault DESC, createdAt DESC');
        return stmt.all(userId);
    },
    
    // Get address by ID
    getById: (addressId) => {
        const stmt = db.prepare('SELECT * FROM addresses WHERE id = ?');
        return stmt.get(addressId);
    },
    
    // Update address
    update: (addressId, userId, address) => {
        // If this is set as default, unset all other defaults for this user
        if (address.isDefault) {
            const unsetStmt = db.prepare('UPDATE addresses SET isDefault = 0 WHERE userId = ?');
            unsetStmt.run(userId);
        }
        
        const stmt = db.prepare(`
            UPDATE addresses 
            SET fullName = ?, mobile = ?, house = ?, street = ?, city = ?, state = ?, pincode = ?, country = ?, isDefault = ?
            WHERE id = ? AND userId = ?
        `);
        
        const result = stmt.run(
            address.fullName,
            address.mobile,
            address.house,
            address.street,
            address.city,
            address.state,
            address.pincode,
            address.country,
            address.isDefault ? 1 : 0,
            addressId,
            userId
        );
        
        return result.changes > 0;
    },
    
    // Delete address
    delete: (addressId, userId) => {
        const stmt = db.prepare('DELETE FROM addresses WHERE id = ? AND userId = ?');
        const result = stmt.run(addressId, userId);
        return result.changes > 0;
    },
    
    // Set default address
    setDefault: (addressId, userId) => {
        // First unset all defaults for this user
        const unsetStmt = db.prepare('UPDATE addresses SET isDefault = 0 WHERE userId = ?');
        unsetStmt.run(userId);
        
        // Then set the specified address as default
        const setStmt = db.prepare('UPDATE addresses SET isDefault = 1 WHERE id = ? AND userId = ?');
        const result = setStmt.run(addressId, userId);
        return result.changes > 0;
    },
    
    // Get default address
    getDefault: (userId) => {
        const stmt = db.prepare('SELECT * FROM addresses WHERE userId = ? AND isDefault = 1');
        return stmt.get(userId);
    }
};

module.exports = {
    db,
    initDatabase,
    userOperations,
    wishlistOperations,
    cartOperations,
    reviewsOperations,
    recentlyViewedOperations,
    gamificationOperations,
    fashionChallengesOperations,
    virtualFashionShowsOperations,
    liveChatOperations,
    addressesOperations,
    socialOutfitsOperations
};
