import Item from "./Item";

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

export default StoreInventory;
