// src/types.ts

export type ServiceType = 'electricity' | 'water';

export interface MeterAccount {
  meterId: string;
  customerName: string;
  balance: number;
  predictedDays: number;
  lastReadingDate: string;
  meterType: 'prepaid';
}

export interface MeterReading {
  id: string;
  timestamp: number;
  value: number;
  serviceType: ServiceType;
  simulatedHours?: number;
}

