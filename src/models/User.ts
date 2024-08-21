import Status from "../redux/types/types";
import { Role } from "./RoleModel";

export default interface User {
  user_id: number;
  first_name: string; 
  last_name: string;
  country: string; 
  city: string; 
  birth_date: string; 
  email: string;
  phone_number?: string; 
  gender?: string; 
  subscribed_to_newsletter?: boolean;
  status: Status ;
  token: string;
  image_url?: string;
  exp:number
  roles: Role[]
}

