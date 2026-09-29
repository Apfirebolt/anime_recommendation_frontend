![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

# AnimeLounge Front-End

## Introduction

**AnimeLounge** is a modern, multi-domain recommendation and analytics web application built for anime and manga enthusiasts. This repository contains the front-end client application developed with **Next.js (App Router)** and styled using **Tailwind CSS**. 

It interfaces with a high-performance FastAPI backend to deliver semantic AI vibe searches, deep head-to-head chart analytics, annual leaderboards, and granular multi-criteria catalog filtering.

Available for live demo at [https://animelounge.in](https://animelounge.in)

Feel free to explore, test, and contribute!

## Features

- **AI Vibe Search:** Natural language search interface allowing users to find titles using conversational prompts.
- **Multi-Domain Catalogs:** Dedicated discovery pages for Anime and Manga with filtering by genre, release dates, and sorting options.
- **Head-to-Head Comparison:** Side-by-side comparative analytics featuring interactive **Chart.js** Radar and Bar graphs alongside algorithmic scorecards.
- **Annual Leaderboards (Top by Year):** Curated yearly leaderboards spanning vintage classics to modern releases.
- **Dark & Light Mode:** Reactive theme switcher with persistent user preference storage.
- **Fully Responsive:** Adaptive layouts optimized for mobile devices and desktop displays.

## Technologies Used

- **Next.js (App Router):** React framework for server-side rendering, metadata optimization, and static file generation.
- **React:** JavaScript library for building responsive user interfaces.
- **Tailwind CSS:** Utility-first CSS library for custom styling and dark mode transitions.
- **Chart.js & React-Chartjs-2:** For rendering multi-metric radar and bar comparison charts.
- **Headless UI & Heroicons:** Accessible UI primitives and modern iconography.
- **Axios:** For executing HTTP communication with the FastAPI recommendation backend.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm.
- You have a running instance of the [AnimeLounge FastAPI Backend](https://github.com).

## Installation

To install the project, follow these steps:

1. Clone the repository:

    ```sh
    git clone [https://github.com/apfirebolt/animelounge_frontend.git](https://github.com/apfirebolt/animelounge_frontend.git)
    cd animelounge_frontend
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Configure your environment variables:
   Create a `.env.local` file in the root directory and set your backend API base URL:
    ```env
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
    ```

4. Start the development server:

    ```sh
    npm run dev
    ```

## Usage

To use the application, follow these steps:

1. Open your browser and navigate to `http://localhost:3000`.
2. Explore the anime and manga catalogs, test out the AI Vibe Search, or contrast two titles using the Comparison engine.

## Screenshots

### Anime Catalog & Multi-Criteria Filters
![Screenshot](/screenshots/catalog.png)

### Head-to-Head Comparison Analytics with Chart.js
![Screenshot](/screenshots/compare.png)

## Project Structure

This project uses both client-side and server-side rendering of pages. So, these components are clubbed together inside the app folder. Commonly used components have their separate folder called "components". This is how the overall structure looks like



