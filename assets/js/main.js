/**
 * NekZoho Static Website Main JavaScript
 *
 * This file handles:
 * 1. Theme (Light/Dark) Toggling
 * 2. Language (EN/NL) Toggling
 * 3. Fade-in on Scroll Animations
 * 4. Lucide Icon Replacement
 * 5. Dynamic Blog Post Loading (on blog-post.html)
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
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d"m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
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
   * 2. LANGUAGE TOGGLE
   * Manages 'en' and 'nl' translations from locales/*.js files.
   */
  (function initLanguageToggle() {
    const langToggleContainer = document.getElementById("language-toggle");
    // Check if translation objects exist (loaded from <script> tags in HTML)
    if (!langToggleContainer || typeof translations_en === "undefined" || typeof translations_nl === "undefined") {
      return;
    }

    const translations = {
      en: translations_en,
      nl: translations_nl,
    };

    const setLanguage = (lang) => {
      if (!translations[lang]) return;

      // Set active button style
      langToggleContainer.querySelectorAll("button[data-lang]").forEach((btn) => {
        if (btn.dataset.lang === lang) {
          btn.classList.add("btn-primary");
          btn.classList.remove("btn-outline-secondary");
          btn.disabled = true;
        } else {
          btn.classList.add("btn-outline-secondary");
          btn.classList.remove("btn-primary");
          btn.disabled = false;
        }
      });

      // Translate all elements with data-lang-key
      document.querySelectorAll("[data-lang-key]").forEach((el) => {
        const key = el.dataset.langKey;
        // Helper to get nested properties (e.g., "hero.title")
        const translation = key.split(".").reduce((obj, k) => (obj || {})[k], translations[lang]);

        if (translation !== undefined) {
          // Replace content, preserving child elements (like <span> or <br>)
          el.innerHTML = translation;
        }
      });

      // Translate all placeholder attributes
      document.querySelectorAll("[data-lang-placeholder]").forEach((el) => {
        const key = el.dataset.langPlaceholder;
        const translation = key.split(".").reduce((obj, k) => (obj || {})[k], translations[lang]);
        if (translation) {
          el.setAttribute("placeholder", translation);
        }
      });

      // Handle dynamic year in footer
      const copyrightEl = document.querySelector('[data-lang-key="footer.copyright"]');
      if (copyrightEl && translations[lang].footer?.copyright) {
        copyrightEl.innerHTML = translations[lang].footer.copyright.replace("{{year}}", new Date().getFullYear());
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
    langToggleContainer.querySelectorAll("button[data-lang]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        setLanguage(e.target.dataset.lang);
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
  (function initScrollAnimation() {
    const animatedSections = document.querySelectorAll(".fade-in-section");
    if (!("IntersectionObserver" in window)) {
      // Fallback for old browsers
      animatedSections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // Animate only once
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
      }
    );

    animatedSections.forEach((section) => {
      observer.observe(section);
    });
  })();

  /**
   * 4. LUCIDE ICON REPLACEMENT
   * Finds all elements with data-icon and replaces them with SVG.
   */
  (function initLucideIcons() {
    if (typeof lucide === "undefined") {
      console.error("Lucide icons CDN not loaded.");
      return;
    }

    // Find all elements with data-icon attribute
    const elements = document.querySelectorAll("[data-icon]");

    elements.forEach((el) => {
      const iconName = el.dataset.icon;
      if (lucide.icons[iconName]) {
        // Create the SVG node
        const iconNode = lucide.icons[iconName].node;

        // Apply attributes from the span/element
        iconNode.setAttribute("width", el.dataset.iconSize || 24);
        iconNode.setAttribute("height", el.dataset.iconSize || 24);

        // Pass through existing classes (e.g., text-primary, ms-1)
        el.getAttribute("class")
          .split(" ")
          .forEach((cls) => {
            if (cls.trim()) iconNode.classList.add(cls.trim());
          });

        // Add fill if data-icon-fill is set
        if (el.dataset.iconFill) {
          iconNode.setAttribute("fill", el.dataset.iconFill);
        }

        // Replace the placeholder <span> with the actual SVG
        el.replaceWith(iconNode);
      } else {
        console.warn(`Lucide icon not found: ${iconName}`);
      }
    });
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

    // Get post ID from URL (e.g., ?id=1)
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");

    if (!postId || !translations[lang] || !translations[lang].blogPosts) {
      if (blogContentEl) blogContentEl.style.display = "none";
      if (blogNotFoundEl) blogNotFoundEl.style.display = "block";
      return;
    }

    // Find the post in the correct language data
    const postData = translations[lang].blogPosts[postId];
    // Get image path from the 'en' data (as images are not translated)
    const postImageData = translations_en.blogPosts[postId];

    if (postData && postImageData) {
      // --- We found the post, populate the template ---
      if (blogContentEl) blogContentEl.style.display = "block";
      if (blogNotFoundEl) blogNotFoundEl.style.display = "none";

      // Set Title, Date, and Content
      document.getElementById("blog-title").innerHTML = postData.title;
      document.getElementById("blog-date").innerHTML = postData.date;
      document.getElementById("blog-content").innerHTML = postData.content;

      // Set Image
      const imgEl = document.getElementById("blog-image");
      if (imgEl) {
        // Note: Assumes images are in 'assets/images/'
        // The path in en.js is 'assets/images/blog-image-1.jpg'
        imgEl.setAttribute("src", postImageData.image);
        imgEl.setAttribute("alt", postData.title);
      }

      // Update page title
      document.title = `${postData.title} | NekZoho`;
    } else {
      // --- Post not found ---
      if (blogContentEl) blogContentEl.style.display = "none";
      if (blogNotFoundEl) blogNotFoundEl.style.display = "block";
    }
  }
}); // End DOMContentLoaded
