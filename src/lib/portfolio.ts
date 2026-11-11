/**
 * Central content model for the portfolio.
 *
 * Everything rendered on the site is sourced from this file. Fields marked
 * `null` are intentionally omitted from the UI until the owner supplies them.
 * Project entries are explicit placeholders: no work, outcomes, or metrics have
 * been invented.
 */

export type NavItem = {
  id: string;
  label: string;
  href: `#${string}`;
};

export type Interest = {
  title: string;
  note: string;
};

export type ToolkitCategory = {
  id: string;
  index: string;
  title: string;
  note: string;
  items: string[];
};

export type ProjectArt = "orbit" | "grid" | "signal";

export type Project = {
  id: string;
  index: string;
  name: string;
  category: string;
  description: string;
  techStack: string[];
  status: string;
  featured: boolean;
  liveUrl: string | null;
  repositoryUrl: string | null;
  coverImage: string | null;
  year: string;
  placeholder: boolean;
  art: ProjectArt;
};

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
  external: boolean;
};

export type Portfolio = {
  owner: {
    displayName: string;
    displayNameLines: string[];
    preferredName: string;
    role: string;
    headline: string;
    location: string | null;
    shortBio: string;
    longBio: string;
    availability: string | null;
    profileImage: string | null;
    resumeUrl: string | null;
  };
  links: {
    github: string;
    email: string | null;
    linkedin: string | null;
    website: string | null;
  };
  nav: NavItem[];
  interests: Interest[];
  currentlyLearning: string[];
  toolkit: ToolkitCategory[];
  projects: Project[];
  sections: {
    hero: { eyebrow: string; scrollCue: string };
    about: { title: string; statement: string; asideLabel: string };
    toolkit: { title: string; intro: string };
    projects: { title: string; intro: string };
    now: { title: string; intro: string };
    contact: { title: string; intro: string; footerNote: string };
  };
};

export const portfolio: Portfolio = {
  owner: {
    // The brief supplies "Kisaragilice" as the owner handle. Replace
    // displayName with a full display name when one is provided.
    displayName: "Kisaragilice",
    displayNameLines: ["KISARA", "GILICE"],
    preferredName: "Kisaragilice",
    role: "Informatics Student",
    headline: "Building, breaking, and understanding software systems.",
    location: null,
    shortBio:
      "I am an Informatics student interested in software development, Linux, open-source software, self-hosting, and local AI. I enjoy learning by building practical projects and exploring how software and systems work under the hood.",
    longBio:
      "I am an Informatics student with a practical, curiosity-driven approach to technology. My interests include software development, Linux and system administration, open-source ecosystems, self-hosted infrastructure, and local AI. I enjoy experimenting with tools, understanding systems from the ground up, and turning ideas into working projects. This portfolio documents what I build, what I learn, and the technical directions I am exploring.",
    availability: null,
    profileImage: null,
    resumeUrl: null,
  },
  links: {
    github: "https://github.com/Kisaragilice",
    email: "hello@kisaragilice.dev",
    linkedin: null,
    website: null,
  },
  nav: [
    { id: "about", label: "About", href: "#about" },
    { id: "toolkit", label: "Toolkit", href: "#toolkit" },
    { id: "work", label: "Work", href: "#work" },
    { id: "now", label: "Now", href: "#now" },
    { id: "contact", label: "Contact", href: "#contact" },
  ],
  interests: [
    {
      title: "Linux & Arch",
      note: "Tinkering with the system, one config at a time.",
    },
    {
      title: "Open source",
      note: "Learning in public and reading how things are made.",
    },
    {
      title: "Self-hosting",
      note: "Running services on my own terms, close to the metal.",
    },
    {
      title: "Local AI",
      note: "Experimenting with LLMs that stay on the machine.",
    },
  ],
  currentlyLearning: [
    "Backend development",
    "System administration",
    "Building and maintaining practical software projects",
  ],
  toolkit: [
    {
      id: "languages",
      index: "01",
      title: "Languages",
      note: "The syntax I reach for",
      items: ["Python", "JavaScript", "PHP", "Bash"],
    },
    {
      id: "runtime",
      index: "02",
      title: "Runtime & frameworks",
      note: "Where the code runs",
      items: ["Node.js"],
    },
    {
      id: "systems",
      index: "03",
      title: "Operating systems",
      note: "Where I feel at home",
      items: ["Linux", "Arch Linux"],
    },
    {
      id: "tools",
      index: "04",
      title: "Tools & platforms",
      note: "The daily workbench",
      items: ["Docker", "Git", "MySQL"],
    },
  ],
  projects: [
    {
      id: "project-01",
      index: "01",
      name: "Project slot one",
      category: "Case study pending",
      description:
        "This space is reserved for a project write-up: the problem, the approach, the stack, and what came out of it. Details will be added once the project is ready to document.",
      techStack: [],
      status: "Awaiting details",
      featured: true,
      liveUrl: null,
      repositoryUrl: null,
      coverImage: null,
      year: "—",
      placeholder: true,
      art: "orbit",
    },
    {
      id: "project-02",
      index: "02",
      name: "Project slot two",
      category: "Case study pending",
      description:
        "A second slot for a documented build. No project name, outcome, or repository link has been supplied yet, so none is shown here.",
      techStack: [],
      status: "Awaiting details",
      featured: false,
      liveUrl: null,
      repositoryUrl: null,
      coverImage: null,
      year: "—",
      placeholder: true,
      art: "grid",
    },
    {
      id: "project-03",
      index: "03",
      name: "Project slot three",
      category: "Case study pending",
      description:
        "A third slot for something worth explaining. Replace this entry in the content file with a real project when it is ready.",
      techStack: [],
      status: "Awaiting details",
      featured: false,
      liveUrl: null,
      repositoryUrl: null,
      coverImage: null,
      year: "—",
      placeholder: true,
      art: "signal",
    },
  ],
  sections: {
    hero: {
      eyebrow: "Portfolio · 2026",
      scrollCue: "Scroll to explore",
    },
    about: {
      title: "About",
      statement:
        "I learn by taking things apart, then putting them back together with a better understanding of how they work.",
      asideLabel: "Working notes",
    },
    toolkit: {
      title: "Technical toolkit",
      intro:
        "Technologies I use and can talk through. No levels, no percentage bars — just the tools that show up in my work.",
    },
    projects: {
      title: "Selected work",
      intro:
        "Case studies are being assembled. Each entry below is a reserved slot, not a finished project claim.",
    },
    now: {
      title: "Currently exploring",
      intro:
        "The directions taking up most of my attention right now. Some are coursework, some are curiosity.",
    },
    contact: {
      title: "Say hello",
      intro:
        "I am always glad to talk about software, Linux, self-hosting, or something you are building. Email is the most direct way to reach me; the other channels are listed below.",
      footerNote:
        "This site documents what I build, what I learn, and the directions I am exploring.",
    },
  },
};

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: portfolio.links.github,
    handle: "@Kisaragilice",
    external: true,
  },
  {
    label: "Discord",
    href: "https://discord.com/users/000000000000000000",
    handle: "@kisaragilice",
    external: true,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/kisaragilice",
    handle: "Kisaragilice",
    external: true,
  },
];

export const getSectionById = (id: string) =>
  portfolio.sections[id as keyof Portfolio["sections"]];
