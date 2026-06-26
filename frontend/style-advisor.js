// AI Style Advisor Feature
if (!window.API_URL) window.API_URL = 'http://localhost:5002/api';


class StyleAdvisor {
    constructor() {
        this.userProfile = null;
        this.recommendations = [];
    }
    
    // Initialize style advisor
    init() {
        this.loadUserProfile();
    }
    
    // Load user style profile
    async loadUserProfile() {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        
        try {
            const response = await fetch(`${API_URL}/style-profile/${userId}`);
            const data = await response.json();
            if (data.success) {
                this.userProfile = data.data;
            }
        } catch (error) {
            console.error('Error loading style profile:', error);
        }
    }
    
    // Show style questionnaire
    showQuestionnaire() {
        const modal = document.createElement('div');
        modal.className = 'style-modal';
        modal.innerHTML = `
            <div class="style-modal-content">
                <div class="style-modal-header">
                    <h2>🤖 AI Style Advisor</h2>
                    <span class="close-modal" onclick="styleAdvisor.closeQuestionnaire()">&times;</span>
                </div>
                <div class="style-modal-body">
                    <form id="styleForm">
                        <div class="form-group">
                            <label>Body Type:</label>
                            <select name="bodyType" required>
                                <option value="">Select...</option>
                                <option value="slim">Slim</option>
                                <option value="athletic">Athletic</option>
                                <option value="average">Average</option>
                                <option value="plus">Plus Size</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Skin Tone:</label>
                            <select name="skinTone" required>
                                <option value="">Select...</option>
                                <option value="fair">Fair</option>
                                <option value="medium">Medium</option>
                                <option value="olive">Olive</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Preferred Style:</label>
                            <select name="preferredStyle" required>
                                <option value="">Select...</option>
                                <option value="casual">Casual</option>
                                <option value="formal">Formal</option>
                                <option value="sporty">Sporty</option>
                                <option value="trendy">Trendy</option>
                                <option value="traditional">Traditional</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Favorite Colors:</label>
                            <div class="color-options">
                                <label><input type="checkbox" name="colors" value="black"> Black</label>
                                <label><input type="checkbox" name="colors" value="white"> White</label>
                                <label><input type="checkbox" name="colors" value="blue"> Blue</label>
                                <label><input type="checkbox" name="colors" value="red"> Red</label>
                                <label><input type="checkbox" name="colors" value="green"> Green</label>
                                <label><input type="checkbox" name="colors" value="yellow"> Yellow</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Budget Range:</label>
                            <select name="budget" required>
                                <option value="">Select...</option>
                                <option value="low">Under ₹1000</option>
                                <option value="medium">₹1000 - ₹3000</option>
                                <option value="high">₹3000 - ₹5000</option>
                                <option value="premium">Above ₹5000</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">Get Recommendations</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('styleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile(e.target);
        });
    }
    
    // Save style profile
    async saveProfile(form) {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please login first');
            return;
        }
        
        const formData = new FormData(form);
        const colors = [];
        formData.getAll('colors').forEach(color => colors.push(color));
        
        const profile = {
            userId: userId,
            bodyType: formData.get('bodyType'),
            skinTone: formData.get('skinTone'),
            preferredStyle: formData.get('preferredStyle'),
            favoriteColors: colors,
            budget: formData.get('budget')
        };
        
        try {
            const response = await fetch(`${API_URL}/style-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });
            
            const data = await response.json();
            if (data.success) {
                this.userProfile = profile;
                this.closeQuestionnaire();
                this.showRecommendations();
            }
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    }
    
    // Close questionnaire
    closeQuestionnaire() {
        const modal = document.querySelector('.style-modal');
        if (modal) modal.remove();
    }
    
    // Show AI recommendations
    async showRecommendations() {
        if (!this.userProfile) {
            this.showQuestionnaire();
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'style-modal';
        modal.innerHTML = `
            <div class="style-modal-content">
                <div class="style-modal-header">
                    <h2>✨ Your Personalized Recommendations</h2>
                    <span class="close-modal" onclick="styleAdvisor.closeQuestionnaire()">&times;</span>
                </div>
                <div class="style-modal-body" id="recommendations-body">
                    <div style="text-align: center; padding: 40px;">
                        <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #10b981; margin-bottom: 15px;"></i>
                        <p>Our AI is analyzing your profile to find the perfect styles...</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        try {
            const response = await fetch(`${API_URL}/ai-style-advice`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.userProfile)
            });

            const data = await response.json();
            
            const bodyContainer = document.getElementById('recommendations-body');
            if (data.success && data.data && data.data.length > 0) {
                const recommendations = data.data;
                bodyContainer.innerHTML = `
                    <div class="recommendations-grid">
                        ${recommendations.map(rec => `
                            <div class="recommendation-card">
                                <div class="rec-badge">${rec.badge}</div>
                                <h3>${rec.title}</h3>
                                <p>${rec.description}</p>
                                <div class="rec-tags">
                                    ${rec.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                bodyContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #dc3545;">
                        <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 15px;"></i>
                        <p>Failed to generate recommendations. Please try again later.</p>
                        ${data.message ? `<p style="font-size: 0.9rem; opacity: 0.8;">${data.message}</p>` : ''}
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            const bodyContainer = document.getElementById('recommendations-body');
            bodyContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #dc3545;">
                    <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 15px;"></i>
                    <p>Failed to connect to the AI service. Please check your connection.</p>
                </div>
            `;
        }
    }
}

const styleAdvisor = new StyleAdvisor();

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        styleAdvisor.init();
        window.styleAdvisor = styleAdvisor;
        console.log('Style Advisor initialized on DOMContentLoaded');
    });
} else {
    // DOM already loaded
    styleAdvisor.init();
    window.styleAdvisor = styleAdvisor;
    console.log('Style Advisor initialized immediately');
}

// Also set on window load as backup
window.addEventListener('load', () => {
    if (!window.styleAdvisor) {
        window.styleAdvisor = styleAdvisor;
        console.log('Style Advisor set on window load');
    }
});

console.log('Style Advisor script loaded');
