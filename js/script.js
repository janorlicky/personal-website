// Main JavaScript file
console.log('Personal website script loaded successfully!');

// Performance optimization: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling wrapper
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    // You could add error reporting service here
}

// Document ready event
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Add loading class to body
        document.body.classList.add('loading');

        // Initialize all features
        initializeMobileMenu();
        initializeScrollTopButton();
        initializeIntersectionObserver();
        initializeSmoothScroll();

        // Remove loading class when everything is ready
        window.addEventListener('load', () => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        });
    } catch (error) {
        handleError(error, 'page initialization');
    }
});

// DOM Elements
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');
const mobileMenuBtn = document.createElement('button');
const scrollTopBtn = document.createElement('button');

// Mobile Menu Setup
function initializeMobileMenu() {
    try {
        if (!mobileMenuBtn) return;

        // Create mobile menu button
        mobileMenuBtn.classList.add('mobile-menu-btn');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        header.querySelector('nav').prepend(mobileMenuBtn);

        // Add mobile menu styles
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .nav-links {
                    position: fixed;
                    top: var(--header-height);
                    left: 0;
                    right: 0;
                    background: white;
                    padding: 1rem;
                    flex-direction: column;
                    align-items: center;
                    transform: translateY(-100%);
                    transition: transform 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .nav-links.active {
                    transform: translateY(0);
                }
                
                .mobile-menu-btn {
                    display: block;
                    background: none;
                    border: none;
                    color: var(--primary-color);
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                }
                
                .nav-links li {
                    margin: 1rem 0;
                }
            }
            
            @media (min-width: 769px) {
                .mobile-menu-btn {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);

        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            const nav = document.querySelector('.nav-links');
            nav.classList.toggle('active');
            mobileMenuBtn.innerHTML = nav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const nav = document.querySelector('.nav-links');
                nav.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', false);
            }
        });
    } catch (error) {
        handleError(error, 'mobile menu initialization');
    }
}

// Scroll to Top Button
function initializeScrollTopButton() {
    try {
        if (!scrollTopBtn) return;

        // Create and style the button
        scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollTopBtn.classList.add('scroll-top-btn');
        document.body.appendChild(scrollTopBtn);

        // Add button styles
        const style = document.createElement('style');
        style.textContent = `
            .scroll-top-btn {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: var(--primary-color);
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                z-index: 1000;
            }
            
            .scroll-top-btn.visible {
                opacity: 1;
                visibility: visible;
            }
            
            .scroll-top-btn:hover {
                background: var(--secondary-color);
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);

        // Show/hide button based on scroll position
        const showScrollTop = debounce(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            scrollTopBtn.style.display = scrollTop > 500 ? 'block' : 'none';
        }, 100);

        window.addEventListener('scroll', showScrollTop);

        // Scroll to top on click
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    } catch (error) {
        handleError(error, 'scroll top initialization');
    }
}

// Intersection Observer for Section Animations
function initializeIntersectionObserver() {
    try {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add fade-in animation
                    entry.target.classList.add('fade-in');
                    
                    // Update active navigation
                    const id = entry.target.getAttribute('id');
                    updateActiveNav(id);
                }
            });
        }, options);

        // Observe all sections
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    } catch (error) {
        handleError(error, 'intersection observer initialization');
    }
}

// Update active navigation
function updateActiveNav(sectionId) {
    try {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    } catch (error) {
        handleError(error, 'active navigation update');
    }
}

// Smooth Scroll and Active Section Highlighting
function initializeSmoothScroll() {
    try {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Close mobile menu if open
                    const nav = document.querySelector('.nav-links');
                    if (nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        mobileMenuBtn.setAttribute('aria-expanded', false);
                    }

                    // Update URL without page reload
                    history.pushState(null, null, targetId);
                }
            });
        });
    } catch (error) {
        handleError(error, 'smooth scroll initialization');
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetSection = document.querySelector(hash);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    });
}

// Handle offline/online status
window.addEventListener('online', () => {
    showMessage('You are back online!', 'success');
});

window.addEventListener('offline', () => {
    showMessage('You are offline. Some features may be limited.', 'error');
});

// Utility function to show messages
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Add styles for active navigation
const navStyle = document.createElement('style');
navStyle.textContent = `
    .nav-links a {
        position: relative;
    }
    
    .nav-links a::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background: var(--accent-color);
        transition: width 0.3s ease;
    }
    
    .nav-links a:hover::after,
    .nav-links a.active::after {
        width: 100%;
    }
    
    .nav-links a.active {
        color: var(--accent-color);
    }
`;
document.head.appendChild(navStyle); 