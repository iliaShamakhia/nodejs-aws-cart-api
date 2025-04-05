export enum CartStatuses {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
}

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type CartItem = {
  cart_id: string;
  product_id: string;
  product?: Product;
  count: number;
};

export type Cart = {
  id: string;
  user_id: string;
  created_at: Date | string;
  updated_at: Date | string;
  status: CartStatuses;
  items: CartItem[];
};
