import React, { useState, useEffect } from 'react';
import { Material } from '@/types';
import { getActiveMaterials } from '@/lib/storage';
import Header from '@/components/Header';
import MaterialCard from '@/components/MaterialCard';
import { Input } from '@/components/ui/input';
import { Search, PackageSearch } from 'lucide-react';

const ContractorDashboard: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);

  // Load all active materials on mount
  useEffect(() => {
    const activeMaterials = getActiveMaterials();
    setMaterials(activeMaterials);
    setFilteredMaterials(activeMaterials);
  }, []);

  // Filter materials based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMaterials(materials);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = materials.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.dealerName.toLowerCase().includes(query)
    );
    setFilteredMaterials(filtered);
  }, [searchQuery, materials]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Page header with search */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Browse Materials</h1>
          <p className="mb-4 text-muted-foreground">
            Find construction materials from verified dealers
          </p>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search materials, dealers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results count */}
        {materials.length > 0 && (
          <p className="mb-4 text-sm text-muted-foreground">
            Showing {filteredMaterials.length} of {materials.length} materials
          </p>
        )}

        {/* Materials grid */}
        {filteredMaterials.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                viewMode="contractor"
              />
            ))}
          </div>
        ) : materials.length === 0 ? (
          // No materials at all
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
              <PackageSearch className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              No materials available yet
            </h2>
            <p className="max-w-sm text-muted-foreground">
              Dealers haven't listed any materials yet. Check back soon!
            </p>
          </div>
        ) : (
          // No search results
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              No results found
            </h2>
            <p className="max-w-sm text-muted-foreground">
              Try searching with different keywords or clear the search to see all materials.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContractorDashboard;
