import { Branch } from "./BranchModels";
import { Category } from "./CategoryModels";

export interface Partner {
    address: string;
    business_type: string;
    contact_info: string;
    user: {
        user_id: number;
        first_name: string;
        last_name: string;
        email: string;
        birth_date: string;
        city: string;
        country: string;
        gender: string;
        phone_number: string;
        status: string;
        subscribed_to_newsletter: boolean;
        image_url: string;
    };
    categories: Category[];
    branches: Branch[];
    user_id: number;
  }

export interface PartnerCreate {
    user_id: number,
    address: string,
    contact_info: string,
    business_type: string,
    category_ids: number[]
}