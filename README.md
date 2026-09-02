<div align="center">

# 💎 Aditya Chouhan — Luxury Portfolio Web Application

[![Live Portfolio](https://img.shields.io/badge/Live_Portfolio-aditya2438.github.io%2FPortFolio-blue?style=for-the-badge&logo=google-chrome&logoColor=white)](https://aditya2438.github.io/PortFolio/)
[![GitHub Repo](https://img.shields.io/badge/GitHub_Repository-aditya2438%2FPortFolio-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/aditya2438/PortFolio)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>An Awwwards-level, Apple-inspired single-page portfolio engineered with Liquid Glassmorphism, interactive code studios, micro-interactions, and buttery-smooth Lenis scrolling.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java_21-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring_Boot_3.3-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Apache_Kafka-231F20?style=flat-square&logo=apachekafka&logoColor=white" alt="Kafka" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/MySQL_8.0-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white" alt="GSAP" />
</p>

</div>

---

## 📱 Universal Responsiveness Across All Devices

Engineered to fit fluidly from ultra-compact foldables to 4K ultra-wide monitors:

| Device Category | Target Devices & Screen Sizes | Optimizations |
| :--- | :--- | :--- |
| **Foldables & Flips** | Samsung Galaxy Z Fold (outer/inner), Galaxy Z Flip, Pixel Fold (280px–360px) | Fluid `clamp()` typography, 1-column auto-wrapping stat & contact grids, no horizontal overflow. |
| **Smartphones** | iPhone 13/14/15/16 Pro Max, Samsung S24, Google Pixel 8 (360px–480px) | 44px+ touch targets, iOS safe-area insets (`env(safe-area-inset-top/bottom)`), fast tap response. |
| **Tablets & Mini Laptops** | iPad Air, iPad Pro, Surface Pro, Foldables Unfolded (600px–1024px) | 2-column asymmetric Bento grids, balanced 2-column skills matrix, responsive terminal. |
| **Laptops & Desktops** | MacBook Air/Pro, ThinkPad, 1080p / 1440p PC Monitors (1024px–1920px) | macOS Dynamic Island floating navbar, 3D parallax tilt on cards, interactive code tabs. |
| **Ultra-Wide Displays** | 2K / 4K / 34"+ Curved Monitors (1920px+) | Bounded container widths (`max-width: 1320px`), GPU-accelerated backdrop filters. |

---

## ⚡ High Performance & Speed

- **Zero-Config Client-Side Build:** Pure semantic HTML5 + Vanilla ES6+ JavaScript + CDN utilities.
- **DNS Prefetching & Preconnects:** Pre-established connections for Google Fonts, Tailwind, Lucide, GSAP, and Lenis.
- **GPU Acceleration:** Optimized layer composition (`will-change: transform`, `transform: translateZ(0)`).
- **Smooth Inertia Scrolling:** Lenis 1.3 smooth-wheel scrolling synced with GSAP ScrollTrigger ticker.

---

## 🚀 Flagship Projects Featured

### 1. FairCart — AI E-Commerce Aggregator & Smart Stretch Decision Engine
- **Live Demo:** [faircart-ten.vercel.app](https://faircart-ten.vercel.app/)
- **GitHub Repository:** [github.com/aditya2438/FairCart](https://github.com/aditya2438/FairCart)
- **Tech Stack:** Java 21, Spring Boot 3.3, Spring AI, Apache Kafka, Redis, PostgreSQL (3NF/ACID), Hibernate, Docker, JWT
- **Key Outcomes:**
  - Decoupled microservices with Kafka event streaming and Dead-Letter Queues (DLQ).
  - Spring AI LLM-backed dynamic deal negotiation and anomaly detection.
  - Redis distributed session caching cutting database reads by **55%** with **sub-25ms** response latency.

### 2. Fixora — On-Demand Local Service Booking & Management Platform
- **Live Demo:** [fixora-xn4k.onrender.com](https://fixora-xn4k.onrender.com)
- **GitHub Repository:** [github.com/aditya2438/Fixora](https://github.com/aditya2438/Fixora)
- **Tech Stack:** Java 21, Spring Boot 3.3, Spring Security, JJWT, MySQL 8.0 (3NF/ACID), Redis, Tailwind CSS, Docker, Render
- **Key Outcomes:**
  - Location-aware provider discovery via **Haversine algorithm** across Ujjain, Indore, and Bhopal.
  - 17 normalized (3NF) MySQL tables with composite B-Tree indexing.
  - Automated 5-stage job lifecycle pipeline deployed on Render.

---

## 📂 Project Structure

```
├── index.html                          # Semantic HTML5 luxury portfolio application
├── styles.css                          # Liquid glassmorphism, responsive rules & motion styling
├── app.js                              # Interactive terminal tabs, Lenis, filters, IST clock, confetti
├── Aditya_Singh_Chouhan_Resume.pdf     # Primary resume served by download buttons
├── Aditya_Chouhan_Resume.pdf           # Alternate resume reference
├── LICENSE                             # MIT License
├── .gitignore                          # Standard git ignore configuration
└── README.md                           # Documentation & deployment guide
```

---

## 🛠️ GitHub Pages Deployment Guide

### Option A: Push to GitHub Repository
```bash
# 1. Initialize git repository
git init

# 2. Stage and commit all files
git add .
git commit -m "feat: Production-ready luxury portfolio for all devices"

# 3. Set branch to main and attach remote
git branch -M main
git remote add origin https://github.com/aditya2438/PortFolio.git

# 4. Push to GitHub
git push -u origin main
```

### Option B: Enable GitHub Pages
1. Go to **Settings** > **Pages** in your repository: [github.com/aditya2438/PortFolio/settings/pages](https://github.com/aditya2438/PortFolio/settings/pages).
2. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
3. Select Branch: `main` and Folder: `/ (root)`.
4. Click **Save**.
5. Your live portfolio will be accessible at: **`https://aditya2438.github.io/PortFolio/`**

---

## 💻 Local Development / Preview

No complex build pipeline or node installation required:

```bash
# Using Python 3
python -m http.server 8000

# Or using npx
npx serve .
```
Then open `http://localhost:8000` in any browser or mobile simulator.

---

## 👤 Author & Contact

**Aditya Chouhan**  
*Java Backend Developer | Software Engineer*  
📍 Ujjain, Madhya Pradesh, India (IST UTC+5:30)

- **GitHub:** [@aditya2438](https://github.com/aditya2438)
- **LinkedIn:** [linkedin.com/in/adityachouhan24](https://www.linkedin.com/in/adityachouhan24)
- **Email:** [adityachouhan2446@gmail.com](mailto:adityachouhan2446@gmail.com)
- **Phone:** [+91 78802 09425](tel:+917880209425)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.


