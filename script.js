// Loading Animation
window.addEventListener("load", function () {
  setTimeout(() => {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) {
      loadingOverlay.classList.add("hidden");
    }
  }, 1000);
});

// Slider functionality for IEEE homepage
class IEEESlider {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 4; // Only 4 unique slides
    this.sliderWrapper = document.getElementById("sliderWrapper");
    this.indicators = document.querySelectorAll(".indicator");
    this.progressBar = document.getElementById("progressBar");
    this.autoPlayInterval = null;
    this.progressInterval = null;
    this.autoPlayDuration = 5000; // 5 seconds
    this.progressDuration = 0;

    // Check if required elements exist
    if (!this.sliderWrapper || !this.progressBar) {
      console.warn("Slider elements not found");
      return;
    }

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.startAutoPlay();
    this.updateProgressBar();
  }

  setupEventListeners() {
    // Navigation arrows
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    
    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.prevSlide());
    }
    
    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.nextSlide());
    }

    // Indicators
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToSlide(index));
    });

    // Pause auto-play on hover
    const heroSection = document.querySelector(".hero");
    if (heroSection) {
      heroSection.addEventListener("mouseenter", () => this.stopAutoPlay());
      heroSection.addEventListener("mouseleave", () => this.startAutoPlay());

      // Touch/swipe support
      this.setupTouchEvents(heroSection);
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.prevSlide();
      } else if (e.key === "ArrowRight") {
        this.nextSlide();
      }
    });
  }

  setupTouchEvents(element) {
    let startX = 0;
    let endX = 0;

    element.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    element.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      const swipeThreshold = 50;
      const diff = startX - endX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    });
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlider();
    this.resetAutoPlay();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlider();
    this.resetAutoPlay();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateSlider();
    this.resetAutoPlay();
  }

  updateSlider() {
    const translateX = -this.currentSlide * 25; // 25% per slide for 4 slides
    this.sliderWrapper.style.transform = `translateX(${translateX}%)`;
    this.updateIndicators();
  }

  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentSlide);
    });
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.progressDuration = 0;

    const updateProgress = () => {
      this.progressDuration += 50;
      const progress = (this.progressDuration / this.autoPlayDuration) * 100;
      this.progressBar.style.width = `${progress}%`;

      if (this.progressDuration >= this.autoPlayDuration) {
        this.nextSlide();
        this.progressDuration = 0;
      }
    };

    this.progressInterval = setInterval(updateProgress, 50);
  }

  stopAutoPlay() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  resetAutoPlay() {
    this.startAutoPlay();
  }

  updateProgressBar() {
    this.progressBar.style.width = "0%";
  }
}

// Navigation and UI functionality
function initNavigation() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navbar = document.getElementById("navbar");

  // Mobile Navigation Toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      // Close mobile menu if open
      if (navMenu) {
        navMenu.classList.remove("active");
      }
    });
  });

  // Navbar scroll effects
  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
        navbar.style.background = "rgba(15, 23, 42, 0.98)";
      } else {
        navbar.classList.remove("scrolled");
        navbar.style.background = "rgba(15, 23, 42, 0.95)";
      }
    });
  }
}

// Scroll Animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });
}

// Counter Animation
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");
  counters.forEach((counter) => {
    const target = parseInt(counter.textContent.replace("+", ""));
    let count = 0;
    const increment = target / 50;

    const updateCount = () => {
      if (count < target) {
        count += increment;
        counter.textContent = Math.ceil(count) + (counter.textContent.includes("+") ? "+" : "");
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = target + (counter.textContent.includes("+") ? "+" : "");
      }
    };

    updateCount();
  });
}

// Initialize counter animation when about section is visible
function initCounterAnimation() {
  const aboutSection = document.querySelector(".about");
  if (aboutSection) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterObserver.observe(aboutSection);
  }
}

// Visual Effects
function initVisualEffects() {
  // Parallax Effect for Hero
  const hero = document.querySelector(".hero");
  if (hero) {
    window.addEventListener("scroll", function () {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      hero.style.transform = `translateY(${rate}px)`;
    });
  }

  // Card Hover Effects
  document.querySelectorAll(".activity-card, .achievement-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize slider
  new IEEESlider();
  
  // Initialize other functionality
  initNavigation();
  initScrollAnimations();
  initCounterAnimation();
  initVisualEffects();
});