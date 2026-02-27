const PROJECTS = [
  {
    title: "Quantum Sort Visualizer",
    description: "Visualizing O(n log n) algorithms with a space-themed UI.",
    tags: ["React", "Algorithms", "Framer Motion"],
    link: "#"
  },
  {
    title: "Exoplanet API",
    description: "A RESTful API that serves data about habitable planets.",
    tags: ["Node.js", "Express", "NASA Data"],
    link: "#"
  },
  {
    title: "Black Hole Shader",
    description: "A GLSL fragment shader simulating gravitational lensing.",
    tags: ["WebGL", "GLSL", "Physics"],
    link: "#"
  }
];

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
  {PROJECTS.map((project, index) => (
    <ProjectCard 
      key={index} 
      title={project.title} 
      description={project.description} 
      tags={project.tags} 
    />
  ))}
</div>
      </section>

      <section id="about" className="max-w-4xl mx-auto px-8 py-32 border-t border-white/5">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div>
      <h2 className="text-3xl font-bold mb-6">Tracing the Digital Stars</h2>
      <p className="text-slate-400 mb-4">
        I’m currently pursuing a degree in Computer Science, driven by a 
        fascination with how the laws of physics parallel the logic of code.
      </p>
      <p className="text-slate-400">
        When I'm not debugging, I'm usually reading about astrophysics or 
        experimenting with generative art inspired by cosmic patterns.
      </p>
    </div>
    
    {/* A placeholder for your image or a "Stats" box */}
    <div className="bg-linear-to-br from-blue-500/10 to-purple-500/10 p-8 rounded-3xl border border-blue-500/20">
      <h3 className="text-blue-400 font-mono mb-4 text-sm uppercase">Technical Stack</h3>
      <ul className="grid grid-cols-2 gap-2 text-sm text-slate-300">
        <li>• TypeScript</li>
        <li>• Python</li>
        <li>• Next.js</li>
        <li>• Tailwind CSS</li>
        <li>• Git / GitHub</li>
        <li>• Linux</li>
      </ul>
    </div>
  </div>
</section>

    </main>
  );
}