// All site content lives here — edit this file to update the portfolio.

export const PROFILE = {
  name: "Nyarko Osumanu Adamu",
  short: "Nyarko",
  role: "Backend & Full-Stack Developer",
  availability: "Open to Remote Roles & Select Contracts",
  email: "gambaritibash143@gmail.com",
  phone: "+233 53 089 2820",
  location: "Accra, Ghana",
  github: "https://github.com/oanyarko7",
  linkedin: "https://www.linkedin.com/in/oanyarko7",
  cv: "/Nyarko_Osumanu_Adamu_CV.pdf",
  site: "https://my-portfolio-gamma-nine-59.vercel.app",
};

export type LogEntry = { tag: "FIX" | "SHIP" | "REFACTOR"; text: string };

export type ArchitectureStep = {
  layer: string;
  desc: string;
};

export type Architecture = {
  title: string;
  steps: ArchitectureStep[];
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  kicker: string;
  year: string;
  category: string;
  status: string; // honest current state: deployed, in development, prototype, academic
  problem: string;
  role: string;
  stack: string[];
  summary: string;
  points: string[];
  architecture?: Architecture;
  log?: LogEntry[];
  links?: { kind: string; label: string; href: string }[];
  repo?: string;
  images?: { src: string; alt: string; caption?: string }[];
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "cipher",
    index: "01",
    title: "Cipher",
    kicker: "Secure file collaboration & cybersecurity platform",
    year: "2026 —",
    category: "Startup",
    status: "Live · early-stage startup",
    problem:
      "Firms that handle confidential documents need to store, share and audit files without them leaking, including being photographed off the screen.",
    role: "Co-Founder · Full Stack & Cloud Infrastructure",
    stack: ["Node.js", "PostgreSQL", "Cloud infrastructure"],
    summary:
      "Cipher is the flagship product of Decimal.Inc Ltd, a startup registered in Ghana: a secure workspace for firms that handle confidential documents. Teams store, share and audit every file, and it is built to stop documents being photographed off the screen while they are open. I own backend development and cloud infrastructure, working alongside the founding team part-time while completing my degree.",
    points: [
      "Own the architecture decisions for backend services and cloud deployment.",
      "Working with the founding team from early product development onward.",
    ],
    architecture: {
      title: "Tamper-Resistant Document Collaboration Pipeline",
      steps: [
        { layer: "Client Protection", desc: "Next.js UI with dynamic canvas layer to obstruct screen photography" },
        { layer: "API & Auth Gateway", desc: "Node.js REST service with JWT verification, rate limiting, and RBAC" },
        { layer: "Immutable Audit Log", desc: "PostgreSQL event stream tracking document views, shares, and exports" },
        { layer: "Encrypted Storage", desc: "Supabase object store with short-lived pre-signed download tokens" },
      ],
    },
    links: [
      { kind: "Live app", label: "app.cipherglobal.tech", href: "https://app.cipherglobal.tech" },
      { kind: "Website", label: "cipherglobal.tech", href: "https://cipherglobal.tech" },
    ],
    images: [
      {
        src: "/projects/cipher-dashboard.png",
        alt: "Cipher app dashboard showing security score, critical events, file activity and system health",
        caption: "The Cipher app: security dashboard",
      },
      {
        src: "/projects/cipher-website.png",
        alt: "Cipher website homepage reading: Secure every share. Protect every moment.",
        caption: "cipherglobal.tech",
      },
    ],
    featured: true,
  },
  {
    slug: "osbremakans",
    index: "02",
    title: "OSBREMAKANS",
    kicker: "E-commerce shipping management system",
    year: "2026",
    category: "Client work",
    status: "Deployed · live client site",
    problem:
      "A shipping business needed order tracking and client management online, running reliably in production.",
    role: "Solo developer · build, deployment, backend, email",
    stack: ["HTML/CSS/JS", "Node.js", "Railway", "Nodemailer / SMTP"],
    summary:
      "A responsive logistics platform for a shipping business, with order tracking and client management. Its first deployment was broken; I debugged it into a stable production site that deploys itself.",
    points: [
      "Built order tracking and client management for a working logistics business.",
      "Took the project from a broken deployment to stable, auto-deploying production.",
    ],
    log: [
      { tag: "FIX", text: "Railway misdetected the app as a static site and never started the server." },
      { tag: "FIX", text: "A special character in an env var broke password parsing at boot." },
      { tag: "FIX", text: "Transactional mail failed because the sender and the authenticated account didn't match." },
      { tag: "FIX", text: "The server exited silently with no error and no logs." },
      { tag: "REFACTOR", text: "Split the codebase into a clean frontend/backend layout." },
      { tag: "SHIP", text: "Set up GitHub-based auto-deployment so every push goes live." },
    ],
    links: [{ kind: "Live site", label: "osbremakans-ltd.netlify.app", href: "https://osbremakans-ltd.netlify.app" }],
    images: [
      {
        src: "/projects/osbremakans-home.png",
        alt: "OSBREMAKANS Limited homepage reading: Simple & Reliable Global Shipping and Logistics",
        caption: "The live site's homepage",
      },
    ],
    featured: true,
  },
  {
    slug: "boafo",
    index: "03",
    title: "Boafo GH",
    kicker: "Artisan & skilled tradesperson locator",
    year: "2026",
    category: "Product",
    status: "Deployed prototype · personal & academic",
    problem: "People need a straightforward way to find local artisans and skilled tradespeople in Ghana.",
    role: "Solo developer · personal & academic, self-directed",
    stack: ["Node.js", "Express", "PostgreSQL", "JWT"],
    summary:
      "A platform connecting people to local artisans and skilled tradespeople across Ghana. Designed and deployed with a complete backend (Node.js, Express, PostgreSQL) and JWT authentication, alongside an investor-style pitch deck and academic proposal.",
    points: [
      "Produced a full investor-style pitch deck and a separate academic proposal.",
      "Built and deployed complete backend with JWT auth, zone management, and notification dispatch.",
    ],
    architecture: {
      title: "Artisan Dispatch & Scheduling Architecture",
      steps: [
        { layer: "Customer Portal", desc: "Service request UI categorized by trade, urgency, and locality" },
        { layer: "Express Backend", desc: "Zone-based geolocation matching algorithm and auth gateway" },
        { layer: "PostgreSQL Store", desc: "Relational database for artisan profiles, verified ratings, and schedules" },
        { layer: "Notification Worker", desc: "Asynchronous Nodemailer dispatch for booking updates and status alerts" },
      ],
    },
    links: [{ kind: "Live app", label: "boafo-ghana.onrender.com", href: "https://boafo-ghana.onrender.com" }],
    featured: true,
  },
  {
    slug: "mixing-station",
    index: "04",
    title: "Fluid Mixing Station",
    kicker: "Automated paint/fluid mixer on an ESP32",
    year: "2026",
    category: "Embedded",
    status: "Built prototype · team embedded systems project",
    problem: "Mix several fluids automatically instead of measuring and mixing them by hand.",
    role: "Team lead & firmware builder (8-member team)",
    stack: ["ESP32", "Flow sensors", "Solenoid valves", "Keypad + LCD"],
    summary:
      "Led an 8-member team building an automated fluid and paint mixing station. Three solenoid valves and flow sensors dose each fluid accurately, a mix motor combines the liquids, and users configure batch recipes from a keypad with an LCD.",
    points: [
      "Led an 8-member engineering team through hardware assembly and C++ firmware architecture.",
      "Integrated three solenoid valves, precision flow sensors, motor driver, and keypad/LCD interface on a single ESP32.",
    ],
    links: [{ kind: "Demo video", label: "Watch it run on LinkedIn", href: "https://www.linkedin.com/posts/oanyarko7_arduino-embeddedsystems-automation-ugcPost-7496277371638128640-g1Yp/" }],
  },
  {
    slug: "spam",
    index: "05",
    title: "Spam Email Classifier",
    kicker: "Machine learning · text classification",
    year: "2025",
    category: "ML",
    status: "Personal / Academic · machine learning",
    problem: "Separate spam from legitimate email automatically.",
    role: "Solo developer · personal & academic",
    stack: ["Python", "scikit-learn"],
    summary:
      "A spam-detection model in Python that reaches 92% accuracy, built with feature extraction (TF-IDF/bag-of-words) and evaluated with cross-validation.",
    points: ["Feature extraction plus cross-validation; 92% accuracy."],
  },
  {
    slug: "score",
    index: "06",
    title: "Student Score Predictor",
    kicker: "Neural network regression",
    year: "2025",
    category: "ML",
    status: "Academic project",
    problem: "Estimate a student's exam score from how many hours they study.",
    role: "Solo developer · academic",
    stack: ["Python", "TensorFlow"],
    summary: "A neural network that predicts students' exam scores from their study hours, reaching 85% accuracy.",
    points: ["Built and trained in TensorFlow; 85% accuracy."],
  },
];

