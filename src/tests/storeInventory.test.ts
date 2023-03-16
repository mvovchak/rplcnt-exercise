import StoreInventory from "../StoreInventory";
import chai from "chai";
import sinonChai from "sinon-chai";
import { products } from "../mockData";
import DateUtils from "../utils";
import Product from "../Product";
import sinon from "sinon";

chai.should();
chai.use(sinonChai);

describe("StoreInventory", () => {
  it("should initialize product inventory with mock data", () => {
    const storeInventory: StoreInventory = new StoreInventory(products);
    storeInventory.products.should.be.an("array").that.has.length(8);
    storeInventory.currentDate
      .toDateString()
      .should.eq(new Date().toDateString());
  });

  it("should initialize product inventory with no products", () => {
    const storeInventory: StoreInventory = new StoreInventory([]);
    storeInventory.products.should.be.an("array").that.is.empty;
  });

  it("should update the inventory and its product attributes", () => {
    const storeInventory: StoreInventory = new StoreInventory([
      new Product({
        id: "PRODUCT1",
        name: "Test Product",
        initialQuality: 2,
        sellInDate: new Date(),
        productCategory: {
          id: "TESTCAT1",
          name: "Test category",
          qualityChangePerDay: -1,
          qualityChangePerDayAfterSellInDate: -2,
          maxShelfLifeDaysPastSellIn: 5,
        },
      }),
    ]);

    const {
      products: [product],
    } = storeInventory;
    const inventorySpy = sinon.spy(storeInventory, "updateInventory");

    storeInventory.currentDate
      .toDateString()
      .should.equal(new Date().toDateString());

    product.onShelfDate.toDateString().should.equal(new Date().toDateString());

    product.initialQuality.should.eq(2);
    product.currentQuality.should.eq(2);
    product.isExpired.should.be.false;
    product.isExpired.should.be.false;

    const days = 3;

    Array.from(Array(days).keys()).map((_, i) => {
      storeInventory.updateInventory();
      storeInventory.currentDate
        .toDateString()
        .should.equal(DateUtils.addDays(i + 1).toDateString());
    });

    product.currentQuality.should.eq(0);
    product.isExpired.should.be.false;
    product.sellInDays?.should.eq(-3);

    storeInventory.updateInventory();

    product.currentQuality.should.eq(0);
    product.initialQuality.should.eq(2);
    product.sellInDays?.should.eq(-4);
    product.isExpired.should.be.false;
    product.isExpired.should.be.false;
    product.isPastSellIn.should.be.true;

    storeInventory.currentDate
      .toDateString()
      .should.equal(product.onShelfDate.toDateString());

    Array.from(Array(2).keys()).map(() => {
      storeInventory.updateInventory();
    });

    product.isExpired.should.be.true;
    product.isExpired.should.be.true;
    product.sellInDays?.should.eq(-6);
    product.isPastSellIn.should.be.true;

    inventorySpy.should.have.callCount(6);
  });

  it("should not expire non-perishable product", () => {
    const product: Product = new Product({
      id: "PRODUCT1",
      name: "Test Product",
      initialQuality: 25,
      sellInDate: undefined,
      productCategory: {
        id: "TESTCAT1",
        name: "Non-perishable",
        qualityChangePerDay: 0,
        qualityChangePerDayAfterSellInDate: 0,
        maxShelfLifeDaysPastSellIn: undefined,
      },
    });
    const storeInventory: StoreInventory = new StoreInventory([product]);
    const inventorySpy = sinon.spy(storeInventory, "updateInventory");

    storeInventory.currentDate
      .toDateString()
      .should.equal(new Date().toDateString());
    product.initialQuality.should.eq(25);
    product.currentQuality.should.eq(25);
    product.isExpired.should.be.false;

    const days = 10;
    Array.from(Array(days).keys()).map(() => {
      storeInventory.updateInventory();
    });

    product.currentQuality.should.eq(25);
    product.isExpired.should.be.false;
    product.isPastSellIn.should.be.false;
    product.sellInDays?.should.eq(0);
    inventorySpy.should.have.callCount(10);
  });

  it("should update daily quality for custom product (Cheddar cheese) - no expiry + increase in quality", () => {
    const storeInventory: StoreInventory = new StoreInventory([
      new Product({
        id: "CHEDDAR",
        name: "Cheddar Cheese",
        initialQuality: 1,
        sellInDate: undefined,
        productCategory: {
          id: "TESTCAT1",
          name: "Test category",
          qualityChangePerDay: 1,
          qualityChangePerDayAfterSellInDate: 1,
          maxShelfLifeDaysPastSellIn: undefined,
        },
      }),
    ]);

    const inventorySpy = sinon.spy(storeInventory, "updateInventory");

    const {
      products: [product],
    } = storeInventory;

    product.isExpired.should.be.false;
    product.isPastSellIn.should.be.false;

    Array.from(Array(24).keys()).map(() => {
      storeInventory.updateInventory();
    });

    product.currentQuality.should.eq(25);
    product.isExpired.should.be.false;
    product.isPastSellIn.should.be.false;
    product.sellInDays?.should.eq(0);
    inventorySpy.should.have.callCount(24);
  });

  it("should update the inventory with a custom product (Ramen) - non-perishable, quality stays the same", () => {
    const storeInventory: StoreInventory = new StoreInventory([
      new Product({
        id: "RAMEN",
        name: "Ramen Noodle",
        initialQuality: 23,
        sellInDate: undefined,
        productCategory: {
          id: "TESTCAT1",
          name: "Test category",
          qualityChangePerDay: 0,
          qualityChangePerDayAfterSellInDate: 0,
          maxShelfLifeDaysPastSellIn: undefined,
        },
      }),
    ]);

    const {
      products: [product],
    } = storeInventory;
    const inventorySpy = sinon.spy(storeInventory, "updateInventory");

    const days = 27;
    Array.from(Array(days).keys()).map(() => {
      storeInventory.updateInventory();
    });

    product.currentQuality.should.eq(23);
    product.isExpired.should.be.false;
    product.isPastSellIn.should.be.false;
    product.sellInDays?.should.eq(0);
    inventorySpy.should.have.callCount(days);
  });

  it("should update daily quality for custom product (Organic)", () => {
    const storeInventory: StoreInventory = new StoreInventory([
      new Product({
        id: "APPLEJUICE",
        name: "Apple Juice",
        initialQuality: 6,
        sellInDate: DateUtils.addDays(6, new Date()),
        onShelfDate: new Date(),
        productCategory: {
          id: "ORGANIC",
          name: "Organic Products",
          qualityChangePerDay: -2,
          qualityChangePerDayAfterSellInDate: -4,
          maxShelfLifeDaysPastSellIn: 2,
        },
      }),
    ]);

    const {
      products: [product],
    } = storeInventory;

    const inventorySpy = sinon.spy(storeInventory, "updateInventory");

    storeInventory.updateInventory();
    product.currentQuality.should.eq(4);
    product.sellInDays?.should.eq(5);
    product.isPastSellIn.should.be.false;

    Array.from(Array(2).keys()).map(() => {
      storeInventory.updateInventory();
    });

    product.currentQuality.should.eq(0);
    product.sellInDays?.should.eq(3);
    product.isExpired.should.be.false;
    product.isPastSellIn.should.be.false;

    Array.from(Array(4).keys()).map(() => {
      storeInventory.updateInventory();
    });

    product.isPastSellIn.should.be.true;
    product.sellInDays?.should.equal(-1);
    product.isExpired.should.be.false;

    Array.from(Array(6).keys()).map(() => {
      storeInventory.updateInventory();
    });

    inventorySpy.should.have.callCount(13);

    product.isExpired.should.be.true;
  });

  it("should remove products from inventory", () => {
    const storeInventory: StoreInventory = new StoreInventory(products);

    Array.from(Array(30).keys()).map(() => {
      storeInventory.updateInventory();
    });

    storeInventory.products.should.have.length(8);
    storeInventory.deleteExpiredProducts();
    storeInventory.products.should.have.length(2);
  });
});
