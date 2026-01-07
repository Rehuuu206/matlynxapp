import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Material } from '@/types';
import {
  getMaterialsByDealer,
  addMaterial,
  updateMaterial,
  deleteMaterial,
  toggleMaterialActive,
  generateId,
} from '@/lib/storage';
import Header from '@/components/Header';
import MaterialCard from '@/components/MaterialCard';
import MaterialForm from '@/components/MaterialForm';
import { Button } from '@/components/ui/button';
import { Plus, Package } from 'lucide-react';

const DealerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  // Load dealer's materials on mount
  useEffect(() => {
    if (user) {
      loadMaterials();
    }
  }, [user]);

  const loadMaterials = () => {
    if (user) {
      const dealerMaterials = getMaterialsByDealer(user.email);
      setMaterials(dealerMaterials);
    }
  };

  const handleAddMaterial = (data: Omit<Material, 'id' | 'dealerEmail' | 'dealerName' | 'dealerPhone' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const newMaterial: Material = {
      ...data,
      id: generateId(),
      dealerEmail: user.email,
      dealerName: user.name,
      dealerPhone: user.phone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addMaterial(newMaterial);
    loadMaterials();
    setShowForm(false);
  };

  const handleEditMaterial = (data: Omit<Material, 'id' | 'dealerEmail' | 'dealerName' | 'dealerPhone' | 'createdAt' | 'updatedAt'>) => {
    if (!editingMaterial) return;

    updateMaterial(editingMaterial.id, data);
    loadMaterials();
    setEditingMaterial(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      deleteMaterial(id);
      loadMaterials();
    }
  };

  const handleToggleActive = (id: string) => {
    toggleMaterialActive(id);
    loadMaterials();
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMaterial(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Materials</h1>
            <p className="text-muted-foreground">
              Manage your construction material listings
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Material
          </Button>
        </div>

        {/* Materials grid */}
        {materials.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {materials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                viewMode="dealer"
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">No materials yet</h2>
            <p className="mb-6 max-w-sm text-muted-foreground">
              Start by adding your first construction material. Contractors will be able to find and contact you.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Material
            </Button>
          </div>
        )}
      </main>

      {/* Material Form Modal */}
      {showForm && (
        <MaterialForm
          material={editingMaterial}
          onSubmit={editingMaterial ? handleEditMaterial : handleAddMaterial}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
};

export default DealerDashboard;
