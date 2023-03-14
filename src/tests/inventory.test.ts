// import Product from "../Product";
import StoreInventory from "../StoreInventory";
import chai from "chai";
import sinonChai from "sinon-chai";
import Product from "../Product";
import { TProductCategory } from "../ProductCategory";
import { products } from "../mockData";
// import sinon from "sinon";

chai.should();
chai.use(sinonChai);

describe("Test Store Inventory", () => {
  it("should initialize product inventory with mock data", () => {
    const storeInventory: StoreInventory = new StoreInventory(products);
    storeInventory.products.should.be.an("array").that.has.length(8);
  });

  it("should initialize product inventory with no products", () => {
    const storeInventory: StoreInventory = new StoreInventory([]);
    storeInventory.products.should.be.an("array").that.is.empty;
  });

  it("should create an inventory with two products", () => {
    const productCategory: TProductCategory = {
      id: "TESTCAT1",
      name: "Test category",
      qualityChangePerDay: 1,
      qualityChangePerDayAfterExpiry: 2,
      maxShelfLifeDaysAfterExpiry: 5,
    };

    const product = new Product({
      id: "PRODUCT1",
      name: "Test Product",
      initialQuality: 25,
      productCategory,
    });

    const product2 = new Product({
      id: "PRODUCT2",
      name: "Test Product 2",
      initialQuality: 0,
      productCategory,
    });

    const storeInventory: StoreInventory = new StoreInventory([
      product,
      product2,
    ]);
    storeInventory.products.should.be.an("array").that.has.length(2);
  });

  it("should update daily quality and set product as removed", () => {
    const storeInventory: StoreInventory = new StoreInventory(products);
  });

  it("should update daily quality for custom product (Cheddar cheese)", () => {});

  it("should update daily quality for custom product (Ramen)", () => {});

  it("should update daily quality for custom product (Organic)", () => {});

  it("should remove off-shelf products", () => {});
});
