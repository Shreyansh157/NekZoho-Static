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
   * 4. LUCIDE ICON REPLACEMENT
   * Finds elements with data-icon, converts them to data-lucide,
   * and calls the official lucide.createIcons() function.
   * * *** MUST RUN BEFORE SCROLLER INIT ***
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
   * 5. INFINITE SCROLLER
   * Clones scroller content to create a seamless loop.
   * * *** MUST RUN BEFORE GSAP INIT ***
   */
  (function initInfiniteScroller() {
    const scrollers = document.querySelectorAll(".scroller");
    if (!scrollers) return;

    scrollers.forEach((scroller) => {
      const scrollerInner = scroller.querySelector(".scroller__inner");
      if (scrollerInner) {
        const scrollerContent = Array.from(scrollerInner.children);

        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          duplicatedItem.setAttribute("aria-hidden", true);
          scrollerInner.appendChild(duplicatedItem);
        });

        // Add the animation class AFTER cloning
        scrollerInner.classList.add("scrolling");
      }
    });
  })();

  /**
   * 7. DYNAMIC BLOG POST LOADER (for blog-post.html)
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
    const postImageData = translations_en.blogPosts[postId]; // Always get image from EN

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

  /**
   * 8. DYNAMIC SERVICE MODAL (for services.html)
   * Populates the modal with content from the card that was clicked.
   */
  /**
   * 8. DYNAMIC SERVICE MODAL (for services.html)
   * Populates the modal with content from the card that was clicked.
   */
  (function initServiceModal() {
    const serviceModal = document.getElementById("serviceModal");
    if (!serviceModal) return;

    serviceModal.addEventListener("show.bs.modal", function (event) {
      // Button that triggered the modal
      const button = event.relatedTarget;

      // Get the card body
      const cardBody = button.closest(".card-body");

      // Get the keys from the button and card
      const titleKey = cardBody.querySelector("h3").dataset.langKey;
      const modalKey = button.dataset.modalKey; // Get the new modal content key

      // Get current language from localStorage
      const lang = localStorage.getItem("language") || "en";
      const translations = lang === "nl" ? translations_nl : translations_en;

      // Find the modal's title and body
      const modalTitle = serviceModal.querySelector("#serviceModalLabel");
      const modalBody = serviceModal.querySelector("#serviceModalBody");

      // Helper function to safely get nested keys (e.g., "serviceModals.s1")
      const getNestedKey = (obj, path) => {
        return path.split(".").reduce((acc, key) => (acc && acc[key] ? acc[key] : null), obj);
      };

      // Populate the modal title
      if (translations[titleKey]) {
        modalTitle.innerHTML = translations[titleKey];
      } else {
        modalTitle.innerHTML = "Service Details"; // Fallback
      }

      // Populate the modal body
      const modalContent = getNestedKey(translations, modalKey);
      if (modalContent) {
        modalBody.innerHTML = modalContent;
      } else {
        // Fallback if the detailed key isn't found
        const descKey = cardBody.querySelector("p").dataset.langKey;
        modalBody.innerHTML = translations[descKey] || "More details coming soon.";
      }
    });
  })();
}); // End DOMContentLoaded
