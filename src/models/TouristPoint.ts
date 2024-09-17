export interface TouristPointImages {
    id?: number;
    image_path: string;
  }

export interface TouristPoint {
    id: number;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    images:TouristPointImages[];
    average_rating: number;
  }