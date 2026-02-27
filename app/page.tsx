import ProjectCard from './components/ProjectCard';

export default function Home() {
  return (
    // 'bg-slate-950' gives us that deep space-black background
    <main className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      
      {/* NAVIGATION - Using 'sticky' so it follows the user as they scroll */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md px-8 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="font-mono text-blue-400 font-bold">oanyarko7.dev</span>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - The "Hook" */}
      <section className="max-w-4xl mx-auto py-32 px-8">
        <h1 className="text-7xl font-bold tracking-tight mb-6">
          Building tools for the <span className="text-blue-500">Digital Universe.</span>
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
          I'm a Computer Science student focused on creating high-performance 
          applications and exploring the science behind computing.
        </p>
      </section>

      {/* PROJECTS SECTION - The "Grid" */}
      <section id="projects" className="max-w-6xl mx-auto px-8 pb-32">
        <h2 className="text-sm font-mono text-blue-500 uppercase tracking-widest mb-12">Selected Works</h2>
        
        {/* 'grid-cols-1 md:grid-cols-2' is the magic: 1 col on phone, 2 on laptop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard 
            title="Solar System Sim" 
            description="Real-time orbital mechanics using JavaScript and canvas."
            tags={["Math", "Physics", "JS"]}
          />
          <ProjectCard 
            title="Sort Visualizer" 
            description="Visualizing O(n log n) algorithms in the browser."
            tags={["Algorithms", "CS Fundamentals"]}
          />
          <ProjectCard 
            title="Atmosphere Data" 
            description="Fetching and parsing real-time planetary weather APIs."
            tags={["APIs", "Data Science"]}
          />
        </div>
      </section>

    </main>
  );
}