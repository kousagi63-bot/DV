// Main UI Utilities

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Oval Header Logic
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const siteHeader = document.querySelector('.site-header');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            if (siteHeader) {
                siteHeader.classList.toggle('menu-open');
            }
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 3. Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (backToTopBtn) {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. Footer & Blog Newsletter Submission -> Clear fields & Redirect to 404
    const newsletterForms = document.querySelectorAll('.newsletter-form, .blog-newsletter-form');
    newsletterForms.forEach(form => {
        // Reset form on page load/return to ensure field is cleared
        form.reset();

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Reset the form fields (so they are cleared when going back)
            form.reset();
            
            // Redirect to 404 page
            window.location.href = '404.html';
        });
    });
});
