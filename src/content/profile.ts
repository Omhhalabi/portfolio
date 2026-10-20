/**
 * Single source of truth for all site content.
 *
 * PROVENANCE
 *  - identity, about, experience, education, certifications, skills
 *      -> LinkedIn profile export (linkedin.com/in/omhhalabi), Oct 2026.
 *  - projects
 *      -> reframed from the same LinkedIn experience entries, except
 *         `agentic-ai-security`, which describes the AI-assisted security
 *         toolchain documented in `aiWorkflow` below.
 *  - aiWorkflow
 *      -> the Claude Code + MCP toolchain in active use.
 *
 * Nothing here is invented. Edit this file to update the site; no component
 * holds copy of its own.
 */

export const identity = {
  name: "Omar AL-Halabi",
  shortName: "Omar",
  role: "Cyber Security Officer",
  company: "LEXZUR",
  discipline: "Cyber Defense & Threat Intelligence",
  location: "Sidon District, South Governorate, Lebanon",
  email: "omhhalabi@gmail.com",
  linkedin: "https://www.linkedin.com/in/omhhalabi",
  linkedinHandle: "linkedin.com/in/omhhalabi",
  /** Hero headline. Drawn from the purple-team work in the LEXZUR role. */
  tagline: "I find what the controls miss.",
  /** Hero sub-line. */
  intro:
    "Cyber Security Officer at LEXZUR. I run purple team exercises, build the detections that catch what they expose, and test the systems in between.",
  metaDescription:
    "Omar AL-Halabi — Cyber Security Officer at LEXZUR. Purple team operations, Wazuh detection engineering, application security testing, and AI-orchestrated security assessment.",
} as const;

export const about = {
  eyebrow: "About",
  heading: "Detection, tested from both sides",
  /** Rewritten from the LinkedIn summary. Same facts, tighter. */
  paragraphs: [
    "I work the defensive and offensive side of the same problem. On defence that means correlating endpoint, user and network telemetry in Wazuh until an alert becomes an explanation. On offence it means running the attack myself, then recording exactly what the deployed controls caught and what walked straight through.",
    "That loop is the whole job. A purple team exercise that ends in a findings list is only half finished — the other half is the detection that fires next time. I take security reports from intake to closure and write the outcome up twice: once for the engineers who have to fix it, once for the management who have to fund it.",
    "The foundation is a Computer and Communication Engineering degree from Rafik Hariri University, built on networking before security. Alongside it I chaired the IEEE RHU Student Branch and served as Technical Ambassador at Semicolon Academy, which is where I learned that explaining the work clearly matters as much as doing it.",
  ],
  stats: [
    { value: "50+", label: "Findings logged & severity-ranked" },
    { value: "100+", label: "Security events triaged" },
    { value: "50+", label: "Incidents escalated with written calls" },
    { value: "5", label: "Cisco certifications" },
  ],
} as const;

export type SkillGroup = {
  id: string;
  title: string;
  /** Lucide icon name, resolved in the Skills component. */
  icon: "radar" | "crosshair" | "cloud" | "network" | "bot" | "file-text";
  accent: "cyan" | "green";
  skills: { name: string; top?: boolean }[];
};

