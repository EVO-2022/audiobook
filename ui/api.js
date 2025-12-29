// Audiobookshelf API Client
class AudiobookshelfAPI {
    constructor() {
        // Use same origin for API calls (Caddy proxies /api/* to audiobookshelf)
        this.baseURL = window.location.origin;
        this.token = localStorage.getItem('abs_token');
    }

    async request(endpoint, options = {}) {
        // Don't prepend /api for root-level endpoints (login, logout, ping, status)
        const isRootEndpoint = ['/login', '/logout', '/ping', '/status'].includes(endpoint);
        const url = isRootEndpoint ? `${this.baseURL}${endpoint}` : `${this.baseURL}/api${endpoint}`;
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
        const response = await this.request('/libraries');
        return response.libraries || [];
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

    async updatePlaybackProgress(libraryItemId, currentTime, duration, isFinished = false) {
        const progress = duration > 0 ? currentTime / duration : 0;
        return this.request('/me/progress', {
            method: 'POST',
            body: JSON.stringify({
                libraryItemId,
                progress,
                currentTime,
                isFinished,
                duration
            })
        });
    }

    // Media URLs
    getItemCoverUrl(libraryId, itemId) {
        // Add token as query parameter for image requests (can't use headers)
        return `${this.baseURL}/api/items/${itemId}/cover?token=${this.token}`;
    }

    getItemStreamUrl(libraryId, itemId, options = {}) {
        const params = new URLSearchParams({
            token: this.token,
            ...options
        });
        return `${this.baseURL}/api/items/${itemId}/play?${params}`;
    }

    // Play an item
    async playItem(itemId) {
        return this.request(`/items/${itemId}/play`, {
            method: 'POST'
        });
    }

    // Bookmarks
    async getBookmarks() {
        const response = await this.request('/me/items-in-progress');
        return response;
    }

    async createBookmark(libraryItemId, time, title) {
        return this.request('/me/bookmarks', {
            method: 'POST',
            body: JSON.stringify({
                libraryItemId,
                time,
                title
            })
        });
    }

    async updateBookmark(bookmarkId, updates) {
        return this.request(`/me/bookmarks/${bookmarkId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates)
        });
    }

    async deleteBookmark(bookmarkId) {
        return this.request(`/me/bookmarks/${bookmarkId}`, {
            method: 'DELETE'
        });
    }

    // Get item details (includes chapters)
    async getItem(itemId) {
        return this.request(`/items/${itemId}`);
    }
}

// Export for use in app.js
window.AudiobookshelfAPI = AudiobookshelfAPI;

