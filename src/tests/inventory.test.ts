import StoreInventory from "../StoreInventory";
import chai from "chai";
import sinonChai from "sinon-chai";
import { products } from "../mockData";
import DateUtils from "../utils";
import Product from "../Product";
import sinon from "sinon";

chai.should();
chai.use(sinonChai);

describe("Test Store Inventory", () => {
  it("should initialize product inventory with mock data", () => {
    const storeInventory: StoreInventory = new StoreInventory(products);
    storeInventory.products.should.be.an("array").that.has.length(8);
    storeInventory.products.should.eql(products);
    storeInventory.printInventory();
  });

  it("should initialize product inventory with no products", () => {
    const storeInventory: StoreInventory = new StoreInventory([]);
    storeInventory.products.should.be.an("array").that.is.empty;
  });

  it("should update inventory with one product with shelf life and daily quality decrease", () => {
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
          maxShelfLifeDaysAfterExpiry: 5,
        },
      }),
    ]);

    const {
      products: [product],
    } = storeInventory;

    storeInventory.currentDate
      .toDateString()
      .should.equal(new Date().toDateString());

    product.onShelfDate.toDateString().should.equal(new Date().toDateString());

    product.initialQuality.should.eq(2);
    product.currentQuality.should.eq(2);
    product.isRemoved.should.be.false;
    product.isExpired.should.be.false;

    const days = 3;

    Array(days)
      .fill(0)
      .map((_, i) => {
        storeInventory.updateInventory();
        storeInventory.currentDate
          .toDateString()
          .should.equal(DateUtils.addDays(i + 1).toDateString());
      });

    storeInventory.currentDate
      .toDateString()
      .should.equal(DateUtils.addDays(days).toDateString());
    
    product.currentQuality.should.eq(0);
    product.isRemoved.should.be.false;
    product.sellInDays?.should.eq(-3);

    storeInventory.updateInventory();

    product.currentQuality.should.eq(0);
    product.initialQuality.should.eq(2);
    product.sellInDays?.should.eq(-4);
    product.isExpired.should.be.false;
    product.isRemoved.should.be.false;
    product.isPastSellIn.should.be.true;

    storeInventory.currentDate
      .toDateString()
      .should.equal(product.onShelfDate.toDateString());

    storeInventory.updateInventory();
    storeInventory.updateInventory();

    product.isExpired.should.be.true;
    product.isRemoved.should.be.true;
    product.sellInDays?.should.eq(-6);
    product.isPastSellIn.should.be.true;
  });

  it("should not remove non-perishable product", () => {
    const product: Product = new Product({
      id: "PRODUCT1",
      name: "Test Product",
      initialQuality: 25,
      sellInDate: undefined,
      productCategory: {
        id: "TESTCAT1",
        name: "Test category",
        qualityChangePerDay: 0,
        qualityChangePerDayAfterSellInDate: 0,
        maxShelfLifeDaysAfterExpiry: undefined,
      },
    });
    const storeInventory: StoreInventory = new StoreInventory([product]);

    storeInventory.currentDate
      .toDateString()
      .should.equal(new Date().toDateString());
    product.initialQuality.should.eq(25);
    product.currentQuality.should.eq(25);
    product.isRemoved.should.be.false;
    product.isExpired.should.be.false;

    const days = 10;
    Array(days)
      .fill(0)
      .map((_, i) => {
        storeInventory.updateInventory();
        storeInventory.currentDate
          .toDateString()
          .should.equal(DateUtils.addDays(i + 1).toDateString());
      });

    product.currentQuality.should.eq(25);
    product.isRemoved.should.be.false;
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
          maxShelfLifeDaysAfterExpiry: undefined,
        },
      }),
    ]);

    const {
      products: [product],
    } = storeInventory;
    product.isRemoved.should.be.false;

    const days = 27;
    Array(days)
      .fill(0)
      .map(() => {
        storeInventory.updateInventory();
      });

    product.currentQuality.should.eq(25);
    product.isRemoved.should.be.false;
  });

  it("should update daily quality for custom product (Ramen) - non-perishable, quality stays the same", () => {
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
          maxShelfLifeDaysAfterExpiry: undefined,
        },
      }),
    ]);

    const {
      products: [product],
    } = storeInventory;

    const days = 27;
    Array(days)
      .fill(0)
      .map(() => {
        storeInventory.updateInventory();
      });

    product.currentQuality.should.eq(23);
    product.isRemoved.should.be.false;
    product.isExpired.should.be.false;
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
          maxShelfLifeDaysAfterExpiry: 2,
        },
      }),
    ]);

    const {
      products: [product],
    } = storeInventory;

    const inventorySpy = sinon.spy(storeInventory, 'updateInventory');

    Array(3)
    .fill(0)
    .map(() => {
      storeInventory.updateInventory();
    });

    product.currentQuality.should.eq(0);
    product.sellInDays?.should.eq(3);
    product.isExpired.should.be.false;
    product.isPastSellIn.should.be.false;

    Array(4)
    .fill(0)
    .map(() => {
      storeInventory.updateInventory();
    });

    inventorySpy.should.have.callCount(7);

    product.isPastSellIn.should.be.true;
    product.sellInDays?.should.equal(-1)
    product.isRemoved.should.be.false;

    storeInventory.updateInventory();
    storeInventory.updateInventory();

    Array(4)
    .fill(0)
    .map(() => {
      storeInventory.updateInventory();
    });

    product.isRemoved.should.be.true;
  });

  it("should remove off-shelf products", () => {
    const storeInventory: StoreInventory = new StoreInventory(products);
    storeInventory.products.should.eql(products);
    storeInventory.printInventory();

    Array(30)
    .fill(0)
    .map(() => {
      storeInventory.updateInventory();
    });

    storeInventory.products.should.have.length(8);
    storeInventory.deleteRemovedProducts();
    storeInventory.products.should.have.length(2);
  });
});
