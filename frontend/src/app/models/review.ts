export interface Review {
  _id: string;
  bookingId: string;
  serviceId: string;
  reviewerId: string;
  revieweeId: string;
  reviewerType: 'tourist' | 'host';
  rating: {
    overall: number;
    cleanliness?: number;
    communication?: number;
    accuracy?: number;
    value?: number;
  };
  comment: string;
  response?: {
    text: string;
    createdAt: Date;
  };
  helpful: number;
  reported: boolean;
  createdAt: Date;
}

