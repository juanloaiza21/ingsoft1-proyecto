export interface Trip {
  id: string;
  origin: string;
  destination: string;
  departureDate: Date | string;
  beginDate: Date | string;
  endDate: Date | string;
  status: string; // Add other statuses as needed
  driverId: string;
  price: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}
