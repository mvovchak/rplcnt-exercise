/* eslint-disable */

class Item {
    name: string;
    sellIn: number; // #MV# unclear property name
    quality: number;
    size?: boolean; // #MV# where is this used?

    constructor(name: string, sellIn: number, quality: number) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}

class StoreInventory {
    items: Array<Item>; // #MV#: Item[] notation may be easier

    constructor(items = [] as Array<Item> ) { // #MV#: an alias seems unnecessary 
        this.items = items;
    }

    updateQuality() { // no return type
        for (let i = 0; i < this.items.length; i++) { // #MV#: simpler with array methods like items.forEach
            
             // #MV#: Logic seems overly complex and contains errors
             // #MV#: Verbose, unclear if statements, also != converts types, not safe
             // #MV#: name comparisons, better to use ids, since names can change
             // #MV#: left over comments
             // #MV#: Inconsistent styling

            if (this.items[i].name != 'Cheddar Cheese') {
                // #MV#: seems like left over comment. evaluate simpler promotion application
                // if (this.items[i].sellIn < 3) { # Summer sale promotion
                //     this.items[i].onSale = true;
                // }
                if (this.items[i].quality > 0) {
                    if (this.items[i].name != 'Instant Ramen') {
                        this.items[i].quality = this.items[i].quality - 1 //styling
                    }
                }
            } else { // #MV# unclear this is for Cheddar cheese

                // #MV#: remove comment
                // if (this.items[i].sellIn < 3) { # Summer sale promotion
                //     this.items[i].onSale = true;
                // }
                
                // #MV#: logic error, random number - needs identifier
                if (this.items[i].quality < 50) {
                    this.items[i].quality = this.items[i].quality + 1
                }
            }

            

            // #MV Comparison by string not sustainable. Add some kind of ID
            // #MV# Code repetition
            if (this.items[i].name != 'Instant Ramen') {
                this.items[i].sellIn = this.items[i].sellIn - 1;
            }
            if (this.items[i].sellIn < 0) {
                if (this.items[i].name != 'Cheddar Cheese') {
                    this.items[i].quality = this.items[i].quality - this.items[i].quality // #MV# 0 ??
                } else { // #MV# Cheddar cheese, same random number as on l36
                    if (this.items[i].quality < 50) {
                        this.items[i].quality = this.items[i].quality + 1
                    }
                }
            }
        }

        return this.items;
    }
}

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

export {};