export const EXPERIENCE = [
  {
    when: "Aug 2026 — Now",
    title: "Co-Founder, Full Stack & Cloud Infrastructure",
    org: "Decimal.Inc Ltd (Cipher)",
    text: "Co-founded a Ghana-registered startup building Cipher, a cybersecurity and secure file-collaboration platform. Own backend development and cloud infrastructure for the product, part-time alongside full-time study.",
    highlights: ["Cipher", "Secure Collaboration", "Cloud Infrastructure", "PostgreSQL"],
  },
  {
    when: "Oct — Nov 2026",
    title: "Backend & Full-Stack Developer Intern",
    org: "Glinax (in-person)",
    text: "Helped train Cerkyl, an AI chatbot that guides senior high school students in learning about tertiary institutions. Worked on Ashanti Civic, a civic issue-reporting platform for the Ashanti Region auto-routing citizen reports (roads, drainage, sanitation, water, electricity) to responsible MMDA units with SLA tracking and photo-verified completion.",
    highlights: ["Cerkyl AI", "Ashanti Civic (MMDA)", "SLA Routing", "Full Stack"],
  },
  {
    when: "2024 — Now",
    title: "Freelance Web Developer",
    org: "Independent · client projects",
    text: "Designed and built responsive websites for local Ghanaian businesses, extending to full-stack builds with Next.js, PostgreSQL/Supabase, and Railway. Currently building a showcase website for Itzzz Meera sewing studio, alongside ongoing production maintenance, performance optimization, and email-delivery troubleshooting.",
    highlights: ["Itzzz Meera", "E-Commerce Shipping", "Next.js / Supabase", "Railway"],
  },
];

