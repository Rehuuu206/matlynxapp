import React from 'react';
import { Material, MaterialUnit } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageCircle, Mail, Edit, Trash2, Pause, Play, Package, Clock } from 'lucide-react';
import { formatDistanceToNow, format, isPast, parseISO } from 'date-fns';

// Format unit for display
const formatUnit = (unit: MaterialUnit): string => {
  const unitLabels: Record<MaterialUnit, string> = {
    bags: 'Bags',
    kg: 'Kg',
    ton: 'Tons',
    pieces: 'Pieces',
    cubic_meter: 'Cubic Meters',
    sq_ft: 'Sq. Ft.',
  };
  return unitLabels[unit] || unit;
};

interface MaterialCardProps {
  material: Material;
  viewMode: 'dealer' | 'contractor';
  onEdit?: (material: Material) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  viewMode,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const { 
    name, 
    price, 
    quantity, 
    unit, 
    description, 
    imageUrl, 
    isActive,
    dealerName,
    dealerPhone,
    priceUpdatedAt,
    priceValidUntil
  } = material;

  // Check if price is expired
  const isPriceExpired = priceValidUntil ? isPast(parseISO(priceValidUntil)) : false;

  // Format price update time
  const priceUpdateText = priceUpdatedAt 
    ? `Updated ${formatDistanceToNow(parseISO(priceUpdatedAt), { addSuffix: true })}`
    : null;

  // Format validity
  const validityText = priceValidUntil 
    ? isPriceExpired 
      ? 'Price expired'
      : `Valid until ${format(parseISO(priceValidUntil), 'dd MMM yyyy')}`
    : null;

  // WhatsApp message
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in your material "${name}" listed on MATLYNX. Please share more details.`
  );
  const whatsappUrl = `https://wa.me/${dealerPhone.replace(/\D/g, '')}?text=${whatsappMessage}`;

  return (
    <Card className={`animate-fade-in overflow-hidden transition-all hover:shadow-md ${!isActive && viewMode === 'dealer' ? 'opacity-60' : ''}`}>
      {/* Image or placeholder */}
      <div className="relative h-40 bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        {/* Status badge for dealer view */}
        {viewMode === 'dealer' && (
          <Badge 
            variant={isActive ? 'default' : 'secondary'}
            className="absolute right-2 top-2"
          >
            {isActive ? 'Active' : 'Paused'}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight text-foreground">{name}</h3>
          <span className="whitespace-nowrap text-lg font-bold text-primary">
            ₹{price.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {quantity} {formatUnit(unit)} available
        </p>
        {/* Price timing info */}
        {(priceUpdateText || validityText) && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {priceUpdateText && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                {priceUpdateText}
              </span>
            )}
            {validityText && (
              <Badge variant={isPriceExpired ? 'destructive' : 'secondary'} className="text-xs">
                {validityText}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-3">
        {description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
        )}
        {viewMode === 'contractor' && (
          <p className="mt-2 text-sm font-medium text-foreground">
            Dealer: {dealerName}
          </p>
        )}
      </CardContent>

      <CardFooter className="gap-2 border-t bg-muted/30 pt-3">
        {viewMode === 'contractor' ? (
          // Contractor actions: contact dealer
          <>
            <Button size="sm" variant="outline" asChild className="flex-1">
              <a href={`tel:${dealerPhone}`}>
                <Phone className="mr-1 h-4 w-4" />
                Call
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild className="flex-1">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-1 h-4 w-4" />
                WhatsApp
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild className="flex-1">
              <a href={`mailto:${material.dealerEmail}?subject=Inquiry: ${name}`}>
                <Mail className="mr-1 h-4 w-4" />
                Email
              </a>
            </Button>
          </>
        ) : (
          // Dealer actions: edit, toggle, delete
          <>
            <Button size="sm" variant="outline" onClick={() => onEdit?.(material)}>
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={() => onToggleActive?.(material.id)}>
              {isActive ? (
                <>
                  <Pause className="mr-1 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-1 h-4 w-4" />
                  Activate
                </>
              )}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onDelete?.(material.id)}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default MaterialCard;
