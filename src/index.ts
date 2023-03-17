import { products } from './mockData';
import StoreInventory from './StoreInventory';

const storeInventory: StoreInventory = new StoreInventory(products);

storeInventory.printInventory();

const days = 30;

Array.from(Array(days).keys()).forEach(() => {
  storeInventory.updateInventory();
  storeInventory.printInventory();
});
