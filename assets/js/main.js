/**
 * NekZoho Static Website Main JavaScript
 *
 * *** FIX: Changed to 'window.addEventListener("load", ...)' to prevent race conditions
 * with external libraries like Lucide and tsParticles. ***
 */

document.addEventListener("DOMContentLoaded", () => {
  /**
   * 1. THEME TOGGLE
   * Manages light/dark mode and persists to localStorage.
   */
  (function initThemeToggle() {
    const themeToggleBtn = document.getElementById("theme-toggle");
    if (!themeToggleBtn) return;

    // SVG icons for the button
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;

    // Function to apply the saved theme
    const applyTheme = (theme) => {
      document.documentElement.setAttribute("data-bs-theme", theme);
      themeToggleBtn.innerHTML = theme === "dark" ? sunIcon : moonIcon;
    };

    // Apply theme on initial load
    let currentTheme = localStorage.getItem("theme") || "light";
    applyTheme(currentTheme);

    // Add click listener for the toggle
    themeToggleBtn.addEventListener("click", () => {
      currentTheme = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
      localStorage.setItem("theme", currentTheme);
      applyTheme(currentTheme);
    });
  })();

  /**
   * 2. LANGUAGE TOGGLE (Dropdown Version)
   * Manages 'en' and 'nl' translations from locales/*.js files.
   */
  (function initLanguageToggle() {
    const langDropdown = document.getElementById("language-dropdown");
    if (!langDropdown || typeof translations_en === "undefined" || typeof translations_nl === "undefined") {
      return;
    }

    const currentLangBtn = document.getElementById("current-lang-btn");
    const langOptions = langDropdown.querySelectorAll(".dropdown-item[data-lang]");

    const translations = {
      en: translations_en,
      nl: translations_nl,
    };

    // Display text for the toggle button
    const langDisplay = {
      en: "EN",
      nl: "NL",
    };

    const setLanguage = (lang) => {
      if (!translations[lang] || !langDisplay[lang]) return;

      // Update the main toggle button text
      currentLangBtn.innerHTML = langDisplay[lang];

      // Hide the selected language from the dropdown list
      langOptions.forEach((btn) => {
        if (btn.dataset.lang === lang) {
          btn.classList.add("d-none"); // Hide selected language
        } else {
          btn.classList.remove("d-none"); // Show other language
        }
      });

      // Translate all elements with data-lang-key
      document.querySelectorAll("[data-lang-key]").forEach((el) => {
        const key = el.dataset.langKey;
        const translation = translations[lang][key];

        if (translation !== undefined) {
          el.innerHTML = translation;
        }
      });

      // Translate all placeholder attributes
      document.querySelectorAll("[data-lang-placeholder]").forEach((el) => {
        const key = el.dataset.langPlaceholder;
        const translation = translations[lang][key];

        if (translation) {
          el.setAttribute("placeholder", translation);
        }
      });

      // Handle dynamic year in footer
      const copyrightEl = document.querySelector('[data-lang-key="footer.copyright"]');
      if (copyrightEl && translations[lang]["footer.copyright"]) {
        copyrightEl.innerHTML = translations[lang]["footer.copyright"].replace("{{year}}", new Date().getFullYear());
      }

      // Load blog post content IF we are on the blog post page
      if (document.body.id === "blog-post-page") {
        loadBlogPost(lang);
      }

      // Save preference and update document language
      localStorage.setItem("language", lang);
      document.documentElement.lang = lang;
    };

    // Add click listeners for language buttons
    langOptions.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        setLanguage(e.currentTarget.dataset.lang);
      });
    });

    // Set language on initial load
    let currentLang = localStorage.getItem("language") || "en";
    setLanguage(currentLang);
  })();

  /**
   * 3. FADE-IN ANIMATION ON SCROLL
   * Uses IntersectionObserver to add 'is-visible' class.
   */
  // (function initScrollAnimation() {
  //   const animatedSections = document.querySelectorAll(".fade-in-section");
  //   if (!("IntersectionObserver" in window)) {
  //     // Fallback for old browsers
  //     animatedSections.forEach((section) => section.classList.add("is-visible"));
  //     return;
  //   }

  //   const observer = new IntersectionObserver(
  //     (entries, observer) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           entry.target.classList.add("is-visible");
  //           observer.unobserve(entry.target); // Animate only once
  //         }
  //       });
  //     },
  //     {
  //       threshold: 0.1, // Trigger when 10% of the section is visible
  //     }
  //   );

  //   animatedSections.forEach((section) => {
  //     observer.observe(section);
  //   });
  // })();

  /**
   * 3. GSAP ANIMATIONS
   * Replaces the old IntersectionObserver with GSAP & ScrollTrigger.
   */
  (function initGsapAnimations() {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.error("GSAP or ScrollTrigger not loaded.");
      return;
    }

    // Register the plugin
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. Hero Section (On Load) ---
    gsap.from("#home-hero h1", { duration: 1, y: 50, opacity: 0, delay: 0.2, ease: "power3.out" });
    gsap.from("#home-hero p", { duration: 1, y: 50, opacity: 0, delay: 0.4, ease: "power3.out" });
    gsap.from("#home-hero .btn", { duration: 1, y: 50, opacity: 0, delay: 0.6, stagger: 0.2, ease: "power3.out" });

    // --- 2. Generic Header Animation ---
    // We can animate all section headers as they scroll into view
    const sectionHeaders = document.querySelectorAll(".section-padding .text-center, #about h2");
    sectionHeaders.forEach((header) => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: "top 85%", // Trigger when 85% from the top
          toggleActions: "play none none none", // Play animation once
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    });

    // --- 3. About Section (#about) ---
    gsap.from("#about .col-lg-6:first-child", {
      // Text column
      scrollTrigger: { trigger: "#about", start: "top 80%" },
      x: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
    gsap.from("#about .about-image-col", {
      // Image column
      scrollTrigger: { trigger: "#about", start: "top 80%" },
      x: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
    gsap.from(".about-experience-box", {
      // Pop-up box
      scrollTrigger: { trigger: ".about-image-col", start: "top 60%" },
      scale: 0.5,
      opacity: 0,
      duration: 0.5,
      delay: 0.5,
      ease: "back.out(1.7)",
    });

    // --- 4. Services Section (#services) ---
    gsap.from(".service-tabs .nav-link", {
      // Stagger tabs
      scrollTrigger: { trigger: ".service-tabs", start: "top 80%" },
      x: -50,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(".tab-content", {
      // Fade in content
      scrollTrigger: { trigger: ".tab-content", start: "top 80%" },
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: "power2.out",
    });

    // --- 5. Process Section (#process) ---
    gsap.from(".timeline-item", {
      // Stagger timeline items
      scrollTrigger: { trigger: ".process-timeline", start: "top 80%" },
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "power3.out",
    });

    // --- 6. Industries Section (#industries) ---
    gsap.from("#industries .scroller", {
      // The scroller itself
      scrollTrigger: { trigger: "#industries .scroller", start: "top 90%" },
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // --- 7. Testimonials Section (#testimonials) ---
    gsap.from("#testimonialCarousel", {
      // The carousel
      scrollTrigger: { trigger: "#testimonialCarousel", start: "top 80%" },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // --- 8. Why Choose Us Section (#why-choose-us) ---
    gsap.from("#why-choose-us .row.g-4 > .col-lg-4", {
      // Stagger features
      scrollTrigger: { trigger: "#why-choose-us .row.g-4", start: "top 80%" },
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "power3.out",
    });

    // --- 9. Blog Section (#blog) ---
    gsap.from("#blog .row.g-4 > .col-lg-4", {
      // Stagger blog cards
      scrollTrigger: { trigger: "#blog .row.g-4", start: "top 80%" },
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "power3.out",
    });

    // --- 10. CTA Section (#contact) ---
    gsap.from("#contact", {
      // Final CTA
      scrollTrigger: { trigger: "#contact", start: "top 90%" },
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  })();

  /**
   * 4. LUCIDE ICON REPLACEMENT
   * Finds elements with data-icon, converts them to data-lucide,
   * and calls the official lucide.createIcons() function.
   */
  (function initLucideIcons() {
    if (typeof lucide === "undefined") {
      console.error("Lucide icons CDN not loaded.");
      return;
    }

    const elements = document.querySelectorAll("[data-icon]");

    elements.forEach((el) => {
      const iconName = el.dataset.icon;
      const kebabCaseName = iconName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
      el.setAttribute("data-lucide", kebabCaseName);

      if (el.dataset.iconSize) {
        el.setAttribute("width", el.dataset.iconSize);
        el.setAttribute("height", el.dataset.iconSize);
      }
      if (el.dataset.iconFill) {
        el.setAttribute("fill", el.dataset.iconFill);
      }

      el.removeAttribute("data-icon");
      if (el.dataset.iconSize) el.removeAttribute("data-icon-size");
      if (el.dataset.iconFill) el.removeAttribute("data-icon-fill");
    });

    lucide.createIcons();
  })();

  /**
   * 5. DYNAMIC BLOG POST LOADER (for blog-post.html)
   * This function is called by the language toggle.
   */
  function loadBlogPost(lang) {
    if (document.body.id !== "blog-post-page") return; // Only run on blog post page

    const translations = { en: translations_en, nl: translations_nl };
    const blogContentEl = document.getElementById("blog-post-content");
    const blogNotFoundEl = document.getElementById("blog-not-found");

    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");

    if (!postId || !translations[lang] || !translations[lang].blogPosts) {
      if (blogContentEl) blogContentEl.style.display = "none";
      if (blogNotFoundEl) blogNotFoundEl.style.display = "block";
      return;
    }

    const postData = translations[lang].blogPosts[postId];
    const postImageData = translations_en.blogPosts[postId];

    if (postData && postImageData) {
      if (blogContentEl) blogContentEl.style.display = "block";
      if (blogNotFoundEl) blogNotFoundEl.style.display = "none";

      document.getElementById("blog-title").innerHTML = postData.title;
      document.getElementById("blog-date").innerHTML = postData.date;
      document.getElementById("blog-content").innerHTML = postData.content;

      const imgEl = document.getElementById("blog-image");
      if (imgEl) {
        imgEl.setAttribute("src", postImageData.image);
        imgEl.setAttribute("alt", postData.title);
      }
      document.title = `${postData.title} | NekZoho`;
    } else {
      if (blogContentEl) blogContentEl.style.display = "none";
      if (blogNotFoundEl) blogNotFoundEl.style.display = "block";
    }
  }
}); // End DOMContentLoaded
