export interface Book {
  id: string;
  name: string;     
  author: string;       
  description?: string;  
  ownerId: string;       
  available: boolean;   
   photo?: string; 
  createdAt: number;   
}
