import Product from "./Product";
import { TProductCategory } from "./ProductCategory";
import DateUtils from "./utils";

export const defaultProductCategory: TProductCategory = {
  id: "DEFAULT",
  name: "Default",
  qualityChangePerDay: -1,
  qualityChangePerDayAfterSellInDate: -2,
  maxShelfLifeDaysPastSellIn: 5,
};

export const organicProductCategory: TProductCategory = {
  id: "ORGANIC",
  name: "Organic Products",
  qualityChangePerDay: -2,
  maxShelfLifeDaysPastSellIn: 5,
  qualityChangePerDayAfterSellInDate: -4,
};

export const products: Product[] = [
  new Product({
    id: "APPLE",
    name: "Apple",
    initialQuality: 10,
    productCategory: defaultProductCategory,
    sellInDate: DateUtils.addDays(10),
  }),
  new Product({
    id: "BANANA",
    name: "Banana",
    initialQuality: 9,
    productCategory: defaultProductCategory,
    sellInDate: DateUtils.addDays(7),
  }),
  new Product({
    id: "STRAWBERRY",
    name: "Strawberry",
    initialQuality: 10,
    productCategory: defaultProductCategory,
    sellInDate: DateUtils.addDays(5),
  }),
  new Product({
    id: "CHEDDAR",
    name: "Cheddar Cheese",
    initialQuality: 16,
    productCategory: defaultProductCategory,
    qualityChangePerDay: 1,
    qualityChangePerDayAfterSellInDate: 1,
    // sellInDate: DateUtils.addDays(5), assuming no expiry date is set on cheddar
  }),
  new Product({
    id: "RAMEN",
    name: "Instant Ramen",
    initialQuality: 25,
    productCategory: defaultProductCategory, // Could be a special category instead (non-perishable)
    maxShelfLifeDaysPastSellIn: undefined,
    qualityChangePerDay: 0,
    qualityChangePerDayAfterSellInDate: 0,
  }),
  new Product({
    id: "ORG_AVOCADO",
    name: "Organic Avocado",
    initialQuality: 25,
    productCategory: organicProductCategory,
    sellInDate: DateUtils.addDays(5),
  }),
  new Product({
    id: "ORG_TOMATOES",
    name: "Organic Tomatillos",
    initialQuality: 4,
    productCategory: organicProductCategory,
    sellInDate: DateUtils.addDays(2),
  }),
  new Product({
    id: "PAST_SELLIN",
    name: "Past due date - to be removed",
    initialQuality: 4,
    productCategory: organicProductCategory,
    sellInDate: DateUtils.addDays(-4),
  }),
];
