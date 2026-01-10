import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { Profile, Address, isValidPhone } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { User, Building2, Phone, MapPin, Camera } from 'lucide-react';
import logo from '@/assets/logo.png';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, saveProfile, isProfileComplete } = useProfile();

  const [formData, setFormData] = useState({
    fullName: '',
    shopName: '',
    companyName: '',
    phone: '',
    whatsapp: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    profilePhoto: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [usePhoneForWhatsapp, setUsePhoneForWhatsapp] = useState(true);

  // Populate form if profile exists
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        shopName: profile.shopName || '',
        companyName: profile.companyName || '',
        phone: profile.phone || '',
        whatsapp: profile.whatsapp || '',
        street: profile.address?.street || '',
        area: profile.address?.area || '',
        city: profile.address?.city || '',
        state: profile.address?.state || '',
        pincode: profile.address?.pincode || '',
        profilePhoto: profile.profilePhoto || '',
      });
      setUsePhoneForWhatsapp(!profile.whatsapp || profile.whatsapp === profile.phone);
    } else if (user) {
      // Pre-fill from user data
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        phone: user.phone || '',
        whatsapp: user.whatsapp || '',
        area: user.area || '',
      }));
    }
  }, [profile, user]);

  // Redirect if profile is complete
  useEffect(() => {
    if (isProfileComplete && user) {
      navigate(user.role === 'dealer' ? '/dealer' : '/contractor', { replace: true });
    }
  }, [isProfileComplete, user, navigate]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Phone must be 10-12 digits';
    }

    if (!usePhoneForWhatsapp && formData.whatsapp && !isValidPhone(formData.whatsapp)) {
      newErrors.whatsapp = 'WhatsApp must be 10-12 digits';
    }

    if (user?.role === 'dealer' && !formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required for dealers';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const address: Address = {
      street: formData.street.trim(),
      area: formData.area.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
    };

    const profileData: Omit<Profile, 'userId' | 'role' | 'createdAt' | 'updatedAt' | 'isComplete'> = {
      fullName: formData.fullName.trim(),
      shopName: user?.role === 'dealer' ? formData.shopName.trim() : undefined,
      companyName: user?.role === 'contractor' ? formData.companyName.trim() || undefined : undefined,
      phone: formData.phone.trim(),
      whatsapp: usePhoneForWhatsapp ? formData.phone.trim() : (formData.whatsapp.trim() || undefined),
      address,
      profilePhoto: formData.profilePhoto || undefined,
    };

    saveProfile(profileData);
    toast.success('Profile saved successfully!');
    navigate(user?.role === 'dealer' ? '/dealer' : '/contractor', { replace: true });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      toast.error('Photo must be less than 500KB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, profilePhoto: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <img src={logo} alt="MATLYNX" className="mx-auto h-12 mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-2">
            Set up your {user.role} profile to get started
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              This information will be visible to {user.role === 'dealer' ? 'contractors' : 'dealers'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Photo */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                    {formData.profilePhoto ? (
                      <img src={formData.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    className={errors.fullName ? 'border-destructive' : ''}
                  />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              {/* Shop/Company Name */}
              <div className="space-y-2">
                <Label htmlFor="shopName" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {user.role === 'dealer' ? 'Shop Name *' : 'Company Name (Optional)'}
                </Label>
                <Input
                  id="shopName"
                  value={user.role === 'dealer' ? formData.shopName : formData.companyName}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    [user.role === 'dealer' ? 'shopName' : 'companyName']: e.target.value
                  }))}
                  placeholder={user.role === 'dealer' ? 'Enter your shop name' : 'Enter your company name'}
                  className={errors.shopName ? 'border-destructive' : ''}
                />
                {errors.shopName && <p className="text-sm text-destructive">{errors.shopName}</p>}
              </div>

              {/* Phone Numbers */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4" />
                  Contact Information
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="10-12 digit phone"
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="whatsapp">WhatsApp Number</Label>
                      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={usePhoneForWhatsapp}
                          onChange={e => setUsePhoneForWhatsapp(e.target.checked)}
                          className="rounded border-border"
                        />
                        Same as phone
                      </label>
                    </div>
                    <Input
                      id="whatsapp"
                      value={usePhoneForWhatsapp ? formData.phone : formData.whatsapp}
                      onChange={e => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                      placeholder="WhatsApp number"
                      disabled={usePhoneForWhatsapp}
                      className={errors.whatsapp ? 'border-destructive' : ''}
                    />
                    {errors.whatsapp && <p className="text-sm text-destructive">{errors.whatsapp}</p>}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  Address *
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Textarea
                    id="street"
                    value={formData.street}
                    onChange={e => setFormData(prev => ({ ...prev, street: e.target.value }))}
                    placeholder="Building, street, landmark..."
                    rows={2}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="area">Area *</Label>
                    <Input
                      id="area"
                      value={formData.area}
                      onChange={e => setFormData(prev => ({ ...prev, area: e.target.value }))}
                      placeholder="Locality / Area"
                      className={errors.area ? 'border-destructive' : ''}
                    />
                    {errors.area && <p className="text-sm text-destructive">{errors.area}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="City"
                      className={errors.city ? 'border-destructive' : ''}
                    />
                    {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="State"
                      className={errors.state ? 'border-destructive' : ''}
                    />
                    {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={e => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      className={errors.pincode ? 'border-destructive' : ''}
                    />
                    {errors.pincode && <p className="text-sm text-destructive">{errors.pincode}</p>}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Save Profile & Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
