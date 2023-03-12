/**

  ======================================================
  Replicant Grocery Inventory Requirements Specification
  ======================================================

  Hi and welcome to team Replicant. As you know, we have extended our platform functionality to include 
  grocery inventory management. We also buy and sell only the finest goods. Unfortunately, our goods 
  are constantly degrading in quality as they approach their sell by date. We have a system in place 
  that updates our inventory for us. It was developed by a no-nonsense type named Iain, who has working 
  on self-service work. Your task is to add the new feature to our system so that we can begin selling 
  a new category of items. First an introduction to our system:

    - All items have a SellIn value which denotes the number of days we have to sell the item
    - All items have a Quality value which denotes how valuable the item is
    - At the end of each day our system lowers both values for every item

  Pretty simple, right? Well this is where it gets interesting:

    - Once the sellIn date has passed, Quality degrades twice as fast
    - The Quality of an item is never negative
    - The Quality of an item is never more than 25
    - "Cheddar Cheese" actually increases in Quality the older it gets
    - "Instant Ramen", never has to be sold or decreases in Quality

  We have recently signed a supplier of organic items. This requires an update to our system:

    - "Organic" items degrade in Quality twice as fast as normal items
    - Once ANY item is 5 days past its sellIn date we can no longer sell it and it should be removed from our system
  
  Your objectives for this challenge: 

    - We are looking to see how your technical approach considers these two themes:
      - Adding functionality that aligns with the spec posted above 
      - Improving old/ugly code to be be more readable, maintainable and testable
    - Unit testing is important to us so we have included Chai for test writing (https://www.chaijs.com/api/bdd/)
    - You don't have to know everything! Feel free to use Google. 
    - We're not interested in how fast you can code. Take as much time as you need to ensure your submission 
      reflects your best work.
    - If you find you're out of time, please note anything you wanted to do and how you would have done it.
      Please be as descriptive as possible.
    
*/

/**  
 * Classes
 */

class Item {
    name: string;
    sellIn: number;
    quality: number;
    size?: boolean;

    constructor(name: string, sellIn: number, quality: number) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}

class StoreInventory {
    items: Array<Item>;

    constructor(items = [] as Array<Item> ) {
        this.items = items;
    }

    updateQuality() {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].name != 'Cheddar Cheese') {
                // if (this.items[i].sellIn < 3) { # Summer sale promotion
                //     this.items[i].onSale = true;
                // }
                if (this.items[i].quality > 0) {
                    if (this.items[i].name != 'Instant Ramen') {
                        this.items[i].quality = this.items[i].quality - 1
                    }
                }
            } else {
                // if (this.items[i].sellIn < 3) { # Summer sale promotion
                //     this.items[i].onSale = true;
                // }              
                if (this.items[i].quality < 50) {
                    this.items[i].quality = this.items[i].quality + 1
                }
            }
            if (this.items[i].name != 'Instant Ramen') {
                this.items[i].sellIn = this.items[i].sellIn - 1;
            }
            if (this.items[i].sellIn < 0) {
                if (this.items[i].name != 'Cheddar Cheese') {
                    this.items[i].quality = this.items[i].quality - this.items[i].quality
                } else {
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

let days: number = 2;

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


/**  
 * Unit Tests 
 */

let chai = require('chai')
let sinon = require('sinon')
let sinonChai = require('sinon-chai')
let expect = chai.expect

chai.should()
chai.use(sinonChai)

try {

    let testItmes = [
        new Item("test", 10, 10)
    ];
    let testInventory = new StoreInventory(testItmes);

    // Decreases quality
    testInventory.updateQuality();
    expect(testItmes[0].sellIn).to.equal(9);

    console.log(`✅ Tests passed!`);

} catch (e) {
    console.warn(`❌ Tests failed`);
    console.error(e);
}