import Item from './Item';
import StoreInventory from './StoreInventory';

/**  
 * Implementation
 */

let items = [
    new Item("Apple", 10, 10),
    new Item("Banana", 7, 9),
    new Item("Strawberry", 5, 10),
    new Item("Cheddar Cheese", 10, 16),
    new Item("Instant Ramen", 0, 5),
    // this Organic item does not work properly yet
    new Item("Organic Avocado", 5, 16)
];


let storeInventory = new StoreInventory(items);

let days: number = 20;

for (let i = 0; i < days; i++) {
    console.log("Day " + i + "  ---------------------------------");
    console.log("                  name      sellIn quality");
    let data = items.map(element => {
        return [element.name, element.sellIn, element.quality];

    });
    console.table(data)

    console.log();
    storeInventory.updateQuality();
}
