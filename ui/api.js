// Audiobookshelf API Client
class AudiobookshelfAPI {
    constructor() {
        // Use the main domain for API calls (same origin, no CORS issues)
        this.baseURL = window.location.hostname === 'new.rhonda.onl' 
            ? 'https://rhonda.onl' 
            : window.location.origin;
        this.token = localStorage.getItem('abs_token');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/api${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (response.status === 401) {
                // Token expired or invalid
                this.logout();
                throw new Error('Authentication required');
            }

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Request failed' }));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async login(username, password) {
        const response = await this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        if (response.user && response.user.token) {
            this.token = response.user.token;
            localStorage.setItem('abs_token', this.token);
            localStorage.setItem('abs_user', JSON.stringify(response.user));
            return response.user;
        }

        throw new Error('Invalid response from server');
    }

    logout() {
        this.token = null;
        localStorage.removeItem('abs_token');
        localStorage.removeItem('abs_user');
    }

    isAuthenticated() {
        return !!this.token;
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('abs_user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Libraries
    async getLibraries() {
        return this.request('/libraries');
    }

    async getLibrary(libraryId) {
        return this.request(`/libraries/${libraryId}`);
    }

    // Library Items
    async getLibraryItems(libraryId, options = {}) {
        const params = new URLSearchParams({
            limit: options.limit || 50,
            page: options.page || 0,
            ...options
        });
        return this.request(`/libraries/${libraryId}/items?${params}`);
    }

    async getLibraryItem(libraryId, itemId) {
        return this.request(`/libraries/${libraryId}/items/${itemId}`);
    }

    // Playback
    async getPlaybackSession(sessionId) {
        return this.request(`/sessions/${sessionId}`);
    }

    async updatePlaybackProgress(sessionId, currentTime, duration, progress) {
        return this.request(`/sessions/${sessionId}/sync`, {
            method: 'PATCH',
            body: JSON.stringify({
                currentTime,
                duration,
                progress
            })
        });
    }

    // Media URLs
    getItemCoverUrl(libraryId, itemId) {
        return `${this.baseURL}/api/libraries/${libraryId}/items/${itemId}/cover`;
    }

    getItemStreamUrl(libraryId, itemId, options = {}) {
        const params = new URLSearchParams({
            token: this.token,
            ...options
        });
        return `${this.baseURL}/api/items/${itemId}/stream?${params}`;
    }
}

// Export for use in app.js
window.AudiobookshelfAPI = AudiobookshelfAPI;

