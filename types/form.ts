import { UseFormReturn } from "react-hook-form";

export interface FormDataType {
  store: string;
  category: string;
  location: "enugu" | "nsukka";
  exchange: boolean;
  condition: "brand new" | "used";
  title: string;
  description: string;
  price: number;
  phone: string;
  plan: "basic" | "pro" | "premium";
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
  store: string;
  category: string;
  location: "enugu" | "nsukka";
  exchange: boolean;
  condition: "brand new" | "used";
  title: string;
  description: string;
  price: number | string;
  phone: string;
  plan: "basic" | "pro" | "premium";
}>;
