import Status from "../redux/types/types";

export interface TouristPointImages {
    id?: number;
    image_path: string;
  }
  export interface TouristPointImagesCreate {
    filename: string;
    data: string;
  }
export interface TouristPoint {
    id: number;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    images:TouristPointImages[];
    average_rating: number;
    status: Status
  }

  export interface TouristPointCreate {
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    images:TouristPointImagesCreate[];
  }