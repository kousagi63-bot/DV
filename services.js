// Services Page GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Helper function to split text into characters/words for cinematic titles
function splitText(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        const text = el.innerText;
        el.innerHTML = '';
        
        // Split by words
        const words = text.split(/\s+/);
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.overflow = 'hidden';
            wordSpan.style.marginRight = '12px';
            
            const innerSpan = document.createElement('span');
            innerSpan.style.display = 'inline-block';
            innerSpan.innerHTML = word;
            innerSpan.classList.add('split-char'); // Can animate whole words or characters
            
            wordSpan.appendChild(innerSpan);
            el.appendChild(wordSpan);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    
    // Fallback for mobile: immediately set counters and reveal cards
    if (window.innerWidth < 1024) {
        const counters = document.querySelectorAll('.why-stats-row .counter');
        counters.forEach(counter => {
            const target = counter.getAttribute('data-target');
            if (target) {
                counter.innerText = target;
            }
        });

        const cards = document.querySelectorAll('.showcase-card');
        cards.forEach(card => {
            card.classList.add('revealed');
        });
    }

    // Only run GSAP ScrollTrigger animations on desktop/laptop (min-width: 1024px)
    ScrollTrigger.matchMedia({
        "(min-width: 1024px)": function() {
            // 1. Hero Animations
            splitText('.split-title');
            
            const heroTl = gsap.timeline();
            
            // Animate hero label
            heroTl.fromTo('.services-hero .hero-label', 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
            );
            
            // Animate title words up
            heroTl.fromTo('.services-hero .split-char', 
                { y: '100%' }, 
                { y: '0%', duration: 1, stagger: 0.08, ease: "power4.out" },
                "-=0.6"
            );
            
            // Fade up description and breadcrumbs
            heroTl.fromTo('.services-hero .hero-desc, .services-hero .breadcrumb-nav', 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
                "-=0.6"
            );

            // Parallax on Hero Background
            gsap.to('.hero-bg-img', {
                yPercent: 20,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.services-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });

            // 2. Horizontal Services Showcase (Desktop Only, >992px)
            const showcaseSection = document.getElementById('showcase-section');
            const horizontalTrack = document.getElementById('horizontal-track');
            const progressBar = document.getElementById('progress-bar');
            const cards = document.querySelectorAll('.showcase-card');

            if (showcaseSection && horizontalTrack) {
                // Calculate total horizontal scroll distance
                const getScrollAmount = () => {
                    let trackWidth = horizontalTrack.scrollWidth;
                    return -(trackWidth - window.innerWidth);
                };

                // Pin and scroll horizontally
                const scrollTween = gsap.to(horizontalTrack, {
                    x: getScrollAmount,
                    ease: "none",
                    scrollTrigger: {
                        trigger: showcaseSection,
                        start: "top top",
                        end: () => `+=${horizontalTrack.scrollWidth - window.innerWidth}`,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                        onUpdate: (self) => {
                            // Update progress bar width
                            if (progressBar) {
                                progressBar.style.width = `${self.progress * 100}%`;
                            }
                        }
                    }
                });

                // Animate Image Reveal and Card Scale on entry
                cards.forEach(card => {
                    gsap.to(card, {
                        scrollTrigger: {
                            trigger: card,
                            containerAnimation: scrollTween,
                            start: "left 85%",
                            toggleActions: "play none none reverse",
                            onEnter: () => {
                                card.classList.add('revealed');
                            }
                        }
                    });
                });
            }

            // 3. SVG Timeline Drawing (Desktop Only)
            const activePath = document.getElementById('active-path');
            if (activePath) {
                // Get path length
                const pathLength = activePath.getTotalLength();
                
                // Set up dash properties
                activePath.style.strokeDasharray = pathLength;
                activePath.style.strokeDashoffset = pathLength;

                gsap.to(activePath, {
                    strokeDashoffset: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".vertical-timeline-wrapper",
                        start: "top 35%",
                        end: "bottom 65%",
                        scrub: 1
                    }
                });
            }

            // Animate timeline steps
            const steps = document.querySelectorAll('.fade-up-step');
            steps.forEach(step => {
                gsap.fromTo(step, 
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: step,
                            start: "top 80%"
                        }
                    }
                );
            });

            // 4. Why Choose Us Animations
            // Left column image fade-right
            gsap.fromTo('.why-left',
                { x: -50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: '.why-choose-services-section',
                        start: "top 75%"
                    }
                }
            );

            // Right column features stagger
            gsap.fromTo('.why-feature-card',
                { x: 50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: '.why-right',
                        start: "top 75%"
                    }
                }
            );

            // Stats Counter Animation
            const counters = document.querySelectorAll('.why-stats-row .counter');
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const countObj = { val: 0 };
                
                gsap.to(countObj, {
                    val: target,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: '.why-stats-row',
                        start: "top 85%",
                        toggleActions: "play none none none"
                    },
                    onUpdate: () => {
                        counter.innerText = Math.ceil(countObj.val);
                    }
                });
            });

            // Fade up stats row container
            gsap.fromTo('.why-stats-row',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: '.why-stats-row',
                        start: "top 90%"
                    }
                }
            );

            // 5. CTA Animations
            gsap.fromTo('.services-cta-section .fade-up',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: '.services-cta-section',
                        start: "top 75%"
                    }
                }
            );
        }
    });
});
