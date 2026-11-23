import About from "./components/About";
import CommandPalette from "./components/CommandPalette";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import MatrixRain from "./components/MatrixRain";
import Nav from "./components/Nav";
import Work from "./components/Work";

export default function Home() {
  return (
    <>
      {/* The background canvas sits on its own layer (z-0); all content is lifted above it (z-10). */}
      <MatrixRain />
      <div className="grain relative z-10 min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          <Hero />
          <Marquee />
          <Work />
          <Experience />
          <About />
          <Contact />
        </main>
        <CommandPalette />
      </div>
    </>
  );
}
