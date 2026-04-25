export interface CourtBooking {
  id: string;
  courtId: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  customerName: string;
  phoneNumber: string;
  numberOfPlayers: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export interface Court {
  id: string;
  name: string;
  type: CourtType;
  maxPlayers: number;
  pricePerHour: number;
  isAvailable: boolean;
}

export enum CourtType {
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM'
}

export interface ChatbotBookingState {
  step: BookingStep;
  booking: Partial<CourtBooking>;
  temporaryData: {
    selectedDate?: string;
    selectedTime?: string;
    selectedCourt?: Court;
  };
}

export enum BookingStep {
  NONE = 'NONE',
  GREETING = 'GREETING',
  GET_DATE = 'GET_DATE',
  GET_TIME = 'GET_TIME',
  GET_COURT = 'GET_COURT',
  GET_PLAYERS = 'GET_PLAYERS',
  GET_CUSTOMER_NAME = 'GET_CUSTOMER_NAME',
  GET_PHONE = 'GET_PHONE',
  CONFIRM_BOOKING = 'CONFIRM_BOOKING',
  BOOKING_COMPLETE = 'BOOKING_COMPLETE',
  ERROR = 'ERROR'
} 