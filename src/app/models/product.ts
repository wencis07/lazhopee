export interface Product {
  _id?: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;

  store?: {
    _id: string;
    name: string;

    owner?: {
      _id: string;
      name: string;
    };
  };
}
