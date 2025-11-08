export interface Service {
  _id: string;
  hostId: string;
  category: 'Space' | 'Skills' | 'Connect';
  title: string;
  description: string;
  images: string[];
  location: {
    address: string;
    city: string;
    region: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  pricing: {
    basePrice: number;
    currency: string;
    unit: 'hour' | 'day' | 'night' | 'session';
    discounts?: {
      weekly?: number;
      monthly?: number;
    };
  };
  availability: {
    calendar: Array<{
      date: Date;
      available: boolean;
    }>;
    instantBook: boolean;
    minBookingTime: number;
    maxBookingTime: number;
  };
  amenities?: string[];
  rules?: string[];
  capacity?: number;
  duration?: number;
  rating: {
    average: number;
    count: number;
  };
  status: 'draft' | 'pending' | 'active' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceFilter {
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  instantBook?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

