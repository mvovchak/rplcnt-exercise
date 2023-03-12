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

export default Item;
