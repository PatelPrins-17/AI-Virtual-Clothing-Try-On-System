// Virtual Wardrobe Mixer Feature
if (!window.API_URL) window.API_URL = 'http://localhost:5002/api';

class WardrobeMixer {
    constructor() {
        this.uploadedItems = [];
        this.currentOutfit = {
            top: null,
            bottom: null,
            shoes: null
        };
        this.savedCombinations = [];
    }
    
    // Initialize wardrobe mixer
    init() {
        this.loadSavedCombinations();
    }
    
    // Show wardrobe mixer interface
    showMixer() {
        const modal = document.createElement('div');
        modal.className = 'mixer-modal';
        modal.innerHTML = `
            <div class="mixer-modal-content">
                <div class="mixer-header">
                    <h2>🎨 Virtual Wardrobe Mixer</h2>
                    <span class="close-modal" onclick="wardrobeMixer.closeMixer()">&times;</span>
                </div>
                <div class="mixer-body">
                    <div class="mixer-container">
                        <!-- Upload Section -->
                        <div class="mixer-upload-section">
                            <h3>Upload Your Clothes</h3>
                            <div class="upload-categories">
                                <div class="upload-category">
                                    <label for="topUpload">
                                        <i class="fas fa-tshirt"></i>
                                        <span>Tops</span>
                                        <input type="file" id="topUpload" accept="image/*" onchange="wardrobeMixer.uploadItem('top', this)">
                                    </label>
                                </div>
                                <div class="upload-category">
                                    <label for="bottomUpload">
                                        <i class="fas fa-socks"></i>
                                        <span>Bottoms</span>
                                        <input type="file" id="bottomUpload" accept="image/*" onchange="wardrobeMixer.uploadItem('bottom', this)">
                                    </label>
                                </div>
                                <div class="upload-category">
                                    <label for="shoesUpload">
                                        <i class="fas fa-shoe-prints"></i>
                                        <span>Shoes</span>
                                        <input type="file" id="shoesUpload" accept="image/*" onchange="wardrobeMixer.uploadItem('shoes', this)">
                                    </label>
                                </div>
                            </div>
                            
                            <!-- Uploaded Items Gallery -->
                            <div class="uploaded-items">
                                <div class="items-category">
                                    <h4>Tops</h4>
                                    <div id="topsGallery" class="items-gallery"></div>
                                </div>
                                <div class="items-category">
                                    <h4>Bottoms</h4>
                                    <div id="bottomsGallery" class="items-gallery"></div>
                                </div>
                                <div class="items-category">
                                    <h4>Shoes</h4>
                                    <div id="shoesGallery" class="items-gallery"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Mix & Match Section -->
                        <div class="mixer-preview-section">
                            <h3>Create Your Outfit</h3>
                            <div class="outfit-preview">
                                <div class="outfit-slot" data-type="top">
                                    <i class="fas fa-tshirt"></i>
                                    <p>Select Top</p>
                                </div>
                                <div class="outfit-slot" data-type="bottom">
                                    <i class="fas fa-socks"></i>
                                    <p>Select Bottom</p>
                                </div>
                                <div class="outfit-slot" data-type="shoes">
                                    <i class="fas fa-shoe-prints"></i>
                                    <p>Select Shoes</p>
                                </div>
                            </div>
                            
                            <div class="mixer-actions">
                                <button class="btn btn-primary" onclick="wardrobeMixer.saveOutfit()">
                                    <i class="fas fa-save"></i> Save Combination
                                </button>
                                <button class="btn btn-outline" onclick="wardrobeMixer.clearOutfit()">
                                    <i class="fas fa-redo"></i> Clear
                                </button>
                                <button class="btn btn-accent" onclick="wardrobeMixer.shareOutfit()">
                                    <i class="fas fa-share"></i> Share
                                </button>
                            </div>
                        </div>
                        
                        <!-- Saved Combinations -->
                        <div class="saved-combinations">
                            <h3>Saved Combinations</h3>
                            <div id="savedCombinationsGrid" class="combinations-grid"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.displayUploadedItems();
        this.displaySavedCombinations();
    }
    
    // Upload item
    uploadItem(category, input) {
        const file = input.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const item = {
                id: Date.now(),
                category: category,
                image: e.target.result,
                name: file.name
            };
            
            this.uploadedItems.push(item);
            this.displayUploadedItems();
        };
        reader.readAsDataURL(file);
    }
    
    // Display uploaded items
    displayUploadedItems() {
        const tops = this.uploadedItems.filter(item => item.category === 'top');
        const bottoms = this.uploadedItems.filter(item => item.category === 'bottom');
        const shoes = this.uploadedItems.filter(item => item.category === 'shoes');
        
        this.renderItemsGallery('topsGallery', tops);
        this.renderItemsGallery('bottomsGallery', bottoms);
        this.renderItemsGallery('shoesGallery', shoes);
    }
    
    // Render items gallery
    renderItemsGallery(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = items.map(item => `
            <div class="gallery-item" onclick="wardrobeMixer.selectItem('${item.category}', ${item.id})">
                <img src="${item.image}" alt="${item.name}">
                <button class="delete-item" onclick="event.stopPropagation(); wardrobeMixer.deleteItem(${item.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }
    
    // Select item for outfit
    selectItem(category, itemId) {
        const item = this.uploadedItems.find(i => i.id === itemId);
        if (!item) return;
        
        this.currentOutfit[category] = item;
        this.updateOutfitPreview();
    }
    
    // Update outfit preview
    updateOutfitPreview() {
        const slots = document.querySelectorAll('.outfit-slot');
        slots.forEach(slot => {
            const type = slot.dataset.type;
            const item = this.currentOutfit[type];
            
            if (item) {
                slot.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
                slot.classList.add('filled');
            }
        });
    }
    
    // Save outfit combination
    async saveOutfit() {
        if (!this.currentOutfit.top && !this.currentOutfit.bottom) {
            alert('Please select at least top and bottom');
            return;
        }
        
        const combination = {
            id: Date.now(),
            top: this.currentOutfit.top,
            bottom: this.currentOutfit.bottom,
            shoes: this.currentOutfit.shoes,
            createdAt: new Date().toISOString()
        };
        
        this.savedCombinations.push(combination);
        localStorage.setItem('savedCombinations', JSON.stringify(this.savedCombinations));
        
        alert('Outfit saved successfully!');
        this.displaySavedCombinations();
    }
    
    // Clear current outfit
    clearOutfit() {
        this.currentOutfit = { top: null, bottom: null, shoes: null };
        document.querySelectorAll('.outfit-slot').forEach(slot => {
            const type = slot.dataset.type;
            slot.innerHTML = `
                <i class="fas fa-${type === 'top' ? 'tshirt' : type === 'bottom' ? 'socks' : 'shoe-prints'}"></i>
                <p>Select ${type}</p>
            `;
            slot.classList.remove('filled');
        });
    }
    
    // Share outfit
    shareOutfit() {
        if (!this.currentOutfit.top && !this.currentOutfit.bottom) {
            alert('Please create an outfit first');
            return;
        }
        
        alert('Share feature coming soon! You can share your outfit on social media.');
    }
    
    // Delete item
    deleteItem(itemId) {
        this.uploadedItems = this.uploadedItems.filter(item => item.id !== itemId);
        this.displayUploadedItems();
    }
    
    // Load saved combinations
    loadSavedCombinations() {
        const saved = localStorage.getItem('savedCombinations');
        if (saved) {
            this.savedCombinations = JSON.parse(saved);
        }
    }
    
    // Display saved combinations
    displaySavedCombinations() {
        const container = document.getElementById('savedCombinationsGrid');
        if (!container) return;
        
        container.innerHTML = this.savedCombinations.map(combo => `
            <div class="combination-card">
                <div class="combo-images">
                    ${combo.top ? `<img src="${combo.top.image}" alt="Top">` : ''}
                    ${combo.bottom ? `<img src="${combo.bottom.image}" alt="Bottom">` : ''}
                    ${combo.shoes ? `<img src="${combo.shoes.image}" alt="Shoes">` : ''}
                </div>
                <div class="combo-actions">
                    <button onclick="wardrobeMixer.loadCombination(${combo.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="wardrobeMixer.deleteCombination(${combo.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Load combination
    loadCombination(comboId) {
        const combo = this.savedCombinations.find(c => c.id === comboId);
        if (combo) {
            this.currentOutfit = {
                top: combo.top,
                bottom: combo.bottom,
                shoes: combo.shoes
            };
            this.updateOutfitPreview();
        }
    }
    
    // Delete combination
    deleteCombination(comboId) {
        this.savedCombinations = this.savedCombinations.filter(c => c.id !== comboId);
        localStorage.setItem('savedCombinations', JSON.stringify(this.savedCombinations));
        this.displaySavedCombinations();
    }
    
    // Close mixer
    closeMixer() {
        const modal = document.querySelector('.mixer-modal');
        if (modal) modal.remove();
    }
}

const wardrobeMixer = new WardrobeMixer();

// Initialize immediately
wardrobeMixer.init();

// Expose globally
window.wardrobeMixer = wardrobeMixer;

// Also initialize on DOM ready as backup
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.wardrobeMixer) {
            window.wardrobeMixer = wardrobeMixer;
        }
    });
}

console.log('Wardrobe Mixer loaded:', wardrobeMixer);
