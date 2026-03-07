"use client";
import { motion } from "framer-motion";
import ProjectCard from './components/ProjectCard';

const PROJECTS = [
  {
    title: "E-Commerce Shipping System",
    description: "Built a responsive logistics platform with order tracking and client management.",
    tags: ["Web Dev", "Logistics", "Responsive"],
    image: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?q=80&w=800",
    link: "#" // You can link to the GitHub repo later
  },
  {
    title: "Spam Email Classifier",
    description: "ML model using Python & scikit-learn achieving 92% accuracy via feature extraction.",
    tags: ["Python", "Machine Learning", "Scikit-Learn"],
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800",
    link: "#"
  },
  {
    title: "Student Score Predictor",
    description: "Neural network built with TensorFlow predicting scores based on study hours (85% accuracy).",
    tags: ["Deep Learning", "TensorFlow", "Python"],
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800",
    link: "#"
  }
];

// This is a "Variant" - a reusable animation settings object
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2 // Each child (card) waits 0.2s after the previous one
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md px-8 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="font-mono text-blue-400 font-bold">oanyarko7.dev</span>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Now animated properly */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto py-32 px-8"
      >
        <h1 className="text-7xl font-bold tracking-tight mb-6">
          Building tools for the <span className="text-blue-500">Digital Universe.</span>
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
          I'm a Computer Science student focused on creating high-performance 
          applications and exploring the science behind computing.
        </p>
      </motion.section>

      {/* PROJECTS SECTION - With Stagger Animation */}
      <section id="projects" className="max-w-6xl mx-auto px-8 pb-32">
        <h2 className="text-sm font-mono text-blue-500 uppercase tracking-widest mb-12">Selected Works</h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" // Only animates when the user scrolls down to see it!
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {PROJECTS.map((project, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ProjectCard 
                title={project.title} 
                description={project.description} 
                tags={project.tags} 
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
<section id="about" className="max-w-6xl mx-auto px-8 py-32 border-t border-white/5">
  <div className="flex flex-col md:flex-row gap-16 items-center">
    
    {/* PROFILE PICTURE COLUMN */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0"
    >
      {/* Decorative "Cosmic" Ring */}
      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 blur opacity-30 animate-pulse"></div>
      
      {/* The Actual Image */}
      <div className="relative w-full h-full rounded-full border-2 border-white/10 overflow-hidden bg-slate-800">
        <img 
          src="/profile.jpg" 
          alt="Nyarko Osumanu Adamu" 
          className="w-full h-full object-cover shadow-2xl"
        />
      </div>
    </motion.div>

    {/* TEXT COLUMN */}
    <div className="flex-1">
      <h2 className="text-4xl font-bold mb-6">Tracing the Digital Stars</h2>
      <p className="text-slate-400 text-lg leading-relaxed mb-6">
        I’m Nyarko Osumanu Adamu , a Computer Science student at KNUST with a passion for software development and Artificial Intelligence. 
      </p>
      <p className="text-slate-400 text-lg leading-relaxed mb-8">
        Beyond my academic work, I've served as the General Secretary of the Ghana Muslim Students Association in Mfantsipim and have experience in web maintenance from me working as a freelance developer.
      </p>

      {/* Technical Stack Pills */}
      <div className="flex flex-wrap gap-3">
        {["Python", "Java", "JavaScript", "MySQL", "TensorFlow", "Cisco"].map((skill) => (
          <span key={skill} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-mono text-blue-400">
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
</section>

      <footer className="border-t border-white/5 py-12 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-500 text-sm">
            © 2026 Designed & Built by Osumanu Adamu Nyarko. 
          </p>
          <div className="flex gap-8">
            <a href="https://github.com/oanyarko7" target="_blank" className="text-slate-400 hover:text-blue-400 transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/oanyarko7" target="_blank" className="text-slate-400 hover:text-blue-400 transition-colors">LinkedIn</a>
            <a href="mailto:gambaritibash143@gmail.com" className="text-slate-400 hover:text-blue-400 transition-colors">Email</a>
          </div>
        </div>
      </footer>
    </main>
  );
}