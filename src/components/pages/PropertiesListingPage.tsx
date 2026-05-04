'use client';

import { useMemo, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PropertyCard from '@/components/PropertyCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { PropertyRecord } from '@/data/properties';
import { saveRealEstateSearch, toggleCompareProperty, toggleFavoriteProperty } from '@/app/(site)/(real-estate)/real-estate/properties/actions';

export default function PropertiesListingPage({
  initialProperties,
  favoriteIds,
  compareIds,
  canManage,
}: {
  initialProperties: PropertyRecord[];
  favoriteIds: string[];
  compareIds: string[];
  canManage: boolean;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(favoriteIds));
  const [compare, setCompare] = useState<Set<string>>(new Set(compareIds));
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const properties = initialProperties;

  const filteredProperties = properties.filter((property) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      if (!property.title.toLowerCase().includes(q) && !property.location.toLowerCase().includes(q)) return false;
    }
    if (selectedType !== 'all' && property.propertyType !== selectedType) return false;
    if (selectedCity !== 'all' && property.city !== selectedCity) return false;
    return true;
  });
  const queryForSave = useMemo(
    () => ({ search: searchTerm, type: selectedType, city: selectedCity }),
    [searchTerm, selectedType, selectedCity],
  );

  return (
    <div className="min-h-screen bg-muted/40 pt-20">
      <div className="bg-gradient-to-br from-[#fff8f0] via-background to-[#e8f6f1] border-b border-border py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-light text-foreground mb-4">
              Discover Your Dream Property
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Browse our exclusive collection of premium properties
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-2xl border border-border shadow-sm p-6 mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search properties by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border bg-input-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-muted text-foreground rounded-xl font-medium inline-flex items-center hover:bg-muted/80 transition-colors border border-border"
            >
              <SlidersHorizontal size={20} className="mr-2" />
              Filters
            </motion.button>
            {canManage ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={pending}
                onClick={() =>
                  start(() => {
                    void (async () => {
                      const title = `Type:${selectedType} City:${selectedCity} Search:${searchTerm || 'none'}`;
                      const res = await saveRealEstateSearch({ title, query: queryForSave });
                      setNotice(res && 'error' in res ? res.error ?? 'Could not save search.' : 'Search saved.');
                    })();
                  })
                }
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium inline-flex items-center hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                Save Search
              </motion.button>
            ) : null}
          </div>
          {notice ? <p className="text-xs text-muted-foreground mt-3">{notice}</p> : null}

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 mt-6 border-t border-border">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Property Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="all">All Types</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">City</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="all">All Cities</option>
                      <option value="ibadan">Ibadan</option>
                      <option value="lagos">Lagos</option>
                      <option value="abuja">Abuja</option>
                      <option value="ogun">Ogun</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Price Range</label>
                    <select className="w-full px-4 py-3 border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/40">
                      <option>Any Price</option>
                      <option>Under ₦100M</option>
                      <option>₦100M - ₦200M</option>
                      <option>₦200M - ₦300M</option>
                      <option>Above ₦300M</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="flex items-center justify-between mb-8">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties
          </p>
          <select className="px-4 py-2 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/40">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
          </select>
        </div>

        {properties.length === 0 ? (
          <p className="text-center text-muted-foreground py-16 rounded-2xl border border-dashed border-border">
            No active listings yet. Listings set to &quot;active&quot; in the admin portal appear here.
          </p>
        ) : filteredProperties.length === 0 ? (
          <p className="text-center text-muted-foreground py-16 rounded-2xl border border-dashed border-border">
            No properties match your filters. Try adjusting filters or search.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <AnimatePresence mode="popLayout">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="space-y-2">
                    <PropertyCard
                      image={property.image}
                      title={property.title}
                      location={property.location}
                      price={property.price}
                      beds={property.beds}
                      baths={property.baths}
                      sqm={property.sqm}
                      type={property.type}
                      slug={property.slug}
                    />
                    {canManage ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          className={`rounded-lg px-3 py-2 text-xs border ${
                            favorites.has(property.id)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-border hover:bg-muted'
                          }`}
                          onClick={() =>
                            start(() => {
                              void (async () => {
                                const res = await toggleFavoriteProperty(property.id);
                                if (res && 'error' in res) {
                                  setNotice(res.error ?? 'Failed to update favorite.');
                                  return;
                                }
                                setFavorites((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(property.id)) next.delete(property.id);
                                  else next.add(property.id);
                                  return next;
                                });
                              })();
                            })
                          }
                        >
                          {favorites.has(property.id) ? 'Favorited' : 'Favorite'}
                        </button>
                        <button
                          type="button"
                          className={`rounded-lg px-3 py-2 text-xs border ${
                            compare.has(property.id)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-border hover:bg-muted'
                          }`}
                          onClick={() =>
                            start(() => {
                              void (async () => {
                                const res = await toggleCompareProperty(property.id);
                                if (res && 'error' in res) {
                                  setNotice(res.error ?? 'Failed to update compare list.');
                                  return;
                                }
                                setCompare((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(property.id)) next.delete(property.id);
                                  else next.add(property.id);
                                  return next;
                                });
                              })();
                            })
                          }
                        >
                          {compare.has(property.id) ? 'In Compare' : 'Compare'}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-10 h-10 rounded-full font-medium transition-colors ${
                page === 1
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'bg-card text-foreground border border-border hover:bg-muted'
              }`}
            >
              {page}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
