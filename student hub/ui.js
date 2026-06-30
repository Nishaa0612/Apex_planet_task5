document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // 2. Dark/Light mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = localStorage.getItem('theme');
    
    // Apply dark mode if user selected it before, or if system preference is dark and no local storage is set
    if (currentTheme === 'dark' || (!currentTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        if(themeToggle) themeToggle.textContent = '☀️';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            let theme = 'light';
            if (document.body.classList.contains('dark-mode')) {
                theme = 'dark';
                themeToggle.textContent = '☀️';
            } else {
                themeToggle.textContent = '🌙';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // 3. Back to Top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 4. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 5. Modal popup
    const modalBtn = document.getElementById('modal-btn');
    const modal = document.getElementById('my-modal');
    if (modalBtn && modal) {
        const closeBtn = modal.querySelector('.close');
        
        modalBtn.addEventListener('click', () => {
            modal.classList.add('show');
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    // 6. Image Slider/Carousel
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;
        const nextBtn = document.querySelector('.slider-next');
        const prevBtn = document.querySelector('.slider-prev');
        
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.transform = `translateX(${100 * (i - index)}%)`;
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);
        }
        
        // Auto-play
        let slideInterval = setInterval(nextSlide, 4000);

        // Pause on hover
        sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
        sliderContainer.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 4000));

        showSlide(0);
    }

    // 7. Form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        
        function validateField(input, regex, errorMsg) {
            const errorElement = input.nextElementSibling;
            if (!regex.test(input.value)) {
                input.classList.add('error');
                errorElement.textContent = errorMsg;
                errorElement.style.display = 'block';
                return false;
            } else {
                input.classList.remove('error');
                errorElement.style.display = 'none';
                return true;
            }
        }

        const nameRegex = /^[a-zA-Z\s]{2,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s-]{10,}$/;

        nameInput.addEventListener('input', () => validateField(nameInput, nameRegex, 'Name must be at least 2 characters long.'));
        emailInput.addEventListener('input', () => validateField(emailInput, emailRegex, 'Please enter a valid email address.'));
        phoneInput.addEventListener('input', () => validateField(phoneInput, phoneRegex, 'Please enter a valid phone number.'));

        contactForm.addEventListener('submit', (e) => {
            const isNameValid = validateField(nameInput, nameRegex, 'Name must be at least 2 characters long.');
            const isEmailValid = validateField(emailInput, emailRegex, 'Please enter a valid email address.');
            const isPhoneValid = validateField(phoneInput, phoneRegex, 'Please enter a valid phone number.');
            
            if (!isNameValid || !isEmailValid || !isPhoneValid) {
                e.preventDefault();
            } else {
                e.preventDefault();
                alert('Form submitted successfully!');
                contactForm.reset();
            }
        });
    }

    // 8. Animated counters
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = +entry.target.getAttribute('data-target');
                    let count = 0;
                    const speed = 100; // lower is slower
                    const inc = target / speed;
                    
                    const updateCount = () => {
                        count += inc;
                        if (count < target) {
                            entry.target.innerText = Math.ceil(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            entry.target.innerText = target;
                        }
                    };
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
});
