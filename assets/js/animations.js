document.addEventListener("DOMContentLoaded", () => {
  /**
   * GSAP ANIMATIONS
   * Contains all GSAP and ScrollTrigger animations for the site.
   */
  (function initGsapAnimations() {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.error("GSAP or ScrollTrigger not loaded.");
      return;
    }

    // Register the plugin
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".hero-background-image", { scale: 1.1 }, { scale: 1, duration: 1.5, ease: "power2.out" });

    // --- 1. Hero Section (On Load) ---
    gsap.from("#new-hero h1", { duration: 1, y: 50, opacity: 0, delay: 0.2, ease: "power3.out" });
    gsap.from("#new-hero p", { duration: 1, y: 50, opacity: 0, delay: 0.4, ease: "power3.out" });
    gsap.from("#new-hero .btn", { duration: 1, y: 50, opacity: 0, delay: 0.6, stagger: 0.2, ease: "power3.out" });

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

    // --- 3b. Core Values Section (about.html) ---

    // First, set the initial invisible state using JS
    // We target the *column* wrapper, not the card itself, for more reliability
    gsap.set("#core-values .row.g-4 > .col-lg-3", {
      // <-- NEW SELECTOR
      opacity: 0,
      y: 30,
      visibility: "hidden",
    });

    // Now, animate TO the final visible state when scrolled
    gsap.to("#core-values .row.g-4 > .col-lg-3", {
      // <-- NEW SELECTOR
      scrollTrigger: {
        trigger: "#core-values .row.g-4", // Trigger on the card's row
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
      duration: 0.6,
      autoAlpha: 1,
      y: 0,
      stagger: 0.15,
      ease: "power3.out",
    });

    // --- 3c. Meet the Team Section (about.html) ---
    gsap.to("#team-section .team-card", {
      // Animate to visible
      scrollTrigger: {
        trigger: "#team-section .row.g-4", // Trigger on the card's row
        start: "top 80%",
        toggleActions: "play none none none",
        once: true,
      },
      duration: 0.6,
      autoAlpha: 1, // Fades in and sets visibility
      y: 0, // Moves up to original position
      stagger: 0.1, // A bit faster stagger for all the cards
      ease: "power3.out",
    });

    // --- 4. Services Section (#services) ---
    gsap.from(".service-tabs ", {
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

    // NEW: Animate the timeline bar itself
    gsap.to(".process-timeline", {
      scrollTrigger: {
        trigger: ".process-timeline",
        start: "top 70%", // Start animation slightly before items
        toggleActions: "play none none none",
      },
      // Animate both CSS variables
      "--timeline-progress-h": 1, // For horizontal (desktop)
      "--timeline-progress-v": "100%", // For vertical (mobile)
      duration: 0.2,
      ease: "power2.out",
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
    gsap.from("#why-choose-us .row.g-4 > .col-lg-4 .d-flex", {
      // Changed selector to .d-flex
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
    // Set initial state for children elements
    gsap.set("#contact h2, #contact p, #contact .btn", {
      opacity: 0,
      y: 30,
      visibility: "hidden",
    });

    // Animate to final state with a stagger
    gsap.to("#contact h2, #contact p, #contact .btn", {
      scrollTrigger: {
        trigger: "#contact",
        start: "top 90%", // Start when 10% of it is visible
        toggleActions: "play none none none",
        once: true,
      },
      duration: 0.8, // Duration for each item
      autoAlpha: 1, // Fades in and sets visibility
      y: 0, // Moves up to original position
      stagger: 0.2, // Stagger each item by 0.2s
      ease: "power3.out",
    });

    // --- 11. Services Page - Cards (services.html) ---
    // Set initial state
    gsap.set("#services .service-card", {
      opacity: 0,
      y: 30,
      visibility: "hidden",
    });
    // Animate to final state
    gsap.to("#services .service-card", {
      scrollTrigger: {
        trigger: "#services .row.g-4",
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
      duration: 0.6,
      autoAlpha: 1,
      y: 0,
      stagger: 0.1,
      ease: "power3.out",
    });

    // --- 12. Services Page - Process (services.html) ---
    // Set initial state
    gsap.set("#process .row.g-5 > .col-lg-4", {
      opacity: 0,
      y: 30,
      visibility: "hidden",
    });
    // Animate to final state
    gsap.to("#process .row.g-5 > .col-lg-4", {
      scrollTrigger: {
        trigger: "#process .row.g-5",
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
      duration: 0.6,
      autoAlpha: 1,
      y: 0,
      stagger: 0.1,
      ease: "power3.out",
    });

    // --- 13. Blogs Page - Cards (blogs.html) ---
    // Set initial state
    gsap.set("#blog-cards-grid .col-lg-4", {
      opacity: 0,
      y: 30,
      visibility: "hidden",
    });
    // Animate to final state
    gsap.to("#blog-cards-grid .col-lg-4", {
      scrollTrigger: {
        trigger: "#blog-cards-grid",
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
      duration: 0.6,
      autoAlpha: 1,
      y: 0,
      stagger: 0.1,
      ease: "power3.out",
    });

    // --- 13. Contact Page - Form Section ---
    // Selects header elements AND the form wrapper to animate them in sequence
    const contactFormElements = document.querySelectorAll("#contact-page .text-center > *, #contact-form-wrapper");

    if (contactFormElements.length > 0) {
      gsap.set(contactFormElements, {
        opacity: 0,
        y: 30,
        visibility: "hidden",
      });

      gsap.to(contactFormElements, {
        scrollTrigger: {
          trigger: "#contact-page",
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
        duration: 0.8,
        autoAlpha: 1,
        y: 0,
        stagger: 0.2, // Smooth flow from title -> subtitle -> form
        ease: "power3.out",
      });
    }

    // --- 14. Contact Page - Around the World Section ---
    // Selects header elements AND all location cards
    const locationElements = document.querySelectorAll("#around-the-world .text-center > *, #around-the-world .location-card");

    if (locationElements.length > 0) {
      gsap.set(locationElements, {
        opacity: 0,
        y: 30,
        visibility: "hidden",
      });

      gsap.to(locationElements, {
        scrollTrigger: {
          trigger: "#around-the-world",
          start: "top 80%", // Start slightly earlier
          toggleActions: "play none none none",
          once: true,
        },
        duration: 0.6,
        autoAlpha: 1,
        y: 0,
        stagger: 0.15, // Smooth flow from title -> subtitle -> card 1 -> card 2...
        ease: "power3.out",
      });
    }
  })();
});
