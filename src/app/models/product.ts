export class Product {
    id: number = 0;
    name: string = "";
    price: number = 0;
    imageUrl: string = "";
    owner: {
        _id: string;
        name: string;
    } = { _id: "", name: "" }

}
