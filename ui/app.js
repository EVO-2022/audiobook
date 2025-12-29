// Main Application Logic
class App {
    constructor() {
        this.api = new AudiobookshelfAPI();
        this.currentLibrary = null;
        this.currentItem = null;
        this.audioPlayer = null;
        this.currentSession = null;
        this.sleepTimer = null;
        this.sleepTimerInterval = null;
        this.sleepTimerEndTime = null;
        this.chapters = [];
        this.bookmarks = [];
        this.progressSyncInterval = null;
        this.lastProgressSync = 0;

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

        // Playback speed controls
        document.getElementById('playbackSpeedBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePlaybackSpeedPopup();
        });

        document.querySelectorAll('.speed-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const speed = parseFloat(e.target.dataset.speed);
                this.setPlaybackSpeed(speed);
                this.togglePlaybackSpeedPopup();
            });
        });

        // Sleep timer
        document.getElementById('sleepTimerBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSleepTimerPopup();
        });

        document.querySelectorAll('.timer-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const minutes = parseInt(e.target.dataset.minutes);
                this.setSleepTimer(minutes);
                this.toggleSleepTimerPopup();
            });
        });

        // Chapters
        document.getElementById('chaptersBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleChaptersPopup();
        });

        // Bookmarks
        document.getElementById('bookmarksBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleBookmarksPopup();
        });

        document.getElementById('addBookmarkBtn').addEventListener('click', () => {
            this.addBookmark();
        });

        // Close popups when clicking outside
        document.addEventListener('click', (e) => {
            const speedPopup = document.getElementById('playbackSpeedPopup');
            const speedBtn = document.getElementById('playbackSpeedBtn');
            const timerPopup = document.getElementById('sleepTimerPopup');
            const timerBtn = document.getElementById('sleepTimerBtn');
            const chaptersPopup = document.getElementById('chaptersPopup');
            const chaptersBtn = document.getElementById('chaptersBtn');
            const bookmarksPopup = document.getElementById('bookmarksPopup');
            const bookmarksBtn = document.getElementById('bookmarksBtn');

            if (!speedPopup.contains(e.target) && !speedBtn.contains(e.target)) {
                speedPopup.style.display = 'none';
            }
            if (!timerPopup.contains(e.target) && !timerBtn.contains(e.target)) {
                timerPopup.style.display = 'none';
            }
            if (!chaptersPopup.contains(e.target) && !chaptersBtn.contains(e.target)) {
                chaptersPopup.style.display = 'none';
            }
            if (!bookmarksPopup.contains(e.target) && !bookmarksBtn.contains(e.target)) {
                bookmarksPopup.style.display = 'none';
            }
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
        document.getElementById('mainContent').style.display = 'block';
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
                <img class="item-cover" src="${coverUrl}" alt="${title}" onerror="this.src='https://new.rhonda.onl/book_placeholder.jpg'">
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

        try {
            // Start playback session
            const session = await this.api.playItem(item.id);
            this.currentSession = session;
            console.log('Playback session:', session);

            // Get the audio URL from the session
            if (session.audioTracks && session.audioTracks.length > 0) {
                const audioUrl = session.audioTracks[0].contentUrl;
                this.audioPlayer.src = audioUrl;

                // Show player
                this.showPlayer(item);

                // Load chapters and bookmarks
                await Promise.all([
                    this.loadChapters(),
                    this.loadBookmarks()
                ]);

                // Start progress tracking
                this.startProgressSync();

                // Try to play
                await this.audioPlayer.play();
            } else {
                throw new Error('No audio tracks found');
            }
        } catch (error) {
            console.error('Playback error:', error);
            alert('Failed to start playback. Please try again.');
        }
    }

    setupAudioPlayer() {
        this.audioPlayer.addEventListener('timeupdate', () => {
            this.updateProgress();
            this.syncProgressIfNeeded();
        });

        this.audioPlayer.addEventListener('loadedmetadata', () => {
            this.updateProgress();
        });

        this.audioPlayer.addEventListener('ended', () => {
            // Handle playback end
            this.updatePlayPauseButton();
            this.syncProgress(true); // Force sync on end
        });

        this.audioPlayer.addEventListener('play', () => {
            this.updatePlayPauseButton();
        });

        this.audioPlayer.addEventListener('pause', () => {
            this.updatePlayPauseButton();
            this.syncProgress(true); // Force sync on pause
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
        const playPauseBtn = document.getElementById('playPauseBtn');

        playPauseBtn.onclick = () => {
            if (this.audioPlayer.paused) {
                this.audioPlayer.play();
            } else {
                this.audioPlayer.pause();
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

        // Setup seekable progress bar
        const progressBar = document.querySelector('.progress-bar');
        progressBar.onclick = (e) => {
            if (!this.audioPlayer || !this.audioPlayer.duration) return;

            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const percentage = clickX / width;
            const seekTime = percentage * this.audioPlayer.duration;

            this.audioPlayer.currentTime = Math.max(0, Math.min(seekTime, this.audioPlayer.duration));
        };
    }

    hidePlayer() {
        if (this.audioPlayer) {
            this.audioPlayer.pause();
        }

        // Stop progress tracking
        this.stopProgressSync();

        // Final progress sync before closing
        if (this.currentItem && this.audioPlayer) {
            this.syncProgress(true);
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

    setPlaybackSpeed(speed) {
        if (!this.audioPlayer) return;

        this.audioPlayer.playbackRate = speed;

        // Update button states
        document.querySelectorAll('.speed-option').forEach(btn => {
            btn.classList.remove('active');
            if (parseFloat(btn.dataset.speed) === speed) {
                btn.classList.add('active');
            }
        });

        // Update button text
        document.getElementById('playbackSpeedBtn').textContent = `${speed}x`;
    }

    togglePlaybackSpeedPopup() {
        const popup = document.getElementById('playbackSpeedPopup');
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    }

    toggleSleepTimerPopup() {
        const popup = document.getElementById('sleepTimerPopup');
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    }

    setSleepTimer(minutes) {
        // Clear any existing timer
        if (this.sleepTimerInterval) {
            clearInterval(this.sleepTimerInterval);
            this.sleepTimerInterval = null;
        }

        const badge = document.getElementById('sleepTimerBadge');

        if (minutes === 0) {
            // Turn off timer
            this.sleepTimerEndTime = null;
            badge.style.display = 'none';
            return;
        }

        // Set new timer
        this.sleepTimerEndTime = Date.now() + (minutes * 60 * 1000);
        badge.style.display = 'inline';

        // Update display immediately
        this.updateSleepTimerDisplay();

        // Update every second
        this.sleepTimerInterval = setInterval(() => {
            this.updateSleepTimerDisplay();

            if (Date.now() >= this.sleepTimerEndTime) {
                // Timer expired
                if (this.audioPlayer) {
                    this.audioPlayer.pause();
                }
                this.setSleepTimer(0);
            }
        }, 1000);
    }

    updateSleepTimerDisplay() {
        if (!this.sleepTimerEndTime) return;

        const remaining = Math.max(0, this.sleepTimerEndTime - Date.now());
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);

        const badge = document.getElementById('sleepTimerBadge');
        badge.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Chapters functionality
    toggleChaptersPopup() {
        const popup = document.getElementById('chaptersPopup');
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    }

    async loadChapters() {
        if (!this.currentItem) return;

        try {
            const itemDetails = await this.api.getItem(this.currentItem.id);
            this.chapters = itemDetails.media?.chapters || [];
            this.renderChapters();
        } catch (error) {
            console.error('Failed to load chapters:', error);
        }
    }

    renderChapters() {
        const list = document.getElementById('chaptersList');

        if (!this.chapters || this.chapters.length === 0) {
            list.innerHTML = '<p class="empty-message">No chapters available</p>';
            return;
        }

        list.innerHTML = '';
        this.chapters.forEach((chapter, index) => {
            const item = document.createElement('div');
            item.className = 'chapter-item';

            const title = document.createElement('div');
            title.className = 'chapter-title';
            title.textContent = chapter.title || `Chapter ${index + 1}`;

            const time = document.createElement('div');
            time.className = 'chapter-time';
            time.textContent = this.formatTime(chapter.start);

            item.appendChild(title);
            item.appendChild(time);

            item.addEventListener('click', () => {
                this.jumpToTime(chapter.start);
                this.toggleChaptersPopup();
            });

            list.appendChild(item);
        });
    }

    // Bookmarks functionality
    toggleBookmarksPopup() {
        const popup = document.getElementById('bookmarksPopup');
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    }

    async loadBookmarks() {
        if (!this.currentItem) return;

        try {
            const itemDetails = await this.api.getItem(this.currentItem.id);
            this.bookmarks = itemDetails.userMediaProgress?.bookmarks || [];
            this.renderBookmarks();
        } catch (error) {
            console.error('Failed to load bookmarks:', error);
        }
    }

    renderBookmarks() {
        const list = document.getElementById('bookmarksList');

        if (!this.bookmarks || this.bookmarks.length === 0) {
            list.innerHTML = '<p class="empty-message">No bookmarks yet</p>';
            return;
        }

        list.innerHTML = '';
        this.bookmarks.forEach((bookmark) => {
            const item = document.createElement('div');
            item.className = 'bookmark-item';

            const info = document.createElement('div');
            info.className = 'bookmark-info';

            const title = document.createElement('div');
            title.className = 'bookmark-title';
            title.textContent = bookmark.title || 'Bookmark';

            const time = document.createElement('div');
            time.className = 'bookmark-time';
            time.textContent = this.formatTime(bookmark.time);

            info.appendChild(title);
            info.appendChild(time);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'bookmark-delete';
            deleteBtn.textContent = '×';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.deleteBookmark(bookmark.id);
            };

            item.appendChild(info);
            item.appendChild(deleteBtn);

            item.addEventListener('click', () => {
                this.jumpToTime(bookmark.time);
                this.toggleBookmarksPopup();
            });

            list.appendChild(item);
        });
    }

    async addBookmark() {
        if (!this.audioPlayer || !this.currentItem) return;

        const currentTime = this.audioPlayer.currentTime;
        const title = prompt('Bookmark title:', `Bookmark at ${this.formatTime(currentTime)}`);

        if (!title) return;

        try {
            await this.api.createBookmark(this.currentItem.id, currentTime, title);
            await this.loadBookmarks();
        } catch (error) {
            console.error('Failed to create bookmark:', error);
            alert('Failed to create bookmark. Please try again.');
        }
    }

    async deleteBookmark(bookmarkId) {
        if (!confirm('Delete this bookmark?')) return;

        try {
            await this.api.deleteBookmark(bookmarkId);
            await this.loadBookmarks();
        } catch (error) {
            console.error('Failed to delete bookmark:', error);
            alert('Failed to delete bookmark. Please try again.');
        }
    }

    jumpToTime(time) {
        if (!this.audioPlayer) return;
        this.audioPlayer.currentTime = time;
    }

    updatePlayPauseButton() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (!playPauseBtn) return;

        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');

        if (this.audioPlayer && !this.audioPlayer.paused) {
            // Currently playing - show pause icon
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            // Currently paused - show play icon
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }

    // Progress tracking
    startProgressSync() {
        // Clear any existing interval
        if (this.progressSyncInterval) {
            clearInterval(this.progressSyncInterval);
        }

        // Sync progress every 30 seconds
        this.progressSyncInterval = setInterval(() => {
            this.syncProgress(false);
        }, 30000);
    }

    syncProgressIfNeeded() {
        // Sync every 10 seconds during playback
        const now = Date.now();
        if (now - this.lastProgressSync > 10000) {
            this.syncProgress(false);
        }
    }

    async syncProgress(force = false) {
        if (!this.currentItem || !this.audioPlayer) {
            console.log('Cannot sync progress - missing item or player');
            return;
        }

        const currentTime = this.audioPlayer.currentTime;
        const duration = this.audioPlayer.duration;

        if (!duration || isNaN(duration) || isNaN(currentTime)) {
            console.log('Cannot sync progress - invalid duration or time');
            return;
        }

        // Only sync if forced or if we have meaningful progress
        if (!force && currentTime < 1) return;

        const progress = currentTime / duration;
        const isFinished = this.audioPlayer.ended || (duration - currentTime) < 1;

        console.log('Syncing progress:', {
            libraryItemId: this.currentItem.id,
            currentTime,
            duration,
            progress: Math.round(progress * 100) + '%',
            isFinished
        });

        try {
            await this.api.updatePlaybackProgress(
                this.currentItem.id,
                currentTime,
                duration,
                isFinished
            );
            this.lastProgressSync = Date.now();
            console.log(`Progress synced successfully: ${Math.round(progress * 100)}%`);
        } catch (error) {
            console.error('Failed to sync progress:', error);
        }
    }

    stopProgressSync() {
        if (this.progressSyncInterval) {
            clearInterval(this.progressSyncInterval);
            this.progressSyncInterval = null;
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

