document.addEventListener('DOMContentLoaded', function() {
    // Sample video data (in a real app, this would come from a backend API)
    const videos = [
        {
            id: 1,
            title: 'How to Build a YouTube Clone with HTML, CSS & JavaScript',
            thumbnail: 'https://i.ytimg.com/vi/G3e-cpL7ofc/hqdefault.jpg',
            channel: 'Web Dev Simplified',
            views: '125K views',
            timestamp: '3 days ago',
            duration: '12:34'
        },
        {
            id: 2,
            title: 'Learn React in 1 Hour - Beginner\'s Tutorial',
            thumbnail: 'https://i.ytimg.com/vi/bMknfKXIFA8/hqdefault.jpg',
            channel: 'Programming with Mosh',
            views: '1.2M views',
            timestamp: '2 weeks ago',
            duration: '1:02:45'
        },
        {
            id: 3,
            title: '10 CSS Pro Tips - Code this, NOT that!',
            thumbnail: 'https://i.ytimg.com/vi/Qhaz36TZG5Y/hqdefault.jpg',
            channel: 'Fireship',
            views: '856K views',
            timestamp: '1 month ago',
            duration: '8:12'
        },
        {
            id: 4,
            title: 'Python Tutorial for Beginners - Full Course',
            thumbnail: 'https://i.ytimg.com/vi/_uQrJ0TkZlc/hqdefault.jpg',
            channel: 'freeCodeCamp.org',
            views: '4.5M views',
            timestamp: '1 year ago',
            duration: '4:26:52'
        },
        {
            id: 5,
            title: 'Build a REST API with Node.js and Express',
            thumbnail: 'https://i.ytimg.com/vi/l8WPWK9mS5M/hqdefault.jpg',
            channel: 'Traversy Media',
            views: '320K views',
            timestamp: '5 months ago',
            duration: '1:05:22'
        },
        {
            id: 6,
            title: 'JavaScript ES6 Tutorial',
            thumbnail: 'https://i.ytimg.com/vi/NCwa_xi0Uuc/hqdefault.jpg',
            channel: 'Codevolution',
            views: '150K views',
            timestamp: '8 months ago',
            duration: '45:18'
        },
        {
            id: 7,
            title: 'Responsive Web Design Tutorial',
            thumbnail: 'https://i.ytimg.com/vi/srvUrASNj0s/hqdefault.jpg',
            channel: 'Kevin Powell',
            views: '210K views',
            timestamp: '3 months ago',
            duration: '23:45'
        },
        {
            id: 8,
            title: 'Git & GitHub Crash Course',
            thumbnail: 'https://i.ytimg.com/vi/SWYqp7iY_Tc/hqdefault.jpg',
            channel: 'Brad Traversy',
            views: '180K views',
            timestamp: '6 months ago',
            duration: '32:10'
        }
    ];

    const videosContainer = document.getElementById('videos-container');

    // Render videos
    function renderVideos(videos) {
        videosContainer.innerHTML = '';
        videos.forEach(video => {
            const videoElement = document.createElement('div');
            videoElement.className = 'video-card';
            videoElement.innerHTML = `
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <span class="video-duration">${video.duration}</span>
                </div>
                <div class="video-details">
                    <div class="channel-avatar"></div>
                    <div class="video-info">
                        <h3>${video.title}</h3>
                        <p>${video.channel}</p>
                        <p>${video.views} • ${video.timestamp}</p>
                    </div>
                </div>
            `;
            videosContainer.appendChild(videoElement);
        });
    }

    // Initial render
    renderVideos(videos);

    // Search functionality
    const searchBar = document.querySelector('.search-bar');
    const searchButton = document.querySelector('.search-button');

    function handleSearch() {
        const searchTerm = searchBar.value.toLowerCase();
        if (searchTerm.trim() === '') {
            renderVideos(videos);
            return;
        }

        const filteredVideos = videos.filter(video =>
            video.title.toLowerCase().includes(searchTerm) ||
            video.channel.toLowerCase().includes(searchTerm)
        );

        renderVideos(filteredVideos);
    }

    searchButton.addEventListener('click', handleSearch);
    searchBar.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Category filtering
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        category.addEventListener('click', function() {
            categories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            // In a real app, you would filter videos by category
            // For now, we'll just render all videos
            renderVideos(videos);
        });
    });

    // Sidebar toggle for mobile
    const menuIcon = document.querySelector('.menu-icon');
    const sidebar = document.querySelector('.sidebar');

    menuIcon.addEventListener('click', function() {
        sidebar.classList.toggle('show');
    });
});