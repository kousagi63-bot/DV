document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Fallback for mobile: immediately set counters to their target values
    if (window.innerWidth < 1024) {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = counter.getAttribute('data-target');
            if (target) {
                counter.innerText = target;
            }
        });
    }

    // Only run GSAP ScrollTrigger animations on desktop/laptop (min-width: 1024px)
    ScrollTrigger.matchMedia({
        "(min-width: 1024px)": function() {
            // Hero Animations
            const heroTl = gsap.timeline();
            heroTl.from(".about-label", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2 })
                  .from(".split-text", { y: 50, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.4")
                  .from(".about-hero-content p", { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6")
                  .from(".breadcrumbs", { y: 20, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6");

            gsap.from(".hero-curve", {
                y: 50,
                opacity: 0,
                duration: 1.5,
                ease: "power2.out",
                delay: 0.5
            });

            // Parallax Image in Our Story
            gsap.to(".parallax-img", {
                scrollTrigger: {
                    trigger: ".story-section",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                },
                y: -40,
                ease: "none"
            });

            // Floating Badge Reveal
            gsap.from(".float-anim", {
                scrollTrigger: {
                    trigger: ".story-section",
                    start: "top 60%",
                },
                scale: 0,
                rotation: -45,
                opacity: 0,
                duration: 1,
                ease: "back.out(1.5)"
            });

            // General Fade Up Elements
            const fadeElements = gsap.utils.toArray(".fade-up");
            fadeElements.forEach(el => {
                gsap.from(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                    },
                    y: 40,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                });
            });

            // Counters Animation Function
            const counters = document.querySelectorAll(".counter");
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                gsap.to(counter, {
                    scrollTrigger: {
                        trigger: counter,
                        start: "top 90%"
                    },
                    innerHTML: target,
                    duration: 2,
                    snap: { innerHTML: 1 },
                    ease: "power1.inOut",
                    onUpdate: function() {
                        counter.innerHTML = Math.round(this.targets()[0].innerHTML);
                    }
                });
            });
        }
    });

    // Interactive Team Section Logic (Active on all devices, simple click transition)
    const thumbCircles = document.querySelectorAll('.thumb-circle');
    const activeImg = document.getElementById('active-team-img');
    const activeName = document.getElementById('active-team-name');
    const activeRole = document.getElementById('active-team-role');
    const activeBio = document.getElementById('active-team-bio');

    if (thumbCircles.length > 0) {
        thumbCircles.forEach(thumb => {
            thumb.addEventListener('click', function() {
                if (this.classList.contains('active')) return;

                // Update active state on thumbnails
                thumbCircles.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Fetch new data
                const newImgSrc = this.getAttribute('data-img');
                const newNameText = this.getAttribute('data-name');
                const newRoleText = this.getAttribute('data-role');
                const newBioText = this.getAttribute('data-bio');

                // Animate out
                gsap.to([activeImg, activeName, activeRole, activeBio], {
                    opacity: 0,
                    y: 10,
                    duration: 0.2,
                    onComplete: () => {
                        // Swap content
                        if (activeImg) activeImg.src = newImgSrc;
                        if (activeName) activeName.textContent = newNameText;
                        if (activeRole) activeRole.textContent = newRoleText;
                        if (activeBio) activeBio.textContent = newBioText;
                        
                        // Animate in
                        gsap.to([activeImg, activeName, activeRole, activeBio], {
                            opacity: 1,
                            y: 0,
                            duration: 0.3,
                            stagger: 0.05
                        });
                    }
                });
            });
        });
    }
});
