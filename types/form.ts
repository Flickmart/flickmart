import { UseFormReturn } from "react-hook-form";

export interface FormDataType {
  category: string;
  location: string;
  exchange: string;
  condition: string;
  title: string;
  description: string;
  price: string;
  store: string;
  phone: string;
  plan: string;
}

export type NameType =
  | "category"
  | "location"
  | "title"
  | "exchange"
  | "condition"
  | "description"
  | "price"
  | "store"
  | "phone"
  | "plan";

export type FormType = UseFormReturn<{
  category: string;
  location: string;
  exchange: string;
  condition: string;
  title: string;
  description: string;
  price: string;
  store: string;
  phone: string;
  plan: string;
}>;
