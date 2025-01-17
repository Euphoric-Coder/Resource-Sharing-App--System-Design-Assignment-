export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  rating: number;
  reviews: Review[];
  location: {
    lat: number;
    lng: number;
  };
}

export interface Item {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  type: 'rent' | 'sell';
  price: number;
  isBiddingEnabled: boolean;
  currentBid?: number;
  highestBidderId?: string;
  biddingEndDate?: Date;
  location: {
    lat: number;
    lng: number;
  };
  status: 'available' | 'rented' | 'sold';
  rentDuration?: {
    start: Date;
    end: Date;
  };
  createdAt: Date;
}

export interface Review {
  id: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  itemId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}