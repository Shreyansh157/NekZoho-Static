# NekZoho - Static Tech Consultancy Website

This repository contains the complete source code for the NekZoho static website, a modern, professional, and fully responsive landing site for a tech consultancy specializing in Zoho, web development, and digital marketing.

This site was converted from a React app to a high-performance, vanilla HTML/CSS/JS static build. It is optimized for speed, reliability, and ease of deployment.

## ✨ Key Features

- **Fully Responsive:** Looks great on all devices, from mobile phones to desktops.
- **Dark Mode Support:** Automatic and manual theme switching (light/dark) based on user preference, with settings saved to `localStorage`.
- **Multilingual (i18n):** Dynamically switches between English (EN) and Dutch (NL) using a clean JSON-based translation system in JavaScript, all on the client-side.
- **Dynamic Animations:**
  - **Hero:** A seamless, continuous rotating gradient background.
  - **Scroll Animations:** Subtle "fade-in" effects for sections as the user scrolls.
  - **Interactive Elements:** Custom hover effects and animations on buttons and service tabs.
- **Dynamic Blog System:** The blog post page (`blog-post.html`) dynamically loads content from the locale files based on a URL query parameter (`?id=...`).
- **Modern Homepage Design:** Features a high-impact hero, an infinite logo scroller, interactive service tabs, and an animated process timeline.
- **Self-Hosted & Optimized:** All core assets (Bootstrap, fonts) are self-hosted for faster performance and reliability, removing external CDN dependencies.
- **Custom Theming:** Includes a custom-styled scrollbar and a consistent, modern design language throughout the site.

## 💻 Tech Stack

- **HTML5:** For clean, semantic site structure.
- **CSS3:** For all custom styling, animations, and responsive design (Flexbox, Grid).
- **Vanilla JavaScript (ES6+):** For all interactivity, including:
_ Theme switching
_ Language toggling
_ Dynamic content loading
_ Intersection Observer for scroll animations
<!-- * **Bootstrap 5:** As the core CSS framework for layout and components. -->
- **Lucide Icons:** For clean, modern SVG icons.

## 🚀 How to Use

No build process is required. To run the website locally:

1.  Clone this repository.
2.  Open the project folder.
3.  Double-click `index.html` to open it in your browser.
