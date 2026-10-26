"use client";

import { Suspense, useEffect, useRef } from "react";
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

export default function Home() {
  const progressRef = useRef(0);
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        desktop: "(min-width: 901px)",
        mobile: "(max-width: 900px)",
      },
      (context) => {
        const conditions = context.conditions as {
          reduceMotion: boolean;
          desktop: boolean;
          mobile: boolean;
        };

        const reduceMotion = conditions.reduceMotion;

        if (reduceMotion) {
          progressRef.current = 0;

          gsap.set(
            [
              ".hero-copy",
              ".hero-eyebrow",
              ".hero-description",
              ".hero-actions",
              ".story-content",
              ".menu-card",
            ],
            {
              clearProps: "all",
              autoAlpha: 1,
              y: 0,
            }
          );

          return;
        }

        const hero = heroRef.current;
        const story = storyRef.current;

        if (!hero || !story) return;

        gsap.set(
          [
            ".hero-eyebrow",
            ".hero-copy",
            ".hero-description",
            ".hero-actions",
          ],
          {
            autoAlpha: 0,
            y: 24,
          }
        );

        const intro = gsap.timeline({
          defaults: {
            ease: "power3.out",
          },
        });

        intro
          .to(".hero-eyebrow", {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
          })
          .to(
            ".hero-copy",
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
            },
            "-=0.4"
          )
          .to(
            ".hero-description",
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
            },
            "-=0.5"
          )
          .to(
            ".hero-actions",
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
            },
            "-=0.4"
          );

        const scrollAnimation = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "+=1500",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              progressRef.current = self.progress;
            },
          },
        });

        scrollAnimation
          .to(
            ".hero-copy",
            {
              x: conditions.desktop ? -100 : -30,
              y: -35,
              autoAlpha: 0,
              duration: 0.3,
            },
            0
          )
          .to(
            ".hero-description",
            {
              y: -25,
              autoAlpha: 0,
              duration: 0.2,
            },
            0
          )
          .to(
            ".hero-actions",
            {
              y: -20,
              autoAlpha: 0,
              duration: 0.2,
            },
            0
          )
          .to(
            ".hero-eyebrow",
            {
              y: -20,
              autoAlpha: 0,
              duration: 0.2,
            },
            0
          );

        gsap.fromTo(
          ".story-content",
          {
            y: 60,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: story,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          ".menu-card",
          {
            y: 35,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".menu-section",
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );

        return () => {
          progressRef.current = 0;
        };
      }
    );

    return () => {
      media.revert();
    };
  }, []);

  return (
    <main>
      <header className="site-header">
        <a href="#" className="brand" aria-label="Savora home">
          SAVORA<span>.</span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#story">Our Story</a>
          <a href="#menu">Menu</a>
          <a href="#reservation">Reservations</a>
        </nav>

        <a className="header-cta" href="#reservation">
          Book a Table <span>↗</span>
        </a>
      </header>

      <section
        ref={heroRef}
        className="hero-section"
        aria-labelledby="hero-title"
      >
        <div className="hero-background-glow" />

        <div className="hero-content">
          <p className="hero-eyebrow">
            <span className="eyebrow-line" />
            A MODERN ITALIAN DINING EXPERIENCE
          </p>

          <h1 id="hero-title" className="hero-copy">
            Taste the art
            <br />
            of <em>living well.</em>
          </h1>

          <p className="hero-description">
            Thoughtfully sourced ingredients. Honest cooking.
            Unforgettable moments around the table.
          </p>

          <div className="hero-actions">
            <a href="#menu" className="button button-primary">
              Explore the Menu <span>↗</span>
            </a>

            <a href="#story" className="text-link">
              Discover Savora <span>↓</span>
            </a>
          </div>
        </div>
        <div className="food-photo">
          <img
            src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1400&q=90"
            alt="Freshly prepared pasta with herbs"
          />

          <div className="food-photo-overlay" />
        </div>

        <div className="hero-bottom">
          <span>FRESH INGREDIENTS. TIMELESS FLAVOUR.</span>
          <span className="scroll-indicator">
            SCROLL TO EXPERIENCE <span>↓</span>
          </span>
        </div>
      </section>

      <section
        ref={storyRef}
        id="story"
        className="story-section"
      >
        <div className="story-content">
          <p className="section-eyebrow">THE SAVORA PHILOSOPHY</p>

          <h2>
            Simple ingredients.
            <br />
            <em>Extraordinary moments.</em>
          </h2>

          <p className="story-description">
            We believe great food begins long before it reaches
            your plate. It starts with seasonal ingredients,
            thoughtful preparation, and the joy of bringing
            people together.
          </p>

          <a href="#menu" className="text-link">
            Discover our approach <span>↗</span>
          </a>
        </div>

        <div className="story-side">
          <span className="story-number">01</span>
          <div className="story-divider" />
          <p>
            MADE WITH CARE
            <br />
            SERVED WITH PURPOSE
          </p>
        </div>
      </section>

      <section id="menu" className="menu-section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">FROM OUR KITCHEN</p>
            <h2>
              A taste of <em>Savora.</em>
            </h2>
          </div>

          <p className="menu-intro">
            Crafted with seasonal ingredients and a little
            imagination.
          </p>
        </div>

        <div className="menu-grid">
          <article className="menu-card">
            <div className="menu-card-visual pasta-visual">
              <span>01</span>
              <div className="menu-plate">
                <div className="menu-pasta">〰</div>
              </div>
            </div>

            <div className="menu-card-details">
              <div>
                <h3>Golden Tagliatelle</h3>
                <p>Fresh pasta · Parmesan · Garden herbs</p>
              </div>
              <span className="menu-price">KES 1,450</span>
            </div>
          </article>

          <article className="menu-card">
            <div className="menu-card-visual tomato-visual">
              <span>02</span>
              <div className="tomato-art">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="menu-card-details">
              <div>
                <h3>Garden Pomodoro</h3>
                <p>Slow-roasted tomatoes · Basil · Olive oil</p>
              </div>
              <span className="menu-price">KES 1,200</span>
            </div>
          </article>

          <article className="menu-card">
            <div className="menu-card-visual basil-visual">
              <span>03</span>
              <div className="basil-art">
                <span>✳</span>
              </div>
            </div>

            <div className="menu-card-details">
              <div>
                <h3>Herb Garden Bowl</h3>
                <p>Seasonal greens · Herbs · Citrus dressing</p>
              </div>
              <span className="menu-price">KES 980</span>
            </div>
          </article>
        </div>

        <p className="menu-disclaimer">
          Demonstration menu and prices for the SAVORA prototype.
        </p>
      </section>

      <section id="reservation" className="reservation-section">
        <p className="section-eyebrow">YOUR TABLE IS WAITING</p>

        <h2>
          Make room for
          <br />
          <em>something memorable.</em>
        </h2>

        <p>
          Good food. Good company. A moment worth slowing down for.
        </p>

        <a href="mailto:hello@savora.example" className="button button-primary">
          Request a Reservation <span>↗</span>
        </a>
      </section>

      <footer className="site-footer">
        <a href="#" className="brand">
          SAVORA<span>.</span>
        </a>

        <p>Good food brings us together.</p>

        <span>© 2026 SAVORA. ALL RIGHTS RESERVED.</span>
      </footer>
    </main>
  );
}