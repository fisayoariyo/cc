export const ABOUT_HIGHLIGHTS_BASE = '/images/about/highlights';

export function aboutPhoto(file: string) {
  return `${ABOUT_HIGHLIGHTS_BASE}/${file}`;
}

/** Wide group shots — lead the horizontal gallery. */
export const ABOUT_GROUP_PHOTOS = [
  {
    id: 'group-leadership-seated',
    src: aboutPhoto('_MG_6701.webp'),
    caption: 'The Charis leadership team',
  },
  {
    id: 'group-team-standing',
    src: aboutPhoto('_MG_6689.webp'),
    caption: 'One team, one standard of service',
  },
] as const;

export type AboutTeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  mainImage: string;
  subsetImage: string;
};

/**
 * Image pairing is based on the Highlights shoot.
 * Swap main/subset in data if you prefer a different crop per person.
 */
export const ABOUT_TEAM_MEMBERS: AboutTeamMember[] = [
  {
    id: 'idowu-dotun',
    name: 'Idowu Dotun',
    role: 'CEO & Founder',
    bio: 'Leads Charis with a vision for trusted property, construction, and travel consultancy across Nigeria and beyond.',
    mainImage: aboutPhoto('_MG_6668.webp'),
    subsetImage: aboutPhoto('_MG_6578.webp'),
  },
  {
    id: 'adefunke-popoola',
    name: 'Adefunke Popoola',
    role: 'Operations Manager',
    bio: 'Keeps daily operations sharp, coordinating teams, timelines, and the client experience end to end.',
    mainImage: aboutPhoto('_MG_6431.webp'),
    subsetImage: aboutPhoto('_MG_6467.webp'),
  },
  {
    id: 'fatunmbi-oluwasegun',
    name: 'Fatunmbi Oluwasegun',
    role: 'Customer Relations Manager',
    bio: 'The voice clients trust, guiding enquiries, follow-ups, and relationship care with warmth and clarity.',
    mainImage: aboutPhoto('_MG_6494.webp'),
    subsetImage: aboutPhoto('_MG_6503.webp'),
  },
  {
    id: 'bello-olayinka',
    name: 'Bello Olayinka',
    role: 'Secretary',
    bio: 'Organises documentation, scheduling, and internal coordination so every department stays aligned.',
    mainImage: aboutPhoto('_MG_6420.webp'),
    subsetImage: aboutPhoto('_MG_6408.webp'),
  },
  {
    id: 'ayodeji-ogundele',
    name: 'Ayodeji Ogundele',
    role: 'International Consultant',
    bio: 'Advises on cross-border property and mobility pathways with deep market insight.',
    mainImage: aboutPhoto('_MG_9330.webp'),
    subsetImage: aboutPhoto('_MG_9330.webp'),
  },
  {
    id: 'fisayo-ariyo',
    name: 'Fisayomi Ariyo',
    role: 'IT Lead',
    bio: 'IT Lead overseeing systems, networks, and security to keep technology running smoothly for the business.',
    mainImage: aboutPhoto('_MG_6722.webp'),
    subsetImage: aboutPhoto('_MG_6741.webp'),
  },
];
