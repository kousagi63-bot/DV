// ── Dancing hero title (standalone — does not depend on GSAP) ──
document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector('.hero-title');
    if (!title) return;

    function dance() {
        title.innerHTML = title.innerHTML
            .split(/<br\s*\/?>/i)
            .map(line => [...line].map((ch, i) =>
                ch === ' ' ? ' ' : `<span class="dancing-letter" style="animation-delay:${(i % 12) * 0.09}s">${ch}</span>`
            ).join(''))
            .join('<br>');
    }
    dance();

    // Re-apply when the hero slider replaces the title text
    new MutationObserver(() => {
        if (!title.querySelector('.dancing-letter')) dance();
    }).observe(title, { childList: true });
});

document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Fallback for mobile: immediately set counters and progress circles
    if (window.innerWidth < 1024) {
        // Set counters immediately
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = counter.getAttribute('data-target');
            if (target) {
                counter.innerText = target;
            }
        });

        // Set progress circles immediately
        const progressCircles = document.querySelectorAll('.progress-circle');
        progressCircles.forEach(circle => {
            const fill = circle.querySelector('.prog-fill');
            const val = parseInt(circle.getAttribute('data-value'));
            if (fill && !isNaN(val)) {
                const circumference = 339; // 2 * pi * 54
                const offset = circumference - (val / 100) * circumference;
                fill.style.strokeDashoffset = offset;
            }
        });

        // Make all fade elements visible by default
        const fadeElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
        fadeElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    // Only run GSAP ScrollTrigger animations on desktop/laptop (min-width: 1024px)
    ScrollTrigger.matchMedia({
        "(min-width: 1024px)": function() {
            // 1. Cinematic Text Reveal & Animations
            const fadeUps = document.querySelectorAll('.fade-up');
            fadeUps.forEach(elem => {
                gsap.fromTo(elem, 
                    { y: 50, opacity: 0 },
                    { 
                        y: 0, opacity: 1, 
                        duration: 1, 
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: elem,
                            start: "top 85%",
                        }
                    }
                );
            });

            const fadeLefts = document.querySelectorAll('.fade-left');
            fadeLefts.forEach(elem => {
                gsap.fromTo(elem, 
                    { x: 50, opacity: 0 },
                    { 
                        x: 0, opacity: 1, 
                        duration: 1, 
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: elem,
                            start: "top 85%",
                        }
                    }
                );
            });

            const fadeRights = document.querySelectorAll('.fade-right');
            fadeRights.forEach(elem => {
                gsap.fromTo(elem, 
                    { x: -50, opacity: 0 },
                    { 
                        x: 0, opacity: 1, 
                        duration: 1, 
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: elem,
                            start: "top 85%",
                        }
                    }
                );
            });

            // 4. Timeline SVG Drawing
            const timelinePath = document.querySelector('.timeline-path');
            if (timelinePath) {
                gsap.to(timelinePath, {
                    strokeDashoffset: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: '.timeline-container',
                        start: "top 60%",
                        end: "bottom 40%",
                        scrub: 1
                    }
                });
            }

            // 5. Active step highlighting on scroll
            const steps = document.querySelectorAll('.step');
            steps.forEach((step, index) => {
                ScrollTrigger.create({
                    trigger: step,
                    start: "top 70%",
                    onEnter: () => step.classList.add('active'),
                    onLeaveBack: () => step.classList.remove('active')
                });
            });

            // Counters Animation
            const counters = document.querySelectorAll('.counter');
            counters.forEach(counter => {
                ScrollTrigger.create({
                    trigger: counter,
                    start: "top 90%",
                    once: true,
                    onEnter: () => {
                        const target = parseFloat(counter.getAttribute('data-target'));
                        const isFloat = target % 1 !== 0;
                        
                        // Pop effect for the stat box
                        gsap.fromTo(counter.parentElement, 
                            { scale: 0.9, opacity: 0, y: 20 }, 
                            { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" }
                        );

                        // Longer counter animation
                        gsap.to(counter, {
                            innerHTML: target,
                            duration: 4.5,
                            snap: { innerHTML: isFloat ? 0.1 : 1 },
                            ease: "power3.out"
                        });
                    }
                });
            });

            // Progress Circles Animation
            const progressCircles = document.querySelectorAll('.progress-circle');
            progressCircles.forEach(circle => {
                ScrollTrigger.create({
                    trigger: circle,
                    start: "top 90%",
                    once: true,
                    onEnter: () => {
                        const fill = circle.querySelector('.prog-fill');
                        const val = parseInt(circle.getAttribute('data-value'));
                        const circumference = 339; // 2 * pi * 54
                        const offset = circumference - (val / 100) * circumference;
                        fill.style.strokeDashoffset = offset;
                    }
                });
            });
        }
    });

    // 3.5 Services Carousel (Active on all devices, simple transition)
    const servicesCarousel = document.querySelector('.services-carousel');
    const serviceCards = document.querySelectorAll('.service-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (servicesCarousel && serviceCards.length > 0) {
        let currentCarouselIndex = 0;
        
        function getItemsPerView() {
            return window.innerWidth > 991 ? 3 : (window.innerWidth > 768 ? 2 : 1);
        }

        function updateCarousel() {
            if (!serviceCards[0]) return;
            const cardWidth = serviceCards[0].offsetWidth + 30; // 30 is the gap
            servicesCarousel.style.transform = `translateX(-${currentCarouselIndex * cardWidth}px)`;
        }

        // Update width on resize
        window.addEventListener('resize', updateCarousel);

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const maxIndex = Math.max(0, serviceCards.length - getItemsPerView());
                if (currentCarouselIndex < maxIndex) {
                    currentCarouselIndex++;
                } else {
                    currentCarouselIndex = 0; // loop back
                }
                updateCarousel();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const maxIndex = Math.max(0, serviceCards.length - getItemsPerView());
                if (currentCarouselIndex > 0) {
                    currentCarouselIndex--;
                } else {
                    currentCarouselIndex = maxIndex; // go to end
                }
                updateCarousel();
            });
        }

        // Auto Scroll
        let autoScrollInterval;
        function startAutoScroll() {
            autoScrollInterval = setInterval(() => {
                const maxIndex = Math.max(0, serviceCards.length - getItemsPerView());
                if (currentCarouselIndex < maxIndex) {
                    currentCarouselIndex++;
                } else {
                    currentCarouselIndex = 0; // loop back
                }
                updateCarousel();
            }, 3000);
        }
        function stopAutoScroll() {
            clearInterval(autoScrollInterval);
        }
        
        startAutoScroll();
        
        servicesCarousel.addEventListener('mouseenter', stopAutoScroll);
        servicesCarousel.addEventListener('mouseleave', startAutoScroll);
        if (prevBtn) {
            prevBtn.addEventListener('mouseenter', stopAutoScroll);
            prevBtn.addEventListener('mouseleave', startAutoScroll);
        }
        if (nextBtn) {
            nextBtn.addEventListener('mouseenter', stopAutoScroll);
            nextBtn.addEventListener('mouseleave', startAutoScroll);
        }
    }

    // 6. Hero Pagination Slider (Active on all devices)
    const heroPaginationLinks = document.querySelectorAll('.hero-pagination a');
    const heroBg = document.querySelector('.hero-bg');
    const heroEyebrow = document.querySelector('.cinematic-eyebrow');
    const heroTitle = document.querySelector('.cinematic-title');
    const heroSubtitle = document.querySelector('.cinematic-subtitle');
    
    const heroSlides = [
        {
            img: "url('images/wind.webp')",
            eyebrow: "CLOUD AUTOMATION SERVICES",
            title: "AUTOMATING<br>THE FUTURE OF<br>CLOUD OPERATIONS",
            subtitle: "We deliver end-to-end DevOps automation — GitOps-driven CI/CD, Kubernetes orchestration, and Infrastructure as Code — that accelerates release cycles, scales reliably, and eliminates manual overhead."
        },
        {
            img: "url('images/smart_grid.webp')",
            eyebrow: "KUBERNETES & CONTAINERS",
            title: "SCALABLE<br>CONTAINER INFRASTRUCTURE<br>AT ANY SCALE",
            subtitle: "Our enterprise Kubernetes solutions ensure high availability, zero-downtime deployments, and seamless microservices scaling."
        },
        {
            img: "url('images/battery.webp')",
            eyebrow: "CONTINUOUS OBSERVABILITY",
            title: "PROACTIVE<br>MONITORING & ALERTING<br>IN REAL-TIME",
            subtitle: "Gain deep, real-time insights into system health and performance with automated alerts, custom dashboards, and centralized logs."
        }
    ];

    let activeHeroIndex = 0;
    let heroInterval;

    function switchHeroSlide(index) {
        if (index === activeHeroIndex || !heroBg) return;
        activeHeroIndex = index;

        // Update active class in pagination
        heroPaginationLinks.forEach(link => link.classList.remove('active'));
        if (heroPaginationLinks[index]) {
            heroPaginationLinks[index].classList.add('active');
            
            // Re-add line span to active link
            const oldLine = document.querySelector('.hero-pagination a .line');
            if (oldLine) oldLine.remove();
            const newLine = document.createElement('span');
            newLine.className = 'line';
            heroPaginationLinks[index].prepend(newLine);
        }

        const data = heroSlides[index];

        // Create temporary background for crossfade
        const tempBg = document.createElement('div');
        tempBg.style.position = 'absolute';
        tempBg.style.top = '0';
        tempBg.style.left = '0';
        tempBg.style.width = '100%';
        tempBg.style.height = '100%';
        tempBg.style.backgroundImage = data.img;
        tempBg.style.backgroundSize = 'cover';
        tempBg.style.backgroundPosition = 'center';
        tempBg.style.opacity = '0';
        tempBg.style.zIndex = '1';
        
        // Insert it right after the current background to keep it behind content
        heroBg.after(tempBg);

        // GSAP transition
        const tl = gsap.timeline();
        tl.to([heroEyebrow, heroTitle, heroSubtitle], { opacity: 0, y: 30, duration: 0.4, stagger: 0.05, ease: "power2.in" })
          .add(() => {
              if (heroEyebrow) heroEyebrow.textContent = data.eyebrow;
              if (heroTitle) heroTitle.innerHTML = data.title;
              if (heroSubtitle) heroSubtitle.textContent = data.subtitle;
          })
          .to(tempBg, { opacity: 1, duration: 0.8, ease: "power2.inOut" }, "-=0.2")
          .to([heroEyebrow, heroTitle, heroSubtitle], { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }, "-=0.6")
          .add(() => {
              heroBg.style.backgroundImage = data.img;
              tempBg.remove();
          });
    }

    if (heroPaginationLinks.length > 0) {
        heroPaginationLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                switchHeroSlide(index);
                resetHeroTimer();
            });
        });

        function startHeroTimer() {
            heroInterval = setInterval(() => {
                const nextSlideIndex = (activeHeroIndex + 1) % heroSlides.length;
                switchHeroSlide(nextSlideIndex);
            }, 6000);
        }

        function resetHeroTimer() {
            clearInterval(heroInterval);
            startHeroTimer();
        }

        startHeroTimer();
    }

    // 7. Green Technologies Tabs
    const techTabs = document.querySelectorAll('.tech-tab');
    const techImg = document.getElementById('tech-img');
    const techLabel = document.getElementById('tech-label');
    const techTitle = document.getElementById('tech-title');
    const techDesc = document.getElementById('tech-desc');
    const techFeatures = document.getElementById('tech-features');

    const techData = [
        {
            img: "pic3.webp",
            label: "CI/CD Pipelines",
            title: "Continuous Delivery Automation",
            desc: "Deliver code changes safely, quickly, and sustainably. Our pipelines automate unit testing, vulnerability scans, integration suites, and cloud deployment.",
            features: ["Multi-stage pipelines", "Automated rollbacks", "Vulnerability scanning"]
        },
        {
            img: "pic10.webp",
            label: "Kubernetes Orchestration",
            title: "Container Cluster Control",
            desc: "Orchestrate your microservices with high reliability. We configure enterprise Kubernetes clusters with automated horizontal scaling, self-healing, and service meshes.",
            features: ["Auto-scaling groups", "Zero-downtime rolling updates", "Service mesh communication"]
        },
        {
            img: "pic11.webp",
            label: "Infrastructure as Code",
            title: "Declarative Cloud Blueprinting",
            desc: "Define your entire compute, storage, and networking layers through files. We deploy immutable infrastructure using Terraform, Ansible, and GitOps pipelines.",
            features: ["Terraform blueprinting", "Immutable cloud environments", "GitOps audit trials"]
        },
        {
            img: "pic15.webp",
            label: "Observability Grid",
            title: "Full-Stack System Monitoring",
            desc: "Keep absolute tabs on your service telemetry. We integrate Prometheus, Grafana, and ELK grids to analyze metrics, traces, and centralized logs in real-time.",
            features: ["Predictive anomaly alerts", "Custom Grafana dashboards", "Centralized ELK logs"]
        }
    ];

    if (techTabs.length > 0 && techImg) {
        // Optional extra images per tab (rotate while tab is active)
        const techExtraImgs = {
            1: ["pic10.webp", "pic6.webp"],  // Container Cluster Control
            2: ["pic11.webp", "pic14.webp"]  // Declarative Cloud Blueprinting
        };
        let rotateTimer = null;
        let rotateIdx = 0;

        const stopRotation = () => { if (rotateTimer) { clearInterval(rotateTimer); rotateTimer = null; } };

        const startRotation = (tabIndex) => {
            stopRotation();
            const imgs = techExtraImgs[tabIndex];
            if (!imgs || imgs.length < 2) return;
            rotateIdx = 0;
            rotateTimer = setInterval(() => {
                rotateIdx = (rotateIdx + 1) % imgs.length;
                gsap.fromTo(techImg, { opacity: 0.4 }, { opacity: 1, duration: 0.5 });
                techImg.src = imgs[rotateIdx];
            }, 4000);
        };

        techTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                // Remove active from all
                techTabs.forEach(t => t.classList.remove('active'));
                // Add active to clicked
                tab.classList.add('active');
                stopRotation();

                // Animate content out
                gsap.to([techImg, techLabel, techTitle, techDesc, techFeatures], {
                    opacity: 0,
                    y: 10,
                    duration: 0.2,
                    onComplete: () => {
                        // Update content
                        const data = techData[index];
                        techImg.src = data.img;
                        techLabel.textContent = data.label;
                        techTitle.textContent = data.title;
                        techDesc.textContent = data.desc;

                        techFeatures.innerHTML = data.features.map(f => `<li><i class="fa-solid fa-check"></i> <span>${f}</span></li>`).join('');

                        // Animate content in
                        gsap.to([techImg, techLabel, techTitle, techDesc, techFeatures], {
                            opacity: 1,
                            y: 0,
                            duration: 0.4,
                            stagger: 0.05
                        });

                        startRotation(index);
                    }
                });
            });
        });
    }
});
