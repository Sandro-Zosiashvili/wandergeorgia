import { unsplash } from '@/lib/images';

export interface FleetCar {
  id: string;
  image: string;
}

/** Photos of the vehicles used on tours — shown as an endless marquee. */
export const fleetCars: FleetCar[] = [
  { id: 'car-1', image: unsplash('photo-1776924550855-ebe29ac3a13c', 1000) },
  { id: 'car-2', image: unsplash('photo-1758228703180-53284febded6', 1000) },
  { id: 'car-3', image: unsplash('photo-1735620731955-b047a7122892', 1000) },
  { id: 'car-4', image: unsplash('photo-1767749995450-7b63ab7cd4fd', 1000) },
  { id: 'car-5', image: unsplash('photo-1599758918450-c0d699978e59', 1000) },
  { id: 'car-6', image: unsplash('photo-1592309905620-e5b59f6dcb98', 1000) },
  { id: 'car-7', image: unsplash('photo-1700329694402-baa26366b29e', 1000) },
  { id: 'car-8', image: unsplash('photo-1660108373105-4ebb16096b29', 1000) },
];
