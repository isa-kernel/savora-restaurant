
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./globals.css";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const experienceRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const steamRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const experience = experienceRef.current;
    const plate = plateRef.current;
    const ingredients = ingredientsRef.current;
    const steam = steamRef.current;
    const intro = introRef.current;
    const story = storyRef.current;

    if (
      !experience ||
      !plate ||
      !ingredients ||
      !steam ||
      !intro ||
      !story
    ) {
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
        },
      });

      // Scene 1: The real food photograph moves and rotates.
      timeline.to(
        plate,
        {
          rotation: -12,
          scale: 1.12,
          x: -65,
          duration: 1,
          ease: "none",
        },
        0
      );

      // Scene 2: Ingredient accents rise over the photograph.
      timeline.to(
        ingredients,
        {
          y: -75,
          rotation: 8,
          scale: 1.08,
          duration: 0.8,
          ease: "none",
        },
        0.8
      );

      // Scene 3: Steam becomes visible.
      timeline.to(
        steam,
        {
          opacity: 1,
          y: -55,
          scale: 1.2,
          duration: 1,
          ease: "none",
        },
        1.3
      );

      // Scene 4: The photograph returns to its final position.
      timeline.to(
        plate,
        {
          rotation: 0,
          scale: 1,
          x: 0,
          duration: 0.8,
          ease: "none",
        },
        2.3
      );

      // The introductory heading fades away.
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

      // The restaurant story appears.
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

        {/* Real food photograph */}
        <div className="food-scene">
          <div ref={plateRef} className="food-photo">
            <img
              src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=85"
              alt="Freshly prepared pasta served in a restaurant"
              className="food-image"
            />

            <div className="food-image-overlay" />

            <div
              ref={ingredientsRef}
              className="ingredient-overlay"
            >
              <span className="ingredient-dot ingredient-dot-one" />
              <span className="ingredient-dot ingredient-dot-two" />
              <span className="ingredient-dot ingredient-dot-three" />
            </div>
          </div>

          {/* Decorative steam */}
          <div ref={steamRef} className="steam">
            <span />
            <span />
            <span />
          </div>
        </div>

        {/* Restaurant story revealed by scrolling */}
        <div ref={storyRef} id="story" className="story">
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
