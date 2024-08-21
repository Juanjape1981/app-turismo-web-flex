import { Functionality } from './FunctionalityModel';

export interface Role {
    role_id: number;
    role_name: string;
    functionalities: Functionality[];
}