export const SKILLS = [
  { group: "Languages", items: ["Python", "JavaScript / TypeScript", "Java", "C++", "HTML / CSS"] },
  { group: "Backend & Data", items: ["Node.js", "Express", "Next.js", "Spring Boot", "PostgreSQL", "Supabase", "MySQL", "REST API design", "JWT auth"] },
  { group: "AI & Embedded", items: ["TensorFlow", "scikit-learn", "OpenCV", "Roboflow", "ESP32", "Sensors & Actuators"] },
  { group: "Infra & Security", items: ["Railway", "Git / GitHub", "Burp Suite", "Cisco Packet Tracer", "PowerShell", "Vercel"] },
  { group: "Soft Skills", items: ["Leadership", "Communication", "Problem Solving", "Teamwork", "Adaptability"] },
];

export const LEADERSHIP = [
  "Campus Lead, NextMakers Foundation (2026)",
  "General Secretary, Ghana Muslim Students Association (Mfantsipim)",
  "Second-in-Command, Mfantsipim Army Cadet Corps",
  "Class Representative, Mfantsipim School (2023)",
  "Member, KNUST Computer Science Society (assists peers with programming assignments, hackathons, workshops)",
  "Attendee, Tech in Ghana Conference 2025",
];

export const EDUCATION = [
  {
    title: "BSc Computer Science",
    org: "Kwame Nkrumah University of Science and Technology (KNUST)",
    when: "Level 400 (2026/2027) · Expected Sept 2027",
  },
  {
    title: "W.A.S.S.C.E (Science)",
    org: "Mfantsipim School, Cape Coast",
    when: "Sept 2023",
  },
];

export const LANGUAGES = [
  { name: "English", level: "Native" },
  { name: "French", level: "Learning" },
  { name: "Arabic", level: "Learning" },
  { name: "Spanish", level: "Learning" },
];

export const INTERESTS = ["Movies", "Gaming", "Music", "Travel", "Coding", "Football"];
