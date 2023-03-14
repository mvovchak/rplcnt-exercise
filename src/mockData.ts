import Product from "./Product";
import { TProductCategory } from "./ProductCategory";
import DateUtils from "./utils";

export const defaultProductCategory: TProductCategory = {
  id: "DEFAULT",
  name: "Default",
  qualityChangePerDay: -1,
  qualityChangePerDayAfterExpiry: -2,
  maxShelfLifeDaysAfterExpiry: 5,
};

export const organicProductCategory: TProductCategory = {
  id: "ORGANIC",
  name: "Organic Products",
  qualityChangePerDay: -2,
  maxShelfLifeDaysAfterExpiry: 5,
  qualityChangePerDayAfterExpiry: -4,
};

export const products: Product[] = [
  new Product({
    id: "APPLE",
    name: "Apple",
    initialQuality: 10,
    productCategory: defaultProductCategory,
    expiryDate: DateUtils.addDays(10),
  }),
  new Product({
    id: "BANANA",
    name: "Banana",
    initialQuality: 9,
    productCategory: defaultProductCategory,
    expiryDate: DateUtils.addDays(7),
  }),
  new Product({
    id: "STRAWBERRY",
    name: "Strawberry",
    initialQuality: 10,
    productCategory: defaultProductCategory,
    expiryDate: DateUtils.addDays(5),
  }),
  new Product({
    id: "CHEDDAR",
    name: "Cheddar Cheese",
    initialQuality: 16,
    productCategory: defaultProductCategory,
    qualityChangePerDay: 1,
    qualityChangePerDayAfterExpiry: 1,
    // expiryDate: DateUtils.addDays(5), assuming no expiry date is set on cheddar
  }),
  new Product({
    id: "RAMEN",
    name: "Instant Ramen",
    initialQuality: 25,
    productCategory: defaultProductCategory, // Could be a special category instead (non-perishable)
    maxShelfLifeDaysAfterExpiry: undefined,
    qualityChangePerDay: 0,
    qualityChangePerDayAfterExpiry: 0,
  }),
  new Product({
    id: "ORG_AVOCADO",
    name: "Organic Avocado",
    initialQuality: 25,
    productCategory: organicProductCategory,
    expiryDate: DateUtils.addDays(5),
  }),
  new Product({
    id: "ORG_TOMATOES",
    name: "Organic Tomatillos",
    initialQuality: 4,
    productCategory: organicProductCategory,
    expiryDate: DateUtils.addDays(2),
  }),
  new Product({
    id: "PAST_SELLIN",
    name: "Past due date - to be removed",
    initialQuality: 4,
    productCategory: organicProductCategory,
    expiryDate: DateUtils.addDays(-4),
  }),
  /*   new Product({
        id: "INVALID_PRODUCT1",
        name: "INVALID_PRODUCT1",
        initialQuality: 25,
        productCategory: DefaultProductCategory,
        expiryDate: DateUtils.addDays(-1),
      }),
      new Product({
        id: "INVALID_PRODUCT2",
        name: "INVALID_PRODUCT2",
        initialQuality: -1,
        productCategory: DefaultProductCategory,
      }), */
];