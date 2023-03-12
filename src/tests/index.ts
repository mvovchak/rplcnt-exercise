import Item from "../Item"
import StoreInventory from "../StoreInventory"

let chai = require('chai')
// let sinon = require('sinon')
let sinonChai = require('sinon-chai')
let expect = chai.expect

chai.should()
chai.use(sinonChai)

try {
    let testItems = [
        new Item("test", 10, 10)
    ];
    let testInventory = new StoreInventory(testItems);

    // Decreases quality
    testInventory.updateQuality();
    expect(testItems[0].sellIn).to.equal(9);

    console.log(`✅ Tests passed!`);

} catch (e) {
    console.warn(`❌ Tests failed`);
    console.error(e);
}