export default interface User {
  id: number;
  public_id: string;
  nombre: string;
  apellido: string;
  pais: string;
  ciudad: string;
  fecha_nacimiento: string;
  email: string;
  nro_telefono?: string;
  sexo?: string;
  suscrito_newsletter?: boolean;
  estado: string;
  role: string;
  categories?: number[];
  token: string;
  exp: number;
  image_url?:string
}