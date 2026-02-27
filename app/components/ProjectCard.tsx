// This defines the "Shape" of the data we expect (like a Struct or Interface)
interface ProjectProps {
  title: string;
  description: string;
  tags: string[];
}

export default function ProjectCard({ title, description, tags }: ProjectProps) {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:scale-105 transition-transform duration-300">
      <h3 className="text-2xl font-bold text-blue-400">{title}</h3>
      <p className="mt-2 text-slate-400">{description}</p>
      <div className="mt-4 flex gap-2">
        {tags.map((tag) => (
          <span key={tag} className="px-3 py-1 text-xs bg-slate-800 text-blue-300 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}