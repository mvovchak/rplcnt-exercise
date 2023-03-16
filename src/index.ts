import { products } from "./mockData";
import StoreInventory from "./StoreInventory";

const storeInventory: StoreInventory = new StoreInventory(products);

storeInventory.printInventory();

for (let index = 1; index <= 30; index++) {
  storeInventory.updateInventory();
  storeInventory.printInventory();
}
