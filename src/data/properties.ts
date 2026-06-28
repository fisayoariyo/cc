export type PropertyStatus = 'published' | 'draft' | 'archived';

export type PropertyRecord = {
  id: string;
  slug: string;
  image: string;
  images: string[];
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqm: number;
  type: string;
  propertyType: 'residential' | 'commercial';
  city: string;
  description: string;
  status: PropertyStatus;
  featured?: boolean;
};

export const INITIAL_PROPERTIES: PropertyRecord[] = [
  {
    id: '1',
    slug: 'modern-luxury-villa-ibadan',
    image: 'https://images.unsplash.com/photo-1774685110718-c5b4fe026144?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1774685110718-c5b4fe026144?w=1200&q=80',
      'https://images.unsplash.com/photo-1766603636700-e9d80473f40f?w=1200&q=80',
      'https://images.unsplash.com/photo-1775466145653-a47a853428d2?w=1200&q=80',
    ],
    title: 'Modern Luxury Villa',
    location: 'Ibadan, Oyo State',
    price: '₦250,000,000',
    beds: 5,
    baths: 6,
    sqm: 450,
    type: 'For Sale',
    propertyType: 'residential',
    city: 'ibadan',
    featured: true,
    status: 'published',
    description:
      'Exceptional contemporary villa with panoramic views, smart home features, and premium finishes throughout. Located in a secure gated estate with 24/7 power and concierge-ready access.',
  },
  {
    id: '2',
    slug: 'contemporary-estate-lagos',
    image: 'https://images.unsplash.com/photo-1766603636700-e9d80473f40f?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1766603636700-e9d80473f40f?w=1200&q=80',
      'https://images.unsplash.com/photo-1774685110718-c5b4fe026144?w=1200&q=80',
    ],
    title: 'Contemporary Estate',
    location: 'Lagos, Nigeria',
    price: '₦180,000,000',
    beds: 4,
    baths: 5,
    sqm: 380,
    type: 'For Sale',
    propertyType: 'residential',
    city: 'lagos',
    featured: true,
    status: 'published',
    description:
      'Sleek architecture with open-plan living, designer kitchen, and landscaped grounds. Minutes from business districts and international schools.',
  },
  {
    id: '3',
    slug: 'luxury-residence-abuja',
    image: 'https://images.unsplash.com/photo-1775466145653-a47a853428d2?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1775466145653-a47a853428d2?w=1200&q=80',
    ],
    title: 'Luxury Residence',
    location: 'Abuja, FCT',
    price: '₦320,000,000',
    beds: 6,
    baths: 7,
    sqm: 520,
    type: 'For Sale',
    propertyType: 'residential',
    city: 'abuja',
    featured: true,
    status: 'published',
    description:
      'Ambassador-grade residence with cinema, wine room, and staff quarters. Ideal for diplomatic or executive living.',
  },
  {
    id: '4',
    slug: 'premium-office-lagos-island',
    image: 'https://images.unsplash.com/photo-1768223933860-6d62bc5b2ff3?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1768223933860-6d62bc5b2ff3?w=1200&q=80',
    ],
    title: 'Premium Office Space',
    location: 'Lagos Island',
    price: '₦450,000,000',
    beds: 0,
    baths: 8,
    sqm: 800,
    type: 'For Sale',
    propertyType: 'commercial',
    city: 'lagos',
    status: 'published',
    description:
      'Grade-A commercial tower floor plate with raised flooring, backup power, and dedicated parking allocation.',
  },
  {
    id: '5',
    slug: 'modern-family-home-ogun',
    image: 'https://images.unsplash.com/photo-1769780510442-60d4d6391a91?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1769780510442-60d4d6391a91?w=1200&q=80',
    ],
    title: 'Modern Family Home',
    location: 'Ogun State',
    price: '₦95,000,000',
    beds: 4,
    baths: 4,
    sqm: 320,
    type: 'For Sale',
    propertyType: 'residential',
    city: 'ogun',
    status: 'published',
    description:
      'Warm family layout with generous bedrooms, study, and a garden suited for entertaining.',
  },
  {
    id: '6',
    slug: 'luxury-apartments-ibadan',
    image: 'https://images.unsplash.com/photo-1758526116315-361575027838?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1758526116315-361575027838?w=1200&q=80',
    ],
    title: 'Luxury Apartments',
    location: 'Ibadan, Oyo State',
    price: '₦280,000,000',
    beds: 5,
    baths: 6,
    sqm: 480,
    type: 'For Sale',
    propertyType: 'residential',
    city: 'ibadan',
    status: 'draft',
    description:
      'Boutique apartment block with rooftop lounge, gym, and two parking slots per unit.',
  },
];

export function getPropertyBySlug(slug: string): PropertyRecord | undefined {
  return INITIAL_PROPERTIES.find((p) => p.slug === slug);
}

export function getPropertyById(id: string): PropertyRecord | undefined {
  return INITIAL_PROPERTIES.find((p) => p.id === id);
}
