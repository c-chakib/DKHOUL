export interface Booking {
  _id: string;
  serviceId: string;
  touristId: string;
  hostId: string;
  bookingDate: Date;
  endDate?: Date;
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'disputed';
  payment: {
    status: 'pending' | 'paid' | 'refunded' | 'failed';
    amount: number;
    currency: string;
  };
  guestDetails: {
    name: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  cancellation?: {
    cancelledBy: 'tourist' | 'host';
    reason: string;
    refundAmount: number;
    cancelledAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

