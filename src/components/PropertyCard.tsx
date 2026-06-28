import Link from 'next/link';
import Image from 'next/image';
import { Bed, Bath, Square, MapPin } from 'lucide-react';

interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqm: number;
  type: string;
  /** When set, the whole card links to the property detail page. */
  slug?: string;
}

export default function PropertyCard({
  image,
  title,
  location,
  price,
  beds,
  baths,
  sqm,
  type,
  slug,
}: PropertyCardProps) {
  const inner = (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-500 h-full">
      <div className="relative overflow-hidden h-64">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 bg-card/95 text-foreground text-xs font-medium rounded-full border border-border shadow-sm backdrop-blur-sm">
            {type}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
          <div className="flex items-center text-muted-foreground text-sm">
            <Bed size={18} className="mr-1" />
            <span>{beds}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <Bath size={18} className="mr-1" />
            <span>{baths}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <Square size={18} className="mr-1" />
            <span>{sqm}m²</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-semibold text-foreground">{price}</span>
          <span className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center group-hover:scale-110 transition-transform pointer-events-none">
            →
          </span>
        </div>
      </div>
    </div>
  );

  if (slug) {
    return (
      <Link href={`/properties/${slug}`} className="block h-full">
        {inner}
      </Link>
    );
  }

  return inner;
}
