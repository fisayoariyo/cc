export const CONSTRUCTION_VIDEO_SRC =
  'https://videos.pexels.com/video-files/3253993/3253993-hd_1920_1080_25fps.mp4';

export const CONSTRUCTION_HERO_POSTER = '/images/construction-hero-bk.jpg';

export const trustMetrics = [
  { value: 500, suffix: '+', label: 'Projects Completed' },
  { value: 20, suffix: '+', label: 'Years Experience' },
  { value: 99, suffix: '%', label: 'Client Satisfaction' },
  { value: 0, suffix: '', label: 'Major Safety Incidents', prefix: 'Zero ' },
] as const;

export type ServiceIconName =
  | 'home'
  | 'building'
  | 'hammer'
  | 'clipboard'
  | 'paintbrush'
  | 'hard-hat';

export type ServiceItem = {
  title: string;
  description: string;
  icon: ServiceIconName;
};

export const services: ServiceItem[] = [
  {
    title: 'Residential Construction',
    description: 'Custom homes and estates built to exacting standards with transparent milestones.',
    icon: 'home',
  },
  {
    title: 'Commercial Buildings',
    description: 'Office towers, retail spaces, and mixed-use developments delivered at scale.',
    icon: 'building',
  },
  {
    title: 'Renovations',
    description: 'Structural upgrades and full refurbishments with minimal disruption.',
    icon: 'hammer',
  },
  {
    title: 'Project Management',
    description: 'End-to-end coordination of contractors, budgets, and compliance.',
    icon: 'clipboard',
  },
  {
    title: 'Interior Finishing',
    description: 'Premium fit-outs, bespoke joinery, and refined material selections.',
    icon: 'paintbrush',
  },
  {
    title: 'Civil Engineering',
    description: 'Foundations, drainage, and infrastructure built for long-term durability.',
    icon: 'hard-hat',
  },
];

export type ProjectItem = {
  name: string;
  location: string;
  year: number;
  category: string;
  image: string;
};

export const featuredProjects: ProjectItem[] = [
  {
    name: 'Lekki Skyline Residences',
    location: 'Lagos, Nigeria',
    year: 2024,
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
  },
  {
    name: 'Victoria Island Corporate Hub',
    location: 'Lagos, Nigeria',
    year: 2023,
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
  },
  {
    name: 'Abuja Heritage Estate',
    location: 'Abuja, Nigeria',
    year: 2024,
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
  },
  {
    name: 'Port Harcourt Industrial Park',
    location: 'Port Harcourt, Nigeria',
    year: 2022,
    category: 'Industrial',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
  },
  {
    name: 'Ibadan Medical Centre',
    location: 'Ibadan, Nigeria',
    year: 2023,
    category: 'Healthcare',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80',
  },
  {
    name: 'Enugu Retail Complex',
    location: 'Enugu, Nigeria',
    year: 2025,
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
  },
];

export const processSteps = [
  { step: 1, title: 'Consultation', description: 'Site visit, scope definition, and feasibility review.' },
  { step: 2, title: 'Planning', description: 'Budgeting, scheduling, and regulatory approvals.' },
  { step: 3, title: 'Design', description: 'Architectural drawings, BOQ, and material selection.' },
  { step: 4, title: 'Construction', description: 'Managed build with weekly progress reporting.' },
  { step: 5, title: 'Quality Inspection', description: 'Multi-stage QA checks and consultant sign-offs.' },
  { step: 6, title: 'Handover', description: 'Final walkthrough, documentation, and warranty.' },
] as const;

export const beforeAfter = {
  before: '/images/before-after-before.jpg',
  after: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80',
  title: 'Victoria Island Penthouse Renovation',
  location: 'Lagos, Nigeria',
} as const;

export type TestimonialItem = {
  quote: string;
  name: string;
  company: string;
  rating: number;
  photo: string;
};

export const testimonials: TestimonialItem[] = [
  {
    quote:
      'Charis delivered our headquarters two weeks ahead of schedule. Their transparency on costs and weekly reporting gave us complete confidence throughout.',
    name: 'Adaeze Okonkwo',
    company: 'Meridian Holdings',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
  },
  {
    quote:
      'From foundation to handover, every milestone was documented and signed off. The craftsmanship on our residential estate exceeded expectations.',
    name: 'Emmanuel Bello',
    company: 'Bello Properties Ltd',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
  },
  {
    quote:
      'We chose Charis for their safety record and project management rigour. Zero incidents on a 14-month commercial build speaks for itself.',
    name: 'Fatima Yusuf',
    company: 'Northgate Developments',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
  },
];

export const whyChooseUsPoints = [
  'Licensed Professionals',
  'Transparent Pricing',
  'On-Time Delivery',
  'Premium Materials',
  'Dedicated Project Managers',
] as const;

export const whyChooseUsImage =
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80';

export const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;
