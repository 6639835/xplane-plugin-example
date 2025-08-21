// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    });

    // Load releases and changelog
    loadReleases();
    loadChangelog();
});

// GitHub API Configuration
const GITHUB_REPO = '6639835/xplane-plugin-example';
const GITHUB_API_BASE = 'https://api.github.com/repos';

// Load releases from GitHub API
async function loadReleases() {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/${GITHUB_REPO}/releases`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const releases = await response.json();
        
        if (releases.length > 0) {
            displayLatestRelease(releases[0]);
        } else {
            displayNoReleases();
        }
    } catch (error) {
        console.error('Error loading releases:', error);
        displayReleaseError();
    }
}

// Display the latest release
function displayLatestRelease(release) {
    const versionElement = document.getElementById('latest-version');
    const dateElement = document.getElementById('release-date');
    const downloadGrid = document.getElementById('download-grid');

    // Update version and date
    versionElement.textContent = release.tag_name || release.name;
    const releaseDate = new Date(release.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    dateElement.textContent = `Released on ${releaseDate}`;

    // Create download cards
    const downloadCards = createDownloadCards(release);
    downloadGrid.innerHTML = downloadCards;
}

// Create download cards for different platforms
function createDownloadCards(release) {
    const assets = release.assets || [];
    
    // Define platform mappings
    const platforms = [
        {
            name: 'Windows',
            icon: 'fab fa-windows',
            description: '64-bit',
            filename: 'win.xpl',
            assetPattern: /win\.xpl$/i
        },
        {
            name: 'macOS',
            icon: 'fab fa-apple',
            description: 'Universal (Intel + Apple Silicon)',
            filename: 'mac.xpl',
            assetPattern: /mac\.xpl$/i
        },
        {
            name: 'Linux',
            icon: 'fab fa-linux',
            description: '64-bit',
            filename: 'lin.xpl',
            assetPattern: /lin\.xpl$/i
        },
        {
            name: 'All Platforms',
            icon: 'fas fa-archive',
            description: 'Complete package',
            filename: 'OpenALSharedExample.tar.gz',
            assetPattern: /OpenALSharedExample\.tar\.gz$/i
        }
    ];

    return platforms.map(platform => {
        const asset = assets.find(asset => platform.assetPattern.test(asset.name));
        const downloadUrl = asset ? asset.browser_download_url : '#';
        const fileSize = asset ? formatFileSize(asset.size) : '';
        
        return `
            <div class="download-card">
                <div class="download-card-content">
                    <div class="download-icon">
                        <i class="${platform.icon}"></i>
                    </div>
                    <h4>${platform.name}</h4>
                    <p>${platform.description}</p>
                    ${fileSize ? `<p class="file-size">${fileSize}</p>` : '<p class="file-size">&nbsp;</p>'}
                </div>
                <div class="download-card-actions">
                    ${asset ? 
                        `<a href="${downloadUrl}" class="download-btn" download>
                            <i class="fas fa-download"></i>
                            Download
                        </a>` :
                        `<div class="download-btn" style="background: #ccc; cursor: not-allowed;">
                            <i class="fas fa-times"></i>
                            Not Available
                        </div>`
                    }
                </div>
            </div>
        `;
    }).join('');
}

// Display message when no releases are found
function displayNoReleases() {
    const downloadGrid = document.getElementById('download-grid');
    downloadGrid.innerHTML = `
        <div class="no-releases">
            <p>No releases available yet. Check back soon!</p>
            <a href="https://github.com/${GITHUB_REPO}/actions" class="btn btn-outline" target="_blank">
                <i class="fas fa-cog"></i>
                View Development Builds
            </a>
        </div>
    `;
}

// Display error message for releases
function displayReleaseError() {
    const downloadGrid = document.getElementById('download-grid');
    downloadGrid.innerHTML = `
        <div class="release-error">
            <p>Unable to load releases. Please try again later.</p>
            <a href="https://github.com/${GITHUB_REPO}/releases" class="btn btn-outline" target="_blank">
                <i class="fab fa-github"></i>
                View on GitHub
            </a>
        </div>
    `;
}

// Load and parse changelog
async function loadChangelog() {
    try {
        // Try to fetch CHANGELOG.md from the repository
        const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_REPO}/main/CHANGELOG.md`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const changelogText = await response.text();
        displayChangelog(parseChangelog(changelogText));
    } catch (error) {
        console.error('Error loading changelog:', error);
        displayChangelogError();
    }
}

