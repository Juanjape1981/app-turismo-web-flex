import Status from "../redux/types/types";
import { Category } from "./CategoryModels";

export interface PromotionImage {
  image_id: number;
  image_path: string;
  promotion_id: number;
}

export interface Promotion {
  promotion_id: number;
  title: string;
  description: string;
  discount_percentage: number;
  available_quantity: number;
  consumed_quantity: number;
  start_date: string;
  expiration_date: string;
  branch_id: number;
  images: PromotionImage[];
  status: Status;
}

export interface PromotionUpdateModel {
  promotion_id?: number;
  title: string;
  description: string;
  start_date: string; 
  expiration_date: string; 
  qr_code?: string; 
  partner_id: number; 
  categories: Category[]
  images: PromotionImage[];
  status: any;
  discount_percentage: number;
  available_quantity:number
}