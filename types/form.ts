import type { UseFormReturn } from 'react-hook-form';

export interface FormDataType {
  store: string;
  category: string;
  location: 'enugu' | 'nsukka';
  negotiable: boolean;
  condition: 'brand new' | 'used';
  title: string;
  description: string;
  price: number;
  phone: string;
  plan: 'free' | 'basic' | 'pro' | 'premium';
}

export type NameType =
  | 'category'
  | 'subcategory'
  | 'location'
  | 'title'
  | 'negotiable'
  | 'condition'
  | 'description'
  | 'price'
  | 'store'
  | 'phone'
  | 'plan';

export type FormType = UseFormReturn<{
  store: string;
  category: string;
  subcategory: string;
  location: 'enugu' | 'nsukka';
  negotiable: boolean;
  condition: 'brand new' | 'used';
  title: string;
  description: string;
  price: number | string;
  phone: string;
  plan: 'free' | 'basic' | 'pro' | 'premium';
}>;