/** `top: true` marks the three skills LinkedIn lists as Top Skills. */
export const skillGroups: SkillGroup[] = [
  {
    id: "detection",
    title: "Detection & Response",
    icon: "radar",
    accent: "green",
    skills: [
      { name: "Wazuh", top: true },
      { name: "Cyber Threat Hunting", top: true },
      { name: "Alert & log correlation" },
      { name: "Endpoint, user & network telemetry" },
      { name: "Incident triage & escalation" },
      { name: "Purple team exercises" },
      { name: "Enterprise SIEM operations" },
    ],
  },
  {
    id: "offensive",
    title: "Offensive Security",
    icon: "crosshair",
    accent: "cyan",
    skills: [
      { name: "Nmap", top: true },
      { name: "Web application testing" },
      { name: "Access control testing" },
      { name: "Internal systems testing" },
      { name: "Passive & active reconnaissance" },
      { name: "Surface, deep & dark web OSINT" },
      { name: "CVSS severity scoring" },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & Identity",
    icon: "cloud",
    accent: "cyan",
    skills: [
      { name: "Microsoft Azure" },
      { name: "Azure Active Directory" },
      { name: "Conditional Access policies" },
      { name: "Multi-factor authentication" },
      { name: "Endpoint protection" },
      { name: "Device enrollment & profiles" },
    ],
  },
  {
    id: "infrastructure",
    title: "Infrastructure & Networking",
    icon: "network",
    accent: "green",
    skills: [
      { name: "Windows Server 2019" },
      { name: "Active Directory & DHCP" },
      { name: "Hyper-V" },
      { name: "Routing, switching & wireless" },
      { name: "Network automation" },
      { name: "Linux / Ubuntu" },
    ],
  },
  {
    id: "ai",
    title: "AI-Assisted Security",
    icon: "bot",
    accent: "cyan",
    skills: [
      { name: "Claude Code orchestration" },
      { name: "MCP tool integration" },
      { name: "n8n workflow automation" },
      { name: "Python scripting" },
      { name: "OWASP LLM Top 10" },
      { name: "Agent & tool-chain review" },
    ],
  },
  {
    id: "reporting",
    title: "Reporting & Process",
    icon: "file-text",
    accent: "green",
    skills: [
      { name: "Intake-to-closure tracking" },
      { name: "Dual-audience write-ups" },
      { name: "Severity calls & ranking" },
      { name: "Process improvement proposals" },
      { name: "Structured collection reports" },
    ],
  },
];

export type Experience = {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  duration: string;
  location?: string;
  current?: boolean;
  summary: string;
  highlights: string[];
  tags: string[];
};

export const experience: Experience[] = [
  {
    id: "lexzur",
    company: "LEXZUR",
    role: "Cyber Security Officer",
    start: "Aug 2025",
    end: "Present",
    duration: "1 yr 3 mos",
    current: true,
    summary:
      "Own detection, adversary simulation and application testing end to end.",
    highlights: [
      "Correlate alerts and log data across endpoint, user and network telemetry in Wazuh to work out what actually happened.",
      "Maintain a library of ready queries so the relevant data surfaces fast during an incident.",
      "Run purple team exercises — execute the attack, then record what the deployed controls detected and what passed through unnoticed.",
      "Test the company web application and internal systems: 50+ findings logged and ranked by severity, with access control flaws a recurring category.",
      "Take incoming security reports from intake to closure and write the outcome up for both engineers and management.",
    ],
    tags: ["Wazuh", "Purple Team", "AppSec", "Threat Hunting"],
  },
  {
    id: "potech-soc",
    company: "POTECH",
    role: "Security Operations Center Analyst",
    start: "Oct 2023",
    end: "Jan 2024",
    duration: "4 mos",
    summary: "Front-line triage across multiple customer environments.",
    highlights: [
      "Worked the alert queue in an enterprise SIEM across multiple customer environments.",
      "Handled 100+ security events, separating real activity from noise.",
      "Escalated 50+ incidents with a written summary and a severity call, so the next analyst did not start over.",
    ],
    tags: ["SIEM", "Triage", "Escalation"],
  },
  {
    id: "potech-infosec",
    company: "POTECH",
    role: "Information Security Specialist",
    start: "Jun 2023",
    end: "Aug 2023",
    duration: "3 mos",
    summary: "Reconnaissance and intelligence collection, then automated it.",
    highlights: [
      "Ran passive and active reconnaissance across surface, deep and dark web sources.",
      "Delivered structured collection reports to senior staff.",
      "Wrote 3 Python scripts that replaced manual collection work.",
    ],
    tags: ["OSINT", "Recon", "Python"],
  },
  {
    id: "jubaili",
    company: "Jubaili Bros",
    role: "IT Support Technician",
    start: "Sep 2022",
    end: "Oct 2022",
    duration: "2 mos",
    location: "Sidon District, Lebanon",
    summary:
      "Identity hardening and endpoint rollout on Azure and Windows Server.",
    highlights: [
      "Configured Microsoft Azure Conditional Access: policies, MFA, device profile protection and guided access.",
      "Managed Azure Active Directory device enrollment across Windows, Android and iOS, plus endpoint protection.",
      "Administered Windows Server 2019 services: local Active Directory, DHCP, Hyper-V and print services.",
      "Set up and configured 8 Windows desktops and 24 Ubuntu thin clients, and installed and tested network sockets.",
      "Resolved 10+ software and ~5 hardware faults.",
    ],
    tags: ["Azure", "Entra ID", "Windows Server", "Endpoint"],
  },
];

export type Project = {
  id: string;
  title: string;
  context: string;
  blurb: string;
  bullets: string[];
  stack: string[];
  accent: "cyan" | "green";
  /** Headline metric rendered on the card. */
  metric?: { value: string; label: string };
};

export const projects: Project[] = [
  {
    id: "purple-team",
    title: "Purple Team Exercise Programme",
    context: "LEXZUR · ongoing",
    blurb:
      "Adversary simulation run as a measurement exercise, not a scoreboard. Every attack is executed against live controls and the result is recorded both ways: what fired, and what did not.",
    bullets: [
      "Execute the attack path, then document detected versus undetected per control.",
      "Feed every undetected step back into Wazuh detection coverage.",
      "Close the loop so the same path is caught on the next run.",
    ],
    stack: ["Wazuh", "Purple Team", "Detection Engineering"],
    accent: "green",
    metric: { value: "2-way", label: "Detected / missed per control" },
  },
  {
    id: "detection-library",
    title: "Wazuh Correlation & Query Library",
    context: "LEXZUR · ongoing",
    blurb:
      "A maintained set of ready queries over endpoint, user and network telemetry, built so that during an incident the relevant data comes up fast instead of being reconstructed from scratch.",
    bullets: [
      "Correlate alerts and logs across three telemetry domains into one account of events.",
      "Keep queries versioned and ready rather than written under pressure.",
      "Cut the time between alert and explanation.",
    ],
    stack: ["Wazuh", "Log Correlation", "Threat Hunting"],
    accent: "green",
  },
  {
    id: "appsec-testing",
    title: "Application & Internal Systems Testing",
    context: "LEXZUR · ongoing",
    blurb:
      "Continuous security testing of the company web application and internal systems, with every finding logged, severity-ranked and tracked from intake through to closure.",
    bullets: [
      "50+ findings logged and ranked by severity.",
      "Access control flaws identified as the recurring category, and tracked as a class.",
      "Outcomes written up twice — once for engineers, once for management.",
    ],
    stack: ["Web AppSec", "Access Control", "CVSS"],
    accent: "cyan",
    metric: { value: "50+", label: "Findings logged & ranked" },
  },
  {
    id: "agentic-ai-security",
    title: "Agentic AI Security Toolchain",
    context: "Practice · ongoing",
    blurb:
      "An AI-orchestrated assessment pipeline: Claude Code as the control plane, security tooling attached over MCP, and a playbook library that keeps methodology consistent across engagements.",
    bullets: [
      "Drive Burp Suite, offensive tooling and reverse-engineering tools programmatically over MCP.",
      "Review agent and tool-chain exposure against the OWASP LLM Top 10.",
      "Automate the mechanical half of assessment; keep scope, severity and sign-off human.",
    ],
    stack: ["Claude Code", "MCP", "OWASP LLM Top 10", "n8n"],
    accent: "cyan",
  },
  {
    id: "infra-hardening",
    title: "Identity Hardening & Endpoint Rollout",
    context: "Jubaili Bros",
    blurb:
      "Conditional Access and endpoint baselines on Azure, Windows Server 2019 core services, and a full desktop and thin-client deployment — identity tightened and fleet standardised in the same pass.",
    bullets: [
      "Conditional Access policies, MFA, device profile protection and guided access.",
      "Azure AD device enrollment across Windows, Android and iOS with endpoint protection.",
      "Active Directory, DHCP, Hyper-V and print services on Windows Server 2019.",
    ],
    stack: ["Azure", "Entra ID", "Windows Server 2019", "Hyper-V"],
    accent: "cyan",
    metric: { value: "32", label: "Endpoints deployed & configured" },
  },
  {
    id: "osint-automation",
    title: "OSINT Collection Automation",
    context: "POTECH",
    blurb:
      "Reconnaissance across surface, deep and dark web sources, delivered as structured intelligence reports — then the repetitive collection was handed to scripts.",
    bullets: [
      "Passive and active reconnaissance across three source tiers.",
      "Structured collection reports delivered to senior staff.",
      "3 Python scripts written to replace manual collection work.",
    ],
    stack: ["OSINT", "Python", "Dark Web Recon"],
    accent: "green",
    metric: { value: "3", label: "Scripts replacing manual work" },
  },
];

/* ------------------------------------------------------------------ *
 * AI WORKFLOW — the centrepiece section.
 * ------------------------------------------------------------------ */

export const aiWorkflow = {
  eyebrow: "AI Workflow",
  heading: "Claude Code as the control plane",
  lede:
    "Security work is mostly mechanical: enumerate, correlate, cross-reference, write it up. I automate that half and keep the judgement calls. Claude Code sits at the centre, security tooling attaches over MCP, and a playbook library keeps the methodology identical whoever runs it.",
  stages: [
    {
      id: "recon",
      step: "01",
      title: "Recon & Enumerate",
      command: "map the external surface",
      detail:
        "Subdomain, port and parameter discovery dispatched across attached tooling in parallel instead of run by hand, one command at a time.",
      tools: ["HexStrike MCP", "Nmap", "Subfinder", "httpx"],
      accent: "cyan" as const,
    },
    {
      id: "test",
      step: "02",
      title: "Test & Validate",
      command: "probe the auth boundary",
      detail:
        "Burp Suite driven programmatically — requests replayed, responses diffed, every candidate finding reproduced before it is written down.",
      tools: ["Burp Suite MCP", "Repeater", "Intruder", "REA"],
      accent: "cyan" as const,
    },
    {
      id: "correlate",
      step: "03",
      title: "Correlate & Hunt",
      command: "tie these alerts together",
      detail:
        "Endpoint, user and network telemetry pulled into one timeline, so a cluster of alerts resolves into a single explained sequence of events.",
      tools: ["Wazuh", "SIEM queries", "Threat Hunting"],
      accent: "green" as const,
    },
    {
      id: "report",
      step: "04",
      title: "Score & Report",
      command: "draft the finding, CVSS 4.0",
      detail:
        "Findings scored against CVSS 4.0 and written up for two audiences in one pass: reproduction steps for engineers, business impact for management.",
      tools: ["CVSS 4.0", "Markdown to DOCX", "n8n"],
      accent: "green" as const,
    },
  ],
  capabilities: [
    {
      title: "Playbook library",
      detail:
        "A versioned set of assessment playbooks — web application, Active Directory, cloud, mobile and LLM-specific — so methodology does not drift between engagements.",
      icon: "library" as const,
    },
    {
      title: "Tooling over MCP",
      detail:
        "Burp Suite, offensive tooling, reverse-engineering and workflow automation all exposed as callable tools rather than separate consoles to context-switch between.",
      icon: "plug" as const,
    },
    {
      title: "LLM threat modelling",
      detail:
        "Agent systems and their tool chains reviewed against the OWASP LLM Top 10, including prompt injection paths and tool-poisoning exposure.",
      icon: "shield-alert" as const,
    },
    {
      title: "Human in the loop",
      detail:
        "Authorisation, scope, severity calls and client communication stay with me. Automation covers collection and drafting, never the sign-off.",
      icon: "user-check" as const,
    },
  ],
  principle: {
    label: "Operating principle",
    text: "Automate collection and drafting. Never automate the severity call, the scope, or the sign-off.",
  },
} as const;

export type Certification = {
  name: string;
  issuer: string;
  category: "network" | "security" | "foundations";
};

export const certifications: Certification[] = [
  {
    name: "CCNA: Enterprise Networking, Security, and Automation",
    issuer: "Cisco Networking Academy",
    category: "network",
  },
  {
    name: "CCNA: Switching, Routing, and Wireless Essentials",
    issuer: "Cisco Networking Academy",
    category: "network",
  },
  {
    name: "Foundations of Cybersecurity",
    issuer: "Cisco Networking Academy",
    category: "security",
  },
  {
    name: "IT Essentials: PC Hardware and Software",
    issuer: "Cisco Networking Academy",
    category: "foundations",
  },
  {
    name: "Introduction to IoT",
    issuer: "Cisco Networking Academy",
    category: "foundations",
  },
];

export type Education = {
  institution: string;
  degree: string;
  field: string;
  start: string;
  end: string;
};

export const education: Education[] = [
  {
    institution: "Rafik Hariri University",
    degree: "Bachelor of Engineering",
    field: "Computer and Communications Engineering",
    start: "Jan 2024",
    end: "Jun 2026",
  },
  {
    institution: "Lebanese University",
    degree: "Bachelor of Science",
    field: "Communication and Computer Networks Engineering",
    start: "Oct 2020",
    end: "Sep 2023",
  },
];

export const leadership = [
  { role: "Chair", org: "IEEE RHU Student Branch" },
  { role: "Technical Ambassador", org: "Semicolon Academy" },
] as const;

export const contact = {
  eyebrow: "Connect",
  heading: "Open to security work",
  lede:
    "Detection engineering, purple team exercises, application security testing, or AI-assisted assessment workflows. The fastest route is email.",
  links: [
    {
      id: "email",
      label: "Email",
      value: identity.email,
      href: "mailto:" + identity.email,
      icon: "mail" as const,
      primary: true,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: identity.linkedinHandle,
      href: identity.linkedin,
      icon: "linkedin" as const,
      primary: false,
    },
  ],
} as const;

export const navigation = [
  { id: "about", label: "About" },
  { id: "ai-workflow", label: "AI Workflow" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;
