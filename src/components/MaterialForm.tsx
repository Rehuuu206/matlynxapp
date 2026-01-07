import React, { useState, useEffect } from 'react';
import { Material, MaterialUnit } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, ImagePlus } from 'lucide-react';

interface MaterialFormProps {
  material?: Material | null;
  onSubmit: (data: Omit<Material, 'id' | 'dealerEmail' | 'dealerName' | 'dealerPhone' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const UNIT_OPTIONS: { value: MaterialUnit; label: string }[] = [
  { value: 'bags', label: 'Bags' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'ton', label: 'Tons' },
  { value: 'pieces', label: 'Pieces' },
  { value: 'cubic_meter', label: 'Cubic Meters' },
  { value: 'sq_ft', label: 'Square Feet' },
];

const MaterialForm: React.FC<MaterialFormProps> = ({ material, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<MaterialUnit>('bags');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form if editing
  useEffect(() => {
    if (material) {
      setName(material.name);
      setPrice(material.price.toString());
      setQuantity(material.quantity.toString());
      setUnit(material.unit);
      setDescription(material.description);
      setImageUrl(material.imageUrl || '');
    }
  }, [material]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image must be less than 2MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setErrors(prev => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Material name is required';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Enter a valid price';
    }
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      newErrors.quantity = 'Enter a valid quantity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      price: Number(price),
      quantity: Number(quantity),
      unit,
      description: description.trim(),
      imageUrl: imageUrl || undefined,
      isActive: material?.isActive ?? true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-card-foreground">
            {material ? 'Edit Material' : 'Add New Material'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Material Name */}
          <div>
            <Label htmlFor="name">Material Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Portland Cement, TMT Bars"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className={errors.price ? 'border-destructive' : ''}
              />
              {errors.price && <p className="mt-1 text-sm text-destructive">{errors.price}</p>}
            </div>
            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className={errors.quantity ? 'border-destructive' : ''}
              />
              {errors.quantity && <p className="mt-1 text-sm text-destructive">{errors.quantity}</p>}
            </div>
          </div>

          {/* Unit */}
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Select value={unit} onValueChange={(value) => setUnit(value as MaterialUnit)}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {UNIT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the material, quality, brand, etc."
              rows={3}
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label>Image (optional)</Label>
            <div className="mt-1">
              {imageUrl ? (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-32 w-full rounded-md object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6"
                    onClick={() => setImageUrl('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-input p-6 transition-colors hover:border-primary">
                  <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload image</span>
                  <span className="text-xs text-muted-foreground">(Max 2MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
              {errors.image && <p className="mt-1 text-sm text-destructive">{errors.image}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {material ? 'Update Material' : 'Add Material'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialForm;
