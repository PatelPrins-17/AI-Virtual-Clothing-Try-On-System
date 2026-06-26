// Live Chat Support - Customer Support Team
if (!window.API_URL) window.API_URL = 'http://localhost:5002/api';
const API_URL = window.API_URL;

class LiveChatSupport {
    constructor() {
        this.messages = [];
        this.isOpen = false;
        this.pollInterval = null;
        this.unreadCount = 0;
    }
    
    init() {
        this.createChatWidget();
        this.loadRecentMessages();
        this.addStyles();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .live-chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9998;
                font-family: 'Inter', sans-serif;
            }
            
            .live-chat-header {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #10b981, #059669);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
                transition: all 0.3s ease;
                position: relative;
            }
            
            .live-chat-header:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(16, 185, 129, 0.6);
            }
            
            .live-chat-header i {
                color: white;
                font-size: 1.5rem;
            }
            
            .live-chat-unread-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #f43f5e;
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75rem;
                font-weight: bold;
            }
            
            .live-chat-widget.open .live-chat-header {
                width: 100%;
                height: 60px;
                border-radius: 15px 15px 0 0;
                justify-content: space-between;
                padding: 0 20px;
            }
            
            .live-chat-widget.open {
                width: 380px;
                height: 500px;
                background: #1a1a2e;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                display: flex;
                flex-direction: column;
            }
            
            .live-chat-body {
                display: none;
                flex: 1;
                flex-direction: column;
                overflow: hidden;
            }
            
            .live-chat-widget.open .live-chat-body {
                display: flex;
            }
            
            .live-chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: #0f0f23;
            }
            
            .live-chat-message {
                margin-bottom: 15px;
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .live-chat-message.user {
                text-align: right;
            }
            
            .live-chat-message.support {
                text-align: left;
            }
            
            .live-message-bubble {
                display: inline-block;
                max-width: 70%;
                padding: 12px 16px;
                border-radius: 15px;
                word-wrap: break-word;
            }
            
            .live-chat-message.user .live-message-bubble {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border-bottom-right-radius: 5px;
            }
            
            .live-chat-message.support .live-message-bubble {
                background: rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.9);
                border-bottom-left-radius: 5px;
            }
            
            .live-message-time {
                font-size: 0.7rem;
                color: rgba(255, 255, 255, 0.5);
                margin-top: 5px;
                display: block;
            }
            
            .live-chat-input-container {
                padding: 15px;
                background: #1a1a2e;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                gap: 10px;
            }
            
            .live-chat-input-container input {
                flex: 1;
                padding: 12px 15px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 25px;
                background: rgba(255, 255, 255, 0.05);
                color: white;
                font-size: 0.9rem;
                outline: none;
                transition: all 0.3s ease;
            }
            
            .live-chat-input-container input:focus {
                border-color: #10b981;
                background: rgba(255, 255, 255, 0.1);
            }
            
            .live-chat-input-container input::placeholder {
                color: rgba(255, 255, 255, 0.4);
            }
            
            .live-chat-send-btn {
                width: 45px;
                height: 45px;
                border: none;
                border-radius: 50%;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .live-chat-send-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
            }
            
            .live-chat-empty-state {
                text-align: center;
                padding: 40px 20px;
                color: rgba(255, 255, 255, 0.5);
            }
            
            .live-chat-empty-state i {
                font-size: 3rem;
                margin-bottom: 15px;
                color: rgba(16, 185, 129, 0.3);
            }
            
            .typing-indicator {
                animation: slideIn 0.3s ease;
            }
            
            .typing-dots {
                display: flex;
                gap: 4px;
                padding: 8px 0;
            }
            
            .typing-dots span {
                width: 8px;
                height: 8px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                animation: typingBounce 1.4s infinite;
            }
            
            .typing-dots span:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .typing-dots span:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes typingBounce {
                0%, 60%, 100% {
                    transform: translateY(0);
                    opacity: 0.6;
                }
                30% {
                    transform: translateY(-10px);
                    opacity: 1;
                }
            }
            
            .edit-msg-btn {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.5);
                cursor: pointer;
                font-size: 0.8rem;
                margin-left: 10px;
                padding: 0;
                transition: color 0.3s;
            }
            .edit-msg-btn:hover {
                color: white;
            }
            .edit-mode {
                display: flex;
                align-items: center;
                gap: 5px;
                margin-top: 5px;
            }
            .edit-msg-input {
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.4);
                color: white;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 0.9rem;
                outline: none;
                width: 100%;
            }
            .save-msg-btn, .cancel-msg-btn {
                background: none;
                border: none;
                cursor: pointer;
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.9rem;
                padding: 4px;
            }
            .save-msg-btn:hover { color: #10b981; }
            .cancel-msg-btn:hover { color: #f43f5e; }
            
            @media (max-width: 768px) {
                .live-chat-widget.open {
                    width: calc(100vw - 40px);
                    height: calc(100vh - 100px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    createChatWidget() {
        const chatHTML = `
            <div class="live-chat-widget" id="liveChatWidget">
                <div class="live-chat-header" onclick="liveChat.toggleChat()">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-headset"></i>
                        <span style="display: none; color: white; font-weight: 600;">Live Support</span>
                    </div>
                    <span class="live-chat-unread-badge" id="liveChatUnreadBadge" style="display: none;">0</span>
                </div>
                <div class="live-chat-body" id="liveChatBody">
                    <div class="live-chat-messages" id="liveChatMessages">
                        <div class="live-chat-empty-state">
                            <i class="fas fa-headset"></i>
                            <p>Chat with our support team!</p>
                        </div>
                    </div>
                    <div class="live-chat-input-container">
                        <input type="text" id="liveChatInput" placeholder="Type your message..." />
                        <button class="live-chat-send-btn" onclick="liveChat.sendMessage()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
        
        document.getElementById('liveChatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }
    
    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWidget = document.getElementById('liveChatWidget');
        const headerText = chatWidget.querySelector('.live-chat-header span');
        
        if (this.isOpen) {
            chatWidget.classList.add('open');
            if (headerText) headerText.style.display = 'block';
            this.unreadCount = 0;
            this.updateUnreadBadge();
            this.stopPolling(); // Stop polling when chat is open
            document.getElementById('liveChatInput').focus();
        } else {
            chatWidget.classList.remove('open');
            if (headerText) headerText.style.display = 'none';
            this.startPolling(); // Start polling when chat is closed
        }
    }
    
    updateUnreadBadge() {
        const badge = document.getElementById('liveChatUnreadBadge');
        if (this.unreadCount > 0 && !this.isOpen) {
            badge.textContent = this.unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
    
    async loadRecentMessages() {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.id || 'guest';
            
            const response = await fetch(`${API_URL}/chat/messages`);
            const data = await response.json();
            if (data.success) {
                const serverMessages = data.data || [];
                const oldLength = this.messages.length;
                
                // Filter messages for current user only (both user messages and their support responses)
                const userMessages = serverMessages.filter(msg => {
                    return msg.userId === userId;
                });
                
                // Merge server messages with local messages (avoid duplicates)
                userMessages.forEach(serverMsg => {
                    const exists = this.messages.some(msg => 
                        msg.timestamp === serverMsg.timestamp && 
                        msg.message === serverMsg.message
                    );
                    if (!exists) {
                        this.messages.push(serverMsg);
                    }
                });
                
                if (!this.isOpen && this.messages.length > oldLength) {
                    this.unreadCount += (this.messages.length - oldLength);
                    this.updateUnreadBadge();
                }
                
                this.displayMessages();
            }
        } catch (error) {
            console.error('Error loading messages:', error);
            // Don't clear messages on error - keep local messages
        }
    }
    
    displayMessages() {
        const container = document.getElementById('liveChatMessages');
        if (!container) return;
        
        if (this.messages.length === 0) {
            container.innerHTML = `
                <div class="live-chat-empty-state">
                    <i class="fas fa-headset"></i>
                    <p>Chat with our support team!</p>
                </div>
            `;
            return;
        }
        
        // Save current scroll position
        const wasAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
        
        const messagesHTML = this.messages.map(msg => `
            <div class="live-chat-message ${msg.type || 'user'}">
                <div class="live-message-bubble">
                    ${msg.isEditing 
                        ? `
                        <div style="margin-bottom: 5px; font-size: 0.8rem; color: rgba(255,255,255,0.7);">Edit Message</div>
                        <div class="edit-mode">
                            <input type="text" id="edit-input-${msg.timestamp}" value="${this.escapeHtml(msg.message).replace(/"/g, '&quot;')}" class="edit-msg-input" onkeypress="if(event.key === 'Enter') liveChat.saveEdit('${msg.timestamp}')" />
                            <button onclick="liveChat.saveEdit('${msg.timestamp}')" class="save-msg-btn" title="Save"><i class="fas fa-check"></i></button>
                            <button onclick="liveChat.cancelEdit('${msg.timestamp}')" class="cancel-msg-btn" title="Cancel"><i class="fas fa-times"></i></button>
                        </div>
                        `
                        : `
                        ${this.escapeHtml(msg.message)}
                        <span class="live-message-time">
                            ${this.formatTime(msg.timestamp)}
                            ${msg.type === 'user' ? `<button onclick="liveChat.startEdit('${msg.timestamp}')" class="edit-msg-btn" title="Edit message"><i class="fas fa-edit"></i></button>` : ''}
                        </span>
                        `
                    }
                </div>
            </div>
        `).join('');
        
        container.innerHTML = messagesHTML;
        
        // Only auto-scroll if user was already at bottom
        if (wasAtBottom) {
            container.scrollTop = container.scrollHeight;
        }
    }
    
    startEdit(timestamp) {
        const msg = this.messages.find(m => m.timestamp === timestamp);
        if (msg) {
            msg.isEditing = true;
            this.displayMessages();
            setTimeout(() => {
                const input = document.getElementById(`edit-input-${timestamp}`);
                if (input) {
                    input.focus();
                    const val = input.value;
                    input.value = '';
                    input.value = val;
                }
            }, 10);
        }
    }
    
    cancelEdit(timestamp) {
        const msg = this.messages.find(m => m.timestamp === timestamp);
        if (msg) {
            msg.isEditing = false;
            this.displayMessages();
        }
    }
    
    async saveEdit(timestamp) {
        const msg = this.messages.find(m => m.timestamp === timestamp);
        if (msg) {
            const input = document.getElementById(`edit-input-${timestamp}`);
            if (input && input.value.trim()) {
                const newMessage = input.value.trim();
                msg.message = newMessage;
                msg.isEditing = false;
                
                // Remove the AI/support response that came right after this edited message
                const msgIndex = this.messages.indexOf(msg);
                if (msgIndex !== -1 && msgIndex + 1 < this.messages.length) {
                    const nextMsg = this.messages[msgIndex + 1];
                    if (nextMsg.type === 'support') {
                        this.messages.splice(msgIndex + 1, 1);
                    }
                }
                
                this.displayMessages();
                
                // Update message on server if it has an ID
                if (msg.id && typeof API_URL !== 'undefined') {
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    const userId = user.id || 'guest';
                    fetch(`${API_URL}/chat/messages/${msg.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: msg.message, userId })
                    }).catch(err => console.error('Failed to update on server', err));
                }
                
                // Now get a new AI response for the edited message
                this.showTypingIndicator();
                
                try {
                    const response = await fetch(`${API_URL}/ai-chat-support`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            message: newMessage,
                            chatHistory: this.messages.slice(-5)
                        })
                    });
                    
                    const data = await response.json();
                    this.hideTypingIndicator();
                    
                    if (data.success) {
                        // Insert the new AI response right after the edited message
                        const currentIndex = this.messages.indexOf(msg);
                        const aiResponse = {
                            userId: 'support',
                            userName: 'AI Support',
                            message: data.data.message,
                            type: 'support',
                            timestamp: data.data.timestamp
                        };
                        this.messages.splice(currentIndex + 1, 0, aiResponse);
                        this.displayMessages();
                    } else {
                        throw new Error(data.message);
                    }
                } catch (error) {
                    console.error('Error getting new AI response for edited message:', error);
                    this.hideTypingIndicator();
                    this.addFallbackResponse(newMessage);
                }
            } else {
                this.cancelEdit(timestamp);
            }
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    async sendMessage() {
        const input = document.getElementById('liveChatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id || 'guest';
        const userName = (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null) || user.name || user.username || 'Guest';
        
        // Add user message
        this.messages.push({
            userId,
            userName,
            message,
            type: 'user',
            timestamp: new Date().toISOString()
        });
        this.displayMessages();
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            console.log('🤖 Calling Gemini AI Chat API...');
            console.log('Message:', message);
            console.log('API URL:', `${API_URL}/ai-chat-support`);
            
            // Call Gemini AI for intelligent response
            const response = await fetch(`${API_URL}/ai-chat-support`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message,
                    chatHistory: this.messages.slice(-5) // Send last 5 messages for context
                })
            });
            
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            
            this.hideTypingIndicator();
            
            if (data.success) {
                // Add AI response
                this.messages.push({
                    userId: 'support',
                    userName: 'AI Support',
                    message: data.data.message,
                    type: 'support',
                    timestamp: data.data.timestamp
                });
                this.displayMessages();
                
                if (!this.isOpen) {
                    this.unreadCount++;
                    this.updateUnreadBadge();
                }
            } else {
                console.error('❌ API returned error:', data.message);
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('❌ Error sending message:', error);
            this.hideTypingIndicator();
            
            // Fallback to basic response if AI fails
            console.log('⚠️ Using fallback response');
            this.addFallbackResponse(message);
        }
    }
    
    showTypingIndicator() {
        const container = document.getElementById('liveChatMessages');
        const typingHTML = `
            <div class="live-chat-message support typing-indicator" id="typingIndicator">
                <div class="live-message-bubble">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', typingHTML);
        container.scrollTop = container.scrollHeight;
    }
    
    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }
    
    addFallbackResponse(userMessage) {
        let response = "Thank you for contacting us! Our support team will assist you shortly.";
        
        const lowerMsg = userMessage.toLowerCase();
        if (lowerMsg.includes('help')) {
            response = "Hi! How can I help you today?";
        } else if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
            response = "Our service is completely free! You can try unlimited outfits.";
        } else if (lowerMsg.includes('thank')) {
            response = "You're welcome! Feel free to ask if you need anything else. 😊";
        }
        
        this.messages.push({
            userId: 'support',
            userName: 'Support Team',
            message: response,
            type: 'support',
            timestamp: new Date().toISOString()
        });
        this.displayMessages();
        
        if (!this.isOpen) {
            this.unreadCount++;
            this.updateUnreadBadge();
        }
    }
    
    startPolling() {
        // Don't poll when chat is open - messages are already local
        // Only poll when chat is closed to check for new messages
        if (this.isOpen) return;
        
        this.pollInterval = setInterval(() => {
            if (!this.isOpen) {
                this.loadRecentMessages();
            }
        }, 5000);
    }
    
    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }
}

const liveChat = new LiveChatSupport();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        liveChat.init();
    });
} else {
    liveChat.init();
}

window.liveChat = liveChat;
