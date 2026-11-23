const ITEMS = [
  "Node.js",
  "Next.js",
  "PostgreSQL",
  "Supabase",
  "Railway",
  "TypeScript",
  "Computer Vision",
  "Express",
  "Spring Boot",
  "Python",
  "TensorFlow",
  "Roboflow",
  "JWT auth",
  "REST APIs",
  "ESP32",
];

export default function Marquee() {
  const row = (hidden?: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center font-serif text-3xl text-muted sm:text-4xl">
          <span className="px-6 sm:px-8">{item}</span>
          <span className="text-base text-highlight/80">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-y border-line py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="marquee flex w-max">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
