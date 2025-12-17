/**
 * 공통 캠페인 타입 정의
 */

export type ProductCategory = {
  id: string;
  name: string;
  parent_id: string | null;
};

export type Product = {
  name: string;
  price: number | null;
  image_url: string | null;
  description: string;
  category_id?: string | null;
  product_categories?: ProductCategory | null;
};

export type Campaign = {
  id: string;
  status?: string;
  created_at?: string;
  reward_type: string;
  reward_amount: number | null;
  conditions: { min_followers: number };
  products: Product | Product[] | null;
};