// Parse changelog markdown
function parseChangelog(text) {
    const lines = text.split('\n');
    const entries = [];
    let currentEntry = null;
    let currentSection = null;

    for (const line of lines) {
        // Match version headers like ## [1.0.0] - 2025-01-27
        const versionMatch = line.match(/^##\s*\[([^\]]+)\]\s*-\s*(.+)$/);
        if (versionMatch) {
            if (currentEntry) {
                entries.push(currentEntry);
            }
            currentEntry = {
                version: versionMatch[1],
                date: versionMatch[2],
                sections: {}
            };
            currentSection = null;
            continue;
        }

        // Match section headers like ### Added, ### Fixed, etc.
        const sectionMatch = line.match(/^###\s*(.+)$/);
        if (sectionMatch && currentEntry) {
            const sectionName = sectionMatch[1].toLowerCase();
            currentSection = sectionName;
            currentEntry.sections[sectionName] = [];
            continue;
        }

        // Match list items
        const listMatch = line.match(/^-\s*(.+)$/);
        if (listMatch && currentEntry && currentSection) {
            currentEntry.sections[currentSection].push(listMatch[1]);
        }
    }

    if (currentEntry) {
        entries.push(currentEntry);
    }

    return entries;
}

// Display parsed changelog
function displayChangelog(entries) {
    const changelogContent = document.getElementById('changelog-content');
    
    if (entries.length === 0) {
        changelogContent.innerHTML = `
            <div class="no-changelog">
                <p>No changelog entries found.</p>
            </div>
        `;
        return;
    }

    const changelogHTML = entries.map(entry => {
        const sectionsHTML = Object.entries(entry.sections)
            .filter(([_, items]) => items.length > 0)
            .map(([sectionName, items]) => `
                <div class="changelog-section ${sectionName}">
                    <h4>${capitalizeFirst(sectionName)}</h4>
                    <ul class="changelog-list">
                        ${items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `).join('');

        return `
            <div class="changelog-entry fade-in-up">
                <div class="changelog-version">
                    <h3>Version ${entry.version}</h3>
                    <span class="changelog-date">${entry.date}</span>
                </div>
                ${sectionsHTML}
            </div>
        `;
    }).join('');

    changelogContent.innerHTML = changelogHTML;
}

// Display changelog error
function displayChangelogError() {
    const changelogContent = document.getElementById('changelog-content');
    changelogContent.innerHTML = `
        <div class="changelog-error">
            <p>Unable to load changelog. Please try again later.</p>
            <a href="https://github.com/${GITHUB_REPO}/blob/main/CHANGELOG.md" class="btn btn-outline" target="_blank">
                <i class="fab fa-github"></i>
                View on GitHub
            </a>
        </div>
    `;
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .download-card, .step, .changelog-entry');
    animatedElements.forEach(el => observer.observe(el));
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Copy to clipboard functionality (for installation commands)
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        // Show success message
        showToast('Copied to clipboard!');
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
        showToast('Failed to copy to clipboard', 'error');
    });
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Add click handlers for code blocks (if any)
document.addEventListener('DOMContentLoaded', function() {
    const codeBlocks = document.querySelectorAll('code');
    codeBlocks.forEach(code => {
        code.style.cursor = 'pointer';
        code.title = 'Click to copy';
        code.addEventListener('click', function() {
            copyToClipboard(this.textContent);
        });
    });
});

// Preload critical resources
function preloadResources() {
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    criticalResources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadResources();
