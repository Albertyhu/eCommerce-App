import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type ProductMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CartProductMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type OrderMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type OrderProductMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type AccountInfoMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Product {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly image: string;
  readonly images: string[];
  readonly options?: string[];
  readonly avgRating?: number;
  readonly ratings?: number;
  readonly price: number;
  readonly oldPrice?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Product, ProductMetaData>);
  static copyOf(source: Product, mutator: (draft: MutableModel<Product, ProductMetaData>) => MutableModel<Product, ProductMetaData> | void): Product;
}

export declare class CartProduct {
  readonly id: string;
  readonly userSub: string;
  readonly quantity: number;
  readonly option?: string;
  readonly productID: string;
  readonly product?: Product;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<CartProduct, CartProductMetaData>);
  static copyOf(source: CartProduct, mutator: (draft: MutableModel<CartProduct, CartProductMetaData>) => MutableModel<CartProduct, CartProductMetaData> | void): CartProduct;
}

export declare class Order {
  readonly id: string;
  readonly userSub: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phoneNumber?: number;
  readonly address?: string;
  readonly address2?: string;
  readonly city?: string;
  readonly state?: string;
  readonly zipcode?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Order, OrderMetaData>);
  static copyOf(source: Order, mutator: (draft: MutableModel<Order, OrderMetaData>) => MutableModel<Order, OrderMetaData> | void): Order;
}

export declare class OrderProduct {
  readonly id: string;
  readonly quantity: number;
  readonly option?: string;
  readonly productID: string;
  readonly product?: Product;
  readonly orderID: string;
  readonly order?: Order;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<OrderProduct, OrderProductMetaData>);
  static copyOf(source: OrderProduct, mutator: (draft: MutableModel<OrderProduct, OrderProductMetaData>) => MutableModel<OrderProduct, OrderProductMetaData> | void): OrderProduct;
}

export declare class AccountInfo {
  readonly id: string;
  readonly userSub: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phoneNumber?: number;
  readonly address?: string;
  readonly address2?: string;
  readonly city?: string;
  readonly state?: string;
  readonly zipcode?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<AccountInfo, AccountInfoMetaData>);
  static copyOf(source: AccountInfo, mutator: (draft: MutableModel<AccountInfo, AccountInfoMetaData>) => MutableModel<AccountInfo, AccountInfoMetaData> | void): AccountInfo;
}