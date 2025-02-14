import { type IModelField } from ".";

export interface IProduct {
  id: string;
  name?: string;
  price: number;
  added_by: string;
  added_on: string;
}

export const productFields: IModelField[] = [
  {
    name: "id",
    label: "ID",
    placeholder: "Enter ID",
    required: true,
    type: "string"
  },
  {
    name: "name",
    label: "Name",
    placeholder: "Enter product name",
    required: false,
    type: "string",
  },
  {
    name: "price",
    alias: "price",
    label: "Price",
    placeholder: "Enter price",
    required: false,
    type: "number"
  },
];