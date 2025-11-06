export interface User {
  _id: string;
  email: string;
  role: 'tourist' | 'host' | 'admin' | 'provider';
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    bio?: string;
    languages?: string[];
    location?: {
      city: string;
      country: string;
    };
  };
  oauth?: {
    googleId?: string;
    facebookId?: string;
  };
  verification: {
    email: boolean;
    phone: boolean;
    identity: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

