import { type Database } from "~/postgrest/database";
import { type ICustomer, customerFields } from './customer'
import { type IOrder, orderFields } from './order';
import { type IUser, ERole, userFields } from './user';
import { type IProduct, productFields } from './product';

// See stores/formFields.ts as an example.
// It is recommended to use ChatGPT or another LLM to generate IModelField based on the .entity.ts file
export interface IModelField {
  name: string;
  alias?: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: "string" | "date" | "number" | "boolean" | "list" | "password";
  list_type?: keyof Database["Tables"];
  list_title?: boolean;
  list_fields?: IModelField[];
  title?: boolean;
}

export {
  type IProduct,
  type ICustomer,
  type IOrder,
  type IUser,
  type ERole,
  orderFields,
  customerFields,
  userFields,
  productFields
}