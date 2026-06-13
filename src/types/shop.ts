export type ShopCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
};

export type ShopProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number | null;
  categories: ShopCategory[];
};
