// Blog Page GSAP Animations
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // Fallback for mobile: immediately scale reveal wipes to 0 and make elements visible
    if (window.innerWidth < 1024) {
        const reveals = document.querySelectorAll('.featured-img-reveal, .card-img-reveal');
        reveals.forEach(reveal => {
            reveal.style.transform = 'scaleX(0)';
        });

        const fadeElements = document.querySelectorAll('.featured-text > *, .topic-card, .editorial-card, .newsletter-left > *, .newsletter-right-visual, .cta-full-width > *');
        fadeElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    // Only run GSAP ScrollTrigger animations on desktop/laptop (min-width: 1024px)
    ScrollTrigger.matchMedia({
        "(min-width: 1024px)": function() {
            // 1. Featured Story - Image reveal wipe
            gsap.fromTo('.featured-img-reveal',
                { scaleX: 1 },
                {
                    scaleX: 0,
                    duration: 1.2,
                    ease: 'power4.inOut',
                    scrollTrigger: {
                        trigger: '.featured-story-section',
                        start: 'top 70%'
                    }
                }
            );

            // Featured Story - Text stagger
            gsap.fromTo('.featured-text > *',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.featured-text',
                        start: 'top 75%'
                    }
                }
            );

            // 2. Trending Topics - horizontal stagger reveal
            gsap.fromTo('.topic-card',
                { x: 60, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.trending-topics-section',
                        start: 'top 75%'
                    }
                }
            );

            // 3. Editorial Cards - stagger + image reveal
            const editorialCards = document.querySelectorAll('.editorial-card');
            editorialCards.forEach(card => {
                // Fade up the card
                gsap.fromTo(card,
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.9,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%'
                        }
                    }
                );

                // Image reveal wipe
                const reveal = card.querySelector('.card-img-reveal');
                if (reveal) {
                    gsap.fromTo(reveal,
                        { scaleX: 1 },
                        {
                            scaleX: 0,
                            duration: 1,
                            ease: 'power4.inOut',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 80%'
                            }
                        }
                    );
                }
            });

            // 4. Newsletter CTA
            gsap.fromTo('.newsletter-left > *',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.blog-newsletter-cta-section',
                        start: 'top 70%'
                    }
                }
            );

            gsap.fromTo('.newsletter-right-visual',
                { x: 60, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.blog-newsletter-cta-section',
                        start: 'top 70%'
                    }
                }
            );

            gsap.fromTo('.cta-full-width > *',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.cta-full-width',
                        start: 'top 80%'
                    }
                }
            );
        }
    });

    // 5. Creative Floating Animation for Newsletter Image (Active on all devices, simple transition)
    gsap.to(".newsletter-right-visual img", {
        y: -15,
        rotation: 3,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
});
