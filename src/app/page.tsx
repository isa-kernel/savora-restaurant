
"use client";

import { useLayoutEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./globals.css";

const FoodScene3D = dynamic(
  () => import("./components/FoodScene3D"),
  {
    ssr: false,
    loading: () => (
      <div className="scene-loading">
        Preparing the dining experience...
      </div>
    ),
  }
);

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const experienceRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  // Shared scroll progress for the 3D food scene.
  const progressRef = useRef(0);

  useLayoutEffect(() => {
    const experience = experienceRef.current;
    const intro = introRef.current;
    const story = storyRef.current;

    if (!experience || !intro || !story) {
      return;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: experience,
          start: "top top",
          end: "+=1800",
          scrub: true,
          pin: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });

      // Scene 1: The introductory heading fades away.
      timeline.to(
        intro,
        {
          opacity: 0,
          y: -45,
          duration: 0.6,
          ease: "none",
        },
        0.5
      );

      // Scene 2: The restaurant story appears.
      timeline.fromTo(
        story,
        {
          opacity: 0,
          x: 45,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "none",
        },
        2
      );
    }, experience);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <main className="restaurant">
      {/* Navigation */}
      <header className="navigation">
        <a href="#home" className="logo">
          SAVORA<span>.</span>
        </a>

        <nav>
          <a href="#home">HOME</a>
          <a href="#story">OUR STORY</a>
          <a href="#menu">MENU</a>
        </nav>

        <a href="#reservation" className="nav-button">
          RESERVE A TABLE ↗
        </a>
      </header>

      {/* Scroll-controlled experience */}
      <section
        ref={experienceRef}
        id="home"
        className="experience"
      >
        <div className="ambient-light" />

        {/* Introductory text */}
        <div ref={introRef} className="intro">
          <span className="eyebrow">
            A NEW EXPRESSION OF FINE DINING
          </span>

          <h1>
            Food that
            <br />
            <em>moves you.</em>
          </h1>

          <p>
            Extraordinary ingredients.
            <br />
            Unforgettable experiences.
          </p>
        </div>

        {/* Interactive 3D food scene */}
        <div className="food-scene food-scene-3d">
          <Suspense
            fallback={
              <div className="scene-loading">
                Preparing the dining experience...
              </div>
            }
          >
            <FoodScene3D progress={progressRef} />
          </Suspense>
        </div>

        {/* Restaurant story revealed by scrolling */}
        <div
          ref={storyRef}
          id="story"
          className="story"
        >
          <span className="eyebrow">
            THE SAVORA EXPERIENCE
          </span>

          <h2>
            Crafted with
            <br />
            <em>intention.</em>
          </h2>

          <p>
            Every ingredient has a purpose.
            Every plate tells a story.
            Every visit becomes a memory.
          </p>

          <a href="#menu" className="story-button">
            DISCOVER OUR MENU ↗
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <span>SCROLL TO EXPERIENCE</span>
          <div className="scroll-line" />
        </div>

        <div className="scene-number">
          01 <span>/</span> 04
        </div>
      </section>

      {/* Menu section */}
      <section id="menu" className="menu-section">
        <span className="eyebrow">FROM OUR KITCHEN</span>

        <h2>
          An experience beyond
          <br />
          the ordinary.
        </h2>

        <p>
          Thoughtfully prepared dishes, carefully selected
          ingredients, and an atmosphere designed for you.
        </p>

        <a href="#reservation" className="menu-button">
          EXPLORE THE MENU ↗
        </a>
      </section>

      {/* Reservation section */}
      <section id="reservation" className="reservation">
        <span className="eyebrow">YOUR TABLE AWAITS</span>

        <h2>
          Make tonight
          <br />
          <em>memorable.</em>
        </h2>

        <a
          href="mailto:reservations@example.com"
          className="reservation-button"
        >
          REQUEST A RESERVATION ↗
        </a>

        <p>
          SAVORA — AN EXPRESSION OF FINE DINING
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <a href="#home" className="logo">
          SAVORA<span>.</span>
        </a>

        <span>MADE FOR THE MOMENT.</span>

        <a href="#home">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}
