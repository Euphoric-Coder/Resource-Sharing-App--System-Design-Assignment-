import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Item, Message, Review } from '../types';

interface AppState {
  currentUser: User | null;
  users: User[];
  items: Item[];
  messages: Message[];
  reviews: Review[];
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  addItem: (item: Omit<Item, 'id' | 'userId' | 'createdAt' | 'status'>) => void;
  updateItem: (item: Item) => void;
  deleteItem: (itemId: string) => void;
  sendMessage: (toUserId: string, itemId: string, content: string) => void;
  addReview: (toUserId: string, rating: number, comment: string) => void;
  placeBid: (itemId: string, amount: number) => void;
}

// Dummy items data
const dummyItems: Item[] = [
  {
    id: '1',
    userId: '1',
    title: 'Professional Lawn Mower',
    description: 'High-quality lawn mower, perfect for maintaining your garden. Weekly rental available.',
    category: 'tools',
    images: ['https://images.unsplash.com/photo-1590483736622-39da8acf7eb8'],
    type: 'rent',
    price: 45,
    originalPrice: 89,
    isBiddingEnabled: false,
    location: { lat: 40.7128, lng: -74.0060 },
    status: 'available',
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: '1',
    title: 'Mountain Bike',
    description: 'Premium mountain bike in excellent condition. Great for weekend adventures.',
    category: 'sports',
    images: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94e91'],
    type: 'sell',
    price: 299,
    originalPrice: 599,
    isBiddingEnabled: true,
    currentBid: 320,
    location: { lat: 40.7128, lng: -74.0060 },
    status: 'available',
    createdAt: new Date(),
  },
  {
    id: '3',
    userId: '2',
    title: 'Pressure Washer',
    description: 'Powerful pressure washer for rent. Perfect for cleaning driveways and patios.',
    category: 'tools',
    images: ['https://images.unsplash.com/photo-1584515933487-779824d29309'],
    type: 'rent',
    price: 35,
    originalPrice: 65,
    isBiddingEnabled: false,
    location: { lat: 40.7128, lng: -74.0060 },
    status: 'available',
    createdAt: new Date(),
  },
];

// Dummy users data
const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    rating: 4.5,
    reviews: [],
    location: { lat: 40.7128, lng: -74.0060 },
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    rating: 4.8,
    reviews: [],
    location: { lat: 40.7128, lng: -74.0060 },
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: dummyUsers,
      items: dummyItems,
      messages: [],
      reviews: [],

      login: (email, password) => {
        const user = get().users.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },

      register: (name, email, password) => {
        if (get().users.some((u) => u.email === email)) {
          return false;
        }

        const newUser: User = {
          id: crypto.randomUUID(),
          name,
          email,
          password,
          rating: 0,
          reviews: [],
          location: {
            lat: Math.random() * 180 - 90,
            lng: Math.random() * 360 - 180,
          },
        };

        set((state) => ({
          users: [...state.users, newUser],
          currentUser: newUser,
        }));

        return true;
      },

      logout: () => set({ currentUser: null }),

      addItem: (item) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const newItem: Item = {
          ...item,
          id: crypto.randomUUID(),
          userId: currentUser.id,
          createdAt: new Date(),
          status: 'available',
        };

        set((state) => ({
          items: [...state.items, newItem],
        }));
      },

      updateItem: (updatedItem) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          ),
        }));
      },

      deleteItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      sendMessage: (toUserId, itemId, content) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const newMessage: Message = {
          id: crypto.randomUUID(),
          fromUserId: currentUser.id,
          toUserId,
          itemId,
          content,
          createdAt: new Date(),
          read: false,
        };

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },

      addReview: (toUserId, rating, comment) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const newReview: Review = {
          id: crypto.randomUUID(),
          fromUserId: currentUser.id,
          toUserId,
          rating,
          comment,
          createdAt: new Date(),
        };

        set((state) => ({
          reviews: [...state.reviews, newReview],
          users: state.users.map((user) => {
            if (user.id === toUserId) {
              const userReviews = [
                ...user.reviews,
                newReview,
              ];
              const avgRating =
                userReviews.reduce((sum, r) => sum + r.rating, 0) /
                userReviews.length;
              return {
                ...user,
                reviews: userReviews,
                rating: avgRating,
              };
            }
            return user;
          }),
        }));
      },

      placeBid: (itemId, amount) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        set((state) => ({
          items: state.items.map((item) => {
            if (
              item.id === itemId &&
              item.isBiddingEnabled &&
              (!item.currentBid || amount > item.currentBid)
            ) {
              return {
                ...item,
                currentBid: amount,
                highestBidderId: currentUser.id,
              };
            }
            return item;
          }),
        }));
      },
    }),
    {
      name: 'resource-sharing-store',
    }
  )
);