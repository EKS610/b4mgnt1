export enum VisitorType {
  GUEST = 'Guest',
  CONTRACTOR = 'Contractor',
  MEMBER = 'Member',
  VOLUNTEER = 'Volunteer'
}

export enum VisitorStatus {
  PRE_REGISTERED = 'Pre-Registered',
  PENDING_APPROVAL = 'Pending Approval',
  CHECKED_IN = 'Checked In',
  CHECKED_OUT = 'Checked Out',
  DENIED = 'Denied'
}

export interface Visitor {
  id: string;
  fullName: string;
  location: string;
  email: string;
  type: VisitorType;
  host: string;
  status: VisitorStatus;
  checkInTime?: string;
  checkOutTime?: string;
  photoUrl?: string;
  ndaSigned: boolean;
  notes?: string;
  numberOfNiyaz?: number;
  expectedCheckoutDate?: string;
  identificationId?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface AIExplanationRequest {
  topic: string;
  prompt: string;
}

// -- New Types for Role Management --

export type UserRole = 'ADMIN' | 'VIEWER' | 'BOOKING_MANAGER' | 'KITCHEN_MANAGER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type ViewState = 
  | 'dashboard' 
  | 'log' 
  | 'kiosk' 
  | 'analytics' 
  | 'guide' 
  | 'online-booking' 
  | 'settings'
  | 'users'      // New: User Manager
  | 'rooms'      // New: Room Booking
  | 'kitchen';   // New: Kitchen Section