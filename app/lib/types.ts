export type UserRole = "ADMIN" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type CarCondition = "NEW" | "USED" | "DAMAGED";
export type ListingType = "SALE" | "RENT" | "DAMAGED";
export type ListingStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  condition: CarCondition;
  specs?: {
    hp?: string;
    fuel?: string;
    transmission?: string;
  };
}

export interface Listing {
  id: string;
  carId: string;
  car?: Car; // Joined data
  type: ListingType;
  price: number;
  status: ListingStatus;
  description: string;
  details?: string; // New field
  notes?: string;   // New field
  mainImage: string;
  images: string[];
  createdAt: any; // Firestore Timestamp
  featured?: boolean;
}

export interface Rental extends Listing {
  pricePerDay: number;
  availability: {
    startDate: any;
    endDate: any;
  }[];
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  location?: string;
  carDetails: string;
  images: string[];
  status: "NEW" | "CONTACTED" | "ARCHIVED";
  createdAt: any;
}

export interface Reservation {
  id: string;
  rentalId: string;
  carDetails?: string; // For admin display
  name: string;
  phone: string;
  email: string;
  location: string;
  startDate: { seconds: number };
  endDate: { seconds: number };
  status: "PENDING" | "CONTACTED" | "CONFIRMED" | "PENDING_CONFLICT";
  conflict: boolean;
  alternativeStartDate?: { seconds: number } | null;
  alternativeEndDate?: { seconds: number } | null;
  createdAt: { seconds: number };
}

export type ServiceType = "RENT" | "SALE" | "GLOBAL";
export type ReviewStatus = "VISIBLE" | "HIDDEN";

export interface Review {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  rating: number;
  comment: string;
  serviceType: ServiceType;
  relatedId?: string;
  status: ReviewStatus;
  createdAt: any;
}
