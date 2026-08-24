document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Only run GSAP ScrollTrigger animations on desktop/laptop (min-width: 1024px)
    ScrollTrigger.matchMedia({
        "(min-width: 1024px)": function() {
            // 1. Hero Entrance Animations (Timeline)
            const heroTl = gsap.timeline();
            heroTl.from(".shared-hero-content .cinematic-eyebrow", { 
                y: 20, 
                opacity: 0, 
                duration: 0.8, 
                ease: "power3.out", 
                delay: 0.2 
            })
            .from(".shared-hero-content .split-text", { 
                y: 40, 
                opacity: 0, 
                duration: 1, 
                ease: "power4.out" 
            }, "-=0.5")
            .from(".shared-hero-content p", { 
                y: 20, 
                opacity: 0, 
                duration: 0.8, 
                ease: "power3.out" 
            }, "-=0.6")
            .from(".shared-hero-content .breadcrumbs", { 
                y: 15, 
                opacity: 0, 
                duration: 0.8, 
                ease: "power3.out" 
            }, "-=0.5");

            gsap.from(".hero-curve", {
                y: 40,
                opacity: 0,
                duration: 1.2,
                ease: "power2.out",
                delay: 0.4
            });

            // 2. Floating Leaves Animation
            gsap.to(".floating-leaf", {
                y: "random(-25, 25)",
                x: "random(-15, 15)",
                rotation: "random(-20, 20)",
                duration: "random(4, 7)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.3
            });

            // 3. Scroll-Triggered Fade-Ups (General Elements)
            const fadeUps = document.querySelectorAll('.fade-up');
            fadeUps.forEach(elem => {
                gsap.fromTo(elem, 
                    { y: 40, opacity: 0 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        duration: 0.9, 
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: elem,
                            start: "top 85%",
                        }
                    }
                );
            });

            // 4. Global Map Dots Pop-In
            gsap.from(".map-dot", {
                scrollTrigger: {
                    trigger: ".global-map-section",
                    start: "top 70%"
                },
                scale: 0,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.8)"
            });
        }
    });

    // 5. FAQ Accordion Interactive Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const body = item.querySelector('.faq-body');
        const icon = item.querySelector('.faq-header i');

        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => {
                i.classList.remove('active');
                const ibody = i.querySelector('.faq-body');
                if (ibody) ibody.style.maxHeight = null;
                const iicon = i.querySelector('.faq-header i');
                if (iicon) iicon.className = 'fa-solid fa-plus';
            });

            if (!isOpen) {
                item.classList.add('active');
                if (body) body.style.maxHeight = body.scrollHeight + "px";
                if (icon) icon.className = 'fa-solid fa-minus';
            }
        });
    });

    // 6. Contact Form Floating Label/Focus Effect
    const inputs = document.querySelectorAll('.premium-form input, .premium-form textarea, .premium-form select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.parentElement.classList.remove('focused');
            }
        });
        // Set initial state if prefilled
        if (input.value !== '') {
            input.parentElement.classList.add('focused');
        }
    });

    // 7. Form Submission -> Clear fields & Redirect to 404
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Reset form on page load/return to ensure all fields are refreshed
        contactForm.reset();

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Reset the form fields (so they are cleared when going back)
            contactForm.reset();
            
            // Remove focused class from all input groups
            document.querySelectorAll('.premium-form .input-group').forEach(group => {
                group.classList.remove('focused');
            });

            // Redirect to 404 page
            window.location.href = '404.html';
        });
    }
});
