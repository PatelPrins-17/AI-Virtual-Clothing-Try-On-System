// Social Sharing with Voting Feature
if (!window.API_URL) window.API_URL = 'http://localhost:5002/api';

class SocialSharing {
    constructor() {
        this.sharedOutfits = [];
    }
    
    // Initialize social sharing
    init() {
        this.loadSharedOutfits();
    }
    
    // Share outfit
    async shareOutfit(imageUrl, description) {
        const userId = localStorage.getItem('userId');
        let userName = localStorage.getItem('userName');
        if (!userName) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && user.firstName) {
                    userName = `${user.firstName} ${user.lastName || ''}`.trim();
                    localStorage.setItem('userName', userName);
                }
            } catch(e) {}
        }
        userName = userName || 'Anonymous';
        
        if (!userId) {
            alert('Please login to share outfits');
            return;
        }
        
        const outfit = {
            userId: userId,
            userName: userName,
            imageUrl: imageUrl,
            description: description || 'Check out my new look!',
        };
        
        try {
            const response = await fetch(`${API_URL}/social/share`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(outfit)
            });
            
            const data = await response.json();
            if (data.success) {
                alert('Outfit shared successfully! 🎉');
                await this.loadSharedOutfits();
                // Refresh the feed if community modal is open
                const feedEl = document.getElementById('outfitsFeed');
                if (feedEl) {
                    feedEl.innerHTML = this.renderOutfitsFeed();
                }
            }
        } catch (error) {
            console.error('Error sharing outfit:', error);
            alert('Failed to share outfit. Please try again.');
        }
    }
    
    // Show share dialog
    showShareDialog(imageUrl) {
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content">
                <div class="share-header">
                    <h2>📱 Share Your Look</h2>
                    <span class="close-modal" onclick="socialSharing.closeShareDialog()">&times;</span>
                </div>
                <div class="share-body">
                    <div class="share-preview">
                        <img src="${imageUrl}" alt="Outfit">
                    </div>
                    <form id="shareForm">
                        <div class="form-group">
                            <label>Description:</label>
                            <textarea name="description" placeholder="Tell us about your outfit..." rows="3"></textarea>
                        </div>
                        
                        <div class="share-options">
                            <h4>Share to:</h4>
                            <div class="social-buttons">
                                <button type="button" class="social-btn whatsapp" onclick="socialSharing.shareToWhatsApp('${imageUrl}')">
                                    <i class="fab fa-whatsapp"></i> WhatsApp
                                </button>
                                <button type="button" class="social-btn facebook" onclick="socialSharing.shareToFacebook('${imageUrl}')">
                                    <i class="fab fa-facebook"></i> Facebook
                                </button>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">Share to Community</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('shareForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const description = e.target.description.value;
            this.shareOutfit(imageUrl, description);
            this.closeShareDialog();
        });
    }
    
    // Share to WhatsApp
    shareToWhatsApp(imageUrl) {
        const text = encodeURIComponent('Check out my virtual try-on! 👗✨');
        const url = `https://wa.me/?text=${text}`;
        window.open(url, '_blank');
    }
    
    // Share to Facebook
    shareToFacebook(imageUrl) {
        const url = encodeURIComponent(window.location.href);
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        window.open(fbUrl, '_blank', 'width=600,height=400');
    }
    
    // Close share dialog
    closeShareDialog() {
        const modal = document.querySelector('.share-modal');
        if (modal) modal.remove();
    }
    
    // Load shared outfits from community
    async loadSharedOutfits() {
        try {
            const userId = localStorage.getItem('userId') || '';
            const response = await fetch(`${API_URL}/social/outfits?userId=${userId}`);
            const data = await response.json();
            if (data.success) {
                this.sharedOutfits = data.data;
            }
        } catch (error) {
            console.error('Error loading shared outfits:', error);
        }
    }
    
    // Show community feed
    async showCommunityFeed() {
        // Reload latest outfits before showing
        await this.loadSharedOutfits();
        
        // Remove existing community modal if any
        const existing = document.querySelector('.community-modal');
        if (existing) existing.remove();
        
        const modal = document.createElement('div');
        modal.className = 'community-modal';
        modal.innerHTML = `
            <div class="community-modal-content">
                <div class="community-header">
                    <h2>👥 Community Outfits</h2>
                    <span class="close-modal" onclick="socialSharing.closeCommunityFeed()">&times;</span>
                </div>
                <div class="community-body">
                    <div class="community-actions-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #f0fdff, #e0f7fa); border-radius: 12px;">
                        <div>
                            <h3 style="margin: 0; color: #06b6d4;">🌟 ${this.sharedOutfits.length} Outfit${this.sharedOutfits.length !== 1 ? 's' : ''} Shared</h3>
                            <p style="margin: 5px 0 0; color: #666; font-size: 0.9rem;">Share your look and get votes from the community!</p>
                        </div>
                        <button class="btn btn-primary" onclick="socialSharing.promptShareOutfit()" style="white-space: nowrap;">
                            <i class="fas fa-plus"></i> Share Your Look
                        </button>
                    </div>
                    <div class="outfits-feed" id="outfitsFeed">
                        ${this.renderOutfitsFeed()}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Prompt user to share outfit (from community modal)
    promptShareOutfit() {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please login to share outfits');
            return;
        }
        
        // Create a mini share dialog with image URL input
        const dialog = document.createElement('div');
        dialog.className = 'share-modal';
        dialog.style.zIndex = '3000';
        dialog.innerHTML = `
            <div class="share-modal-content" style="max-width: 500px;">
                <div class="share-header">
                    <h2>📸 Share Your Look</h2>
                    <span class="close-modal" onclick="this.closest('.share-modal').remove()">&times;</span>
                </div>
                <div class="share-body">
                    <form id="quickShareForm">
                        <div class="form-group">
                            <label>Image URL:</label>
                            <input type="url" name="imageUrl" placeholder="Paste image URL here..." required 
                                style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem;">
                        </div>
                        <div class="form-group">
                            <label>Or upload an image:</label>
                            <input type="file" id="outfitImageUpload" accept="image/*"
                                style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem;">
                        </div>
                        <div class="form-group">
                            <label>Description:</label>
                            <textarea name="description" placeholder="Tell us about your outfit..." rows="3"
                                style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem;"></textarea>
                        </div>
                        <div id="sharePreviewContainer" style="display: none; text-align: center; margin-bottom: 15px;">
                            <img id="sharePreviewImg" style="max-width: 100%; max-height: 200px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 1.1rem;">
                            <i class="fas fa-share"></i> Share to Community
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Handle file upload preview
        const fileInput = dialog.querySelector('#outfitImageUpload');
        const urlInput = dialog.querySelector('input[name="imageUrl"]');
        const previewContainer = dialog.querySelector('#sharePreviewContainer');
        const previewImg = dialog.querySelector('#sharePreviewImg');
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    previewImg.src = ev.target.result;
                    previewContainer.style.display = 'block';
                    urlInput.value = ev.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        
        urlInput.addEventListener('input', () => {
            if (urlInput.value) {
                previewImg.src = urlInput.value;
                previewContainer.style.display = 'block';
            }
        });
        
        // Handle form submission
        dialog.querySelector('#quickShareForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const imageUrl = e.target.imageUrl.value;
            const description = e.target.description.value;
            
            if (!imageUrl) {
                alert('Please provide an image URL or upload an image');
                return;
            }
            
            dialog.remove();
            await this.shareOutfit(imageUrl, description);
        });
    }
    
    // Render outfits feed
    renderOutfitsFeed() {
        if (this.sharedOutfits.length === 0) {
            return `
                <div style="text-align: center; padding: 60px 20px;">
                    <i class="fas fa-users" style="font-size: 4rem; color: #ccc; margin-bottom: 15px;"></i>
                    <p style="color: #999; font-size: 1.2rem; margin-bottom: 20px;">No outfits shared yet. Be the first!</p>
                    <button class="btn btn-primary" onclick="socialSharing.promptShareOutfit()" style="padding: 12px 30px;">
                        <i class="fas fa-plus"></i> Share Your First Look
                    </button>
                </div>
            `;
        }
        
        const currentUserId = localStorage.getItem('userId');
        return this.sharedOutfits.map(outfit => {
            const isOwner = currentUserId && String(outfit.userId) === String(currentUserId);
            return `
            <div class="outfit-card" id="outfit-${outfit.id}" style="transition: all 0.3s ease;">
                <div class="outfit-header">
                    <div class="user-info">
                        <div class="user-avatar">${(outfit.userName || 'A')[0].toUpperCase()}</div>
                        <span class="user-name">${outfit.userName || 'Anonymous'}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="outfit-time">${this.getTimeAgo(outfit.createdAt)}</span>
                        ${isOwner ? `
                        <button class="delete-outfit-btn" onclick="socialSharing.deleteOutfit(${outfit.id})" title="Delete this outfit"
                            style="background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 1.1rem; padding: 4px 8px; border-radius: 8px; transition: all 0.2s ease;"
                            onmouseover="this.style.background='#fde8e8'; this.style.transform='scale(1.15)';"
                            onmouseout="this.style.background='none'; this.style.transform='scale(1)';">
                            <i class="fas fa-trash-alt"></i>
                        </button>` : ''}
                    </div>
                </div>
                <div class="outfit-image">
                    <img src="${outfit.imageUrl}" alt="Outfit" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
                </div>
                <div class="outfit-description">
                    <p>${outfit.description || ''}</p>
                </div>
                <div class="outfit-actions">
                    <button class="vote-btn ${outfit.voted ? 'voted' : ''}" onclick="socialSharing.voteOutfit(${outfit.id})" id="vote-btn-${outfit.id}">
                        <i class="fas fa-heart"></i>
                        <span id="vote-count-${outfit.id}">${outfit.votes || 0}</span>
                    </button>
                    <button class="comment-btn" onclick="socialSharing.showComments(${outfit.id})">
                        <i class="fas fa-comment"></i>
                        <span>${(outfit.comments || []).length}</span>
                    </button>
                    <button class="share-btn" onclick="socialSharing.shareOutfitLink(${outfit.id})">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            </div>
        `;
        }).join('');
    }
    
    // Vote for outfit
    async voteOutfit(outfitId) {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please login to vote');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/social/vote/${outfitId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: parseInt(userId) })
            });
            
            const data = await response.json();
            if (data.success) {
                // Update the vote button and count in-place (no modal re-render)
                const voteBtn = document.getElementById(`vote-btn-${outfitId}`);
                const voteCount = document.getElementById(`vote-count-${outfitId}`);
                
                if (voteBtn && voteCount) {
                    voteCount.textContent = data.votes;
                    if (data.action === 'voted') {
                        voteBtn.classList.add('voted');
                    } else {
                        voteBtn.classList.remove('voted');
                    }
                }
                
                // Also update local data
                const outfit = this.sharedOutfits.find(o => o.id === outfitId);
                if (outfit) {
                    outfit.votes = data.votes;
                    outfit.voted = data.action === 'voted';
                }
            }
        } catch (error) {
            console.error('Error voting:', error);
        }
    }
    
    // Delete outfit (owner only)
    async deleteOutfit(outfitId) {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please login to delete outfits');
            return;
        }
        
        // Confirmation dialog
        if (!confirm('Are you sure you want to delete this outfit? This action cannot be undone.')) {
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/social/outfits/${outfitId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: parseInt(userId) })
            });
            
            const data = await response.json();
            if (data.success) {
                // Animate the card removal
                const card = document.getElementById(`outfit-${outfitId}`);
                if (card) {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    card.style.maxHeight = card.scrollHeight + 'px';
                    setTimeout(() => {
                        card.style.maxHeight = '0';
                        card.style.padding = '0';
                        card.style.margin = '0';
                        card.style.overflow = 'hidden';
                    }, 150);
                    setTimeout(() => card.remove(), 400);
                }
                
                // Update local data
                this.sharedOutfits = this.sharedOutfits.filter(o => o.id !== outfitId);
                
                // Update the outfit count in the header
                const countHeader = document.querySelector('.community-actions-bar h3');
                if (countHeader) {
                    countHeader.innerHTML = `🌟 ${this.sharedOutfits.length} Outfit${this.sharedOutfits.length !== 1 ? 's' : ''} Shared`;
                }
                
                // If no outfits left, re-render the empty state
                if (this.sharedOutfits.length === 0) {
                    const feedEl = document.getElementById('outfitsFeed');
                    if (feedEl) {
                        feedEl.innerHTML = this.renderOutfitsFeed();
                    }
                }
            } else {
                alert(data.message || 'Failed to delete outfit. You can only delete your own outfits.');
            }
        } catch (error) {
            console.error('Error deleting outfit:', error);
            alert('Failed to delete outfit. Please try again.');
        }
    }
    
    // Show comments
    showComments(outfitId) {
        const outfit = this.sharedOutfits.find(o => o.id === outfitId);
        if (!outfit) return;
        
        alert('Comments feature coming soon!');
    }
    
    // Share outfit link
    shareOutfitLink(outfitId) {
        const link = `${window.location.origin}?outfit=${outfitId}`;
        navigator.clipboard.writeText(link).then(() => {
            alert('Link copied to clipboard!');
        });
    }
    
    // Get time ago
    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = Math.floor((now - time) / 1000);
        
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    }
    
    // Close community feed
    closeCommunityFeed() {
        const modal = document.querySelector('.community-modal');
        if (modal) modal.remove();
    }
}

const socialSharing = new SocialSharing();

// Initialize immediately
socialSharing.init();

// Expose globally
window.socialSharing = socialSharing;

// Also initialize on DOM ready as backup
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.socialSharing) {
            window.socialSharing = socialSharing;
        }
    });
}

console.log('Social Sharing loaded:', socialSharing);
