import { products } from "./mockData";
import StoreInventory from "./StoreInventory";

const storeInventory: StoreInventory = new StoreInventory(products);

storeInventory.printInventory();

const days = 30;

Array(days).fill(0).map(() => {
  storeInventory.updateInventory();
  storeInventory.printInventory();
})