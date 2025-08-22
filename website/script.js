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
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting with intersection observer
    const sections = document.querySelectorAll('section[id]');
    const navLinksArray = Array.from(navLinks);

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinksArray.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Load releases and changelog
    loadReleases();
    loadChangelog();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize interactive elements
    initializeInteractiveElements();
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
    
    // Add click animations to new download buttons
    addDownloadButtonAnimations();
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
        <div class="no-releases" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">No releases available yet. Check back soon!</p>
            <a href="https://github.com/${GITHUB_REPO}/actions" class="btn btn-outline" target="_blank" rel="noopener">
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
        <div class="release-error" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">Unable to load releases. Please try again later.</p>
            <a href="https://github.com/${GITHUB_REPO}/releases" class="btn btn-outline" target="_blank" rel="noopener">
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

// Parse changelog markdown with enhanced support
function parseChangelog(text) {
    const lines = text.split('\n');
    const entries = [];
    let currentEntry = null;
    let currentSection = null;
    let inCodeBlock = false;
    let codeBlockContent = [];
    let codeBlockLanguage = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Handle code blocks
        const codeBlockMatch = line.match(/^```(\w*)?$/);
        if (codeBlockMatch) {
            if (!inCodeBlock) {
                // Starting code block
                inCodeBlock = true;
                codeBlockLanguage = codeBlockMatch[1] || '';
                codeBlockContent = [];
            } else {
                // Ending code block
                inCodeBlock = false;
                if (currentEntry && currentSection) {
                    currentEntry.sections[currentSection].push({
                        type: 'codeblock',
                        language: codeBlockLanguage,
                        content: codeBlockContent.join('\n')
                    });
                }
                codeBlockContent = [];
                codeBlockLanguage = '';
            }
            continue;
        }

        // If we're in a code block, collect content
        if (inCodeBlock) {
            codeBlockContent.push(line);
            continue;
        }

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

        // Match blockquotes
        const blockquoteMatch = line.match(/^>\s*(.+)$/);
        if (blockquoteMatch && currentEntry && currentSection) {
            currentEntry.sections[currentSection].push({
                type: 'blockquote',
                content: parseInlineMarkdown(blockquoteMatch[1])
            });
            continue;
        }

        // Match list items (including nested)
        const listMatch = line.match(/^(\s*)-\s*(.+)$/);
        if (listMatch && currentEntry && currentSection) {
            const indentLevel = Math.floor(listMatch[1].length / 2); // 2 spaces per indent level
            const content = parseInlineMarkdown(listMatch[2]);
            
            currentEntry.sections[currentSection].push({
                type: 'listitem',
                content: content,
                indent: indentLevel
            });
            continue;
        }

        // Match regular paragraphs (non-empty lines that don't match other patterns)
        if (line.trim() && currentEntry && currentSection) {
            currentEntry.sections[currentSection].push({
                type: 'paragraph',
                content: parseInlineMarkdown(line.trim())
            });
        }
    }

    if (currentEntry) {
        entries.push(currentEntry);
    }

    return entries;
}

// Parse inline markdown elements
function parseInlineMarkdown(text) {
    // Handle links [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    // Handle bold **text** or __text__
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    
    // Handle italic *text* or _text_ (but not inside words)
    text = text.replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, '<em>$1</em>');
    text = text.replace(/(?<!\w)_([^_]+)_(?!\w)/g, '<em>$1</em>');
    
    // Handle strikethrough ~~text~~
    text = text.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    
    // Handle inline code `code`
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    return text;
}

// Display parsed changelog
function displayChangelog(entries) {
    const changelogContent = document.getElementById('changelog-content');
    
    if (entries.length === 0) {
        changelogContent.innerHTML = `
            <div class="no-changelog" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
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
                    ${renderChangelogItems(items)}
                </div>
            `).join('');

        return `
            <div class="changelog-entry">
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

// Render different types of changelog items
function renderChangelogItems(items) {
    let html = '';
    let currentList = null;
    let listItems = [];

    for (const item of items) {
        // Handle different item types
        if (typeof item === 'string') {
            // Legacy string items (backward compatibility)
            if (currentList !== 'ul') {
                if (currentList) {
                    html += closeCurrentList(currentList, listItems);
                }
                currentList = 'ul';
                listItems = [];
            }
            listItems.push(`<li>${item}</li>`);
        } else if (item.type === 'listitem') {
            if (currentList !== 'ul') {
                if (currentList) {
                    html += closeCurrentList(currentList, listItems);
                }
                currentList = 'ul';
                listItems = [];
            }
            const indentClass = item.indent > 0 ? ` class="indent-${Math.min(item.indent, 3)}"` : '';
            listItems.push(`<li${indentClass}>${item.content}</li>`);
        } else {
            // Close any open list before rendering other elements
            if (currentList) {
                html += closeCurrentList(currentList, listItems);
                currentList = null;
                listItems = [];
            }

            switch (item.type) {
                case 'paragraph':
                    html += `<p class="changelog-paragraph">${item.content}</p>`;
                    break;
                case 'blockquote':
                    html += `<blockquote class="changelog-blockquote">${item.content}</blockquote>`;
                    break;
                case 'codeblock':
                    const languageClass = item.language ? ` class="language-${item.language}"` : '';
                    html += `<pre class="changelog-codeblock"><code${languageClass}>${escapeHtml(item.content)}</code></pre>`;
                    break;
            }
        }
    }

    // Close any remaining open list
    if (currentList) {
        html += closeCurrentList(currentList, listItems);
    }

    return html;
}

// Helper function to close current list
function closeCurrentList(listType, items) {
    if (listType === 'ul') {
        return `<ul class="changelog-list">${items.join('')}</ul>`;
    }
    return '';
}

// Escape HTML for code blocks
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Display changelog error
function displayChangelogError() {
    const changelogContent = document.getElementById('changelog-content');
    changelogContent.innerHTML = `
        <div class="changelog-error" style="text-align: center; padding: 2rem;">
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">Unable to load changelog. Please try again later.</p>
            <a href="https://github.com/${GITHUB_REPO}/blob/main/CHANGELOG.md" class="btn btn-outline" target="_blank" rel="noopener">
                <i class="fab fa-github"></i>
                View on GitHub
            </a>
        </div>
    `;
}

// Initialize animations
function initializeAnimations() {
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
    const animatedElements = document.querySelectorAll('.feature-card, .download-card, .step, .changelog-entry');
    animatedElements.forEach(el => observer.observe(el));
}

// Initialize interactive elements
function initializeInteractiveElements() {
    // Add click handlers for code blocks
    const codeBlocks = document.querySelectorAll('code');
    codeBlocks.forEach(code => {
        code.style.cursor = 'pointer';
        code.title = 'Click to copy';
        code.addEventListener('click', function() {
            copyToClipboard(this.textContent);
        });
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .download-card, .step');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Add download button animations
function addDownloadButtonAnimations() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
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
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
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

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize preloading
preloadResources();

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// Add loading states for better UX
function showLoadingState(element) {
    element.classList.add('loading');
    element.style.pointerEvents = 'none';
}

function hideLoadingState(element) {
    element.classList.remove('loading');
    element.style.pointerEvents = 'auto';
}

// Add smooth transitions for theme changes (if implemented later)
function addThemeTransition() {
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}
