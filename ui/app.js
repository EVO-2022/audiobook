// Main Application Logic
class App {
    constructor() {
        this.api = new AudiobookshelfAPI();
        this.currentLibrary = null;
        this.currentItem = null;
        this.audioPlayer = null;
        this.currentSession = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuth();
    }

    setupEventListeners() {
        // Login modal
        document.getElementById('loginBtn').addEventListener('click', () => {
            document.getElementById('loginModal').style.display = 'block';
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('loginModal').style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            const modal = document.getElementById('loginModal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Back button
        document.getElementById('backBtn').addEventListener('click', () => {
            this.showLibraries();
        });
    }

    checkAuth() {
        if (this.api.isAuthenticated()) {
            this.showMainContent();
            this.loadLibraries();
        } else {
            this.showLogin();
        }
    }

    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMessage');

        errorMsg.classList.remove('show');
        errorMsg.textContent = '';

        try {
            await this.api.login(username, password);
            document.getElementById('loginModal').style.display = 'none';
            this.showMainContent();
            this.loadLibraries();
        } catch (error) {
            errorMsg.textContent = error.message || 'Login failed. Please check your credentials.';
            errorMsg.classList.add('show');
        }
    }

    showLogin() {
        document.getElementById('mainContent').style.display = 'none';
    }

    showMainContent() {
        const user = this.api.getCurrentUser();
        const loginBtn = document.getElementById('loginBtn');
        if (user) {
            loginBtn.textContent = user.username;
            loginBtn.onclick = () => {
                this.api.logout();
                this.checkAuth();
            };
        }
    }

    async loadLibraries() {
        try {
            const libraries = await this.api.getLibraries();
            this.renderLibraries(libraries);
            document.getElementById('librariesSection').style.display = 'block';
        } catch (error) {
            console.error('Failed to load libraries:', error);
            alert('Failed to load libraries. Please try again.');
        }
    }

    renderLibraries(libraries) {
        const grid = document.getElementById('librariesGrid');
        grid.innerHTML = '';

        libraries.forEach(library => {
            const card = document.createElement('div');
            card.className = 'library-card';
            card.innerHTML = `
                <h3>${library.name}</h3>
                <p>${library.type || 'Library'}</p>
            `;
            card.addEventListener('click', () => {
                this.showLibrary(library);
            });
            grid.appendChild(card);
        });
    }

    async showLibrary(library) {
        this.currentLibrary = library;
        document.getElementById('librariesSection').style.display = 'none';
        document.getElementById('libraryView').style.display = 'block';
        document.getElementById('libraryTitle').textContent = library.name;

        try {
            const items = await this.api.getLibraryItems(library.id);
            this.renderItems(items.results || items);
        } catch (error) {
            console.error('Failed to load library items:', error);
            alert('Failed to load library items. Please try again.');
        }
    }

    renderItems(items) {
        const grid = document.getElementById('itemsGrid');
        grid.innerHTML = '';

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            
            const coverUrl = this.api.getItemCoverUrl(this.currentLibrary.id, item.id);
            const title = item.media?.metadata?.title || item.title || 'Unknown';
            const author = item.media?.metadata?.authorName || item.author || 'Unknown Author';

            card.innerHTML = `
                <img class="item-cover" src="${coverUrl}" alt="${title}" onerror="this.style.display='none'">
                <div class="item-info">
                    <h4>${title}</h4>
                    <p>${author}</p>
                </div>
            `;
            
            card.addEventListener('click', () => {
                this.playItem(item);
            });
            
            grid.appendChild(card);
        });
    }

    showLibraries() {
        this.currentLibrary = null;
        document.getElementById('libraryView').style.display = 'none';
        document.getElementById('librariesSection').style.display = 'block';
        this.hidePlayer();
    }

    async playItem(item) {
        this.currentItem = item;
        
        // Initialize audio player if needed
        if (!this.audioPlayer) {
            this.audioPlayer = new Audio();
            this.setupAudioPlayer();
        }

        const streamUrl = this.api.getItemStreamUrl(this.currentLibrary.id, item.id);
        this.audioPlayer.src = streamUrl;

        // Show player
        this.showPlayer(item);
        
        // Try to play
        try {
            await this.audioPlayer.play();
        } catch (error) {
            console.error('Playback error:', error);
            alert('Failed to start playback. Please try again.');
        }
    }

    setupAudioPlayer() {
        this.audioPlayer.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audioPlayer.addEventListener('loadedmetadata', () => {
            this.updateProgress();
        });

        this.audioPlayer.addEventListener('ended', () => {
            // Handle playback end
        });
    }

    showPlayer(item) {
        const player = document.getElementById('player');
        player.style.display = 'flex';

        const title = item.media?.metadata?.title || item.title || 'Unknown';
        const author = item.media?.metadata?.authorName || item.author || 'Unknown Author';
        const coverUrl = this.api.getItemCoverUrl(this.currentLibrary.id, item.id);

        document.getElementById('playerTitle').textContent = title;
        document.getElementById('playerAuthor').textContent = author;
        document.getElementById('playerCover').src = coverUrl;

        // Setup control buttons
        document.getElementById('playPauseBtn').onclick = () => {
            if (this.audioPlayer.paused) {
                this.audioPlayer.play();
                document.getElementById('playPauseBtn').textContent = '⏸';
            } else {
                this.audioPlayer.pause();
                document.getElementById('playPauseBtn').textContent = '▶';
            }
        };

        document.getElementById('rewindBtn').onclick = () => {
            this.audioPlayer.currentTime = Math.max(0, this.audioPlayer.currentTime - 30);
        };

        document.getElementById('forwardBtn').onclick = () => {
            this.audioPlayer.currentTime = Math.min(
                this.audioPlayer.duration,
                this.audioPlayer.currentTime + 30
            );
        };
    }

    hidePlayer() {
        if (this.audioPlayer) {
            this.audioPlayer.pause();
        }
        document.getElementById('player').style.display = 'none';
    }

    updateProgress() {
        if (!this.audioPlayer) return;

        const current = this.audioPlayer.currentTime;
        const total = this.audioPlayer.duration || 0;
        const progress = total > 0 ? (current / total) * 100 : 0;

        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('currentTime').textContent = this.formatTime(current);
        document.getElementById('totalTime').textContent = this.formatTime(total);
    }

    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

