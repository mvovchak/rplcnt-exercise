import chai from "chai";
import sinonChai from "sinon-chai";
import Product from "../Product";
import { TProductCategory } from "../ProductCategory";
import DateUtils from "../utils";

chai.should();
chai.use(sinonChai);

describe("Product tests", () => {
  it("should create a product", () => {
    const productCategory: TProductCategory = {
      id: "TESTCAT1",
      name: "Test category",
      qualityChangePerDay: -1,
      qualityChangePerDayAfterSellInDate: -2,
      maxShelfLifeDaysAfterExpiry: 5,
    };

    const product = new Product({
      id: "PRODUCT1",
      name: "Test Product",
      initialQuality: 25,
      productCategory,
    });

    product.currentQuality.should.equal(25);
    product.name.should.equal('Test Product');
    product.id.should.equal('PRODUCT1');
    product.productCategory.should.equal(productCategory);
    product.sellInDate?.should.be.undefined;
    product.maxShelfLifeDaysAfterExpiry?.should.equal(5);
    product.qualityChangePerDayAfterSellInDate.should.equal(-2);
    product.qualityChangePerDay.should.equal(-1);
  });

  it("should create a product with category overrides", () => {
    const productCategory: TProductCategory = {
      id: "TESTCAT1",
      name: "Test category",
      qualityChangePerDay: -1,
      qualityChangePerDayAfterSellInDate: -2,
      maxShelfLifeDaysAfterExpiry: 5,
    };

    const product = new Product({
      id: "OLD CHEESE",
      name: "Test Old Cheese",
      initialQuality: 1,
      productCategory,
      qualityChangePerDay: 2,
      qualityChangePerDayAfterSellInDate: 3,
      maxShelfLifeDaysAfterExpiry: 10,
      onShelfDate: new Date(),
      sellInDate: new Date(),
    });

    product.productCategory.should.equal(productCategory);
    product.maxShelfLifeDaysAfterExpiry?.should.equal(10);
    product.qualityChangePerDay.should.equal(2);
    product.qualityChangePerDayAfterSellInDate.should.equal(3);
  });

  it("should fail to create product outside quality range", () => {
    (function () {
      new Product({
        id: "PRODUCT1",
        name: "Test Product",
        initialQuality: 26,
        sellInDate: new Date(),
        productCategory: {
          id: "TESTCAT1",
          name: "Test category",
          qualityChangePerDay: 1,
          qualityChangePerDayAfterSellInDate: 2,
          maxShelfLifeDaysAfterExpiry: 5,
        },
      });
    }.should.throw(RangeError));

    (function () {
      new Product({
        id: "PRODUCT1",
        name: "Test Product",
        initialQuality: -1,
        sellInDate: new Date(),
        productCategory: {
          id: "TESTCAT1",
          name: "Test category",
          qualityChangePerDay: 1,
          qualityChangePerDayAfterSellInDate: 2,
          maxShelfLifeDaysAfterExpiry: 5,
        },
      });
    }.should.throw(RangeError));
  });

  it("should not set quality outside range", () => {
    const product: Product = new Product({
        id: "PRODUCT1",
        name: "Test Product",
        initialQuality: 2,
        sellInDate: new Date(),
        productCategory: {
          id: "TESTCAT1",
          name: "Test category",
          qualityChangePerDay: 1,
          qualityChangePerDayAfterSellInDate: 2,
          maxShelfLifeDaysAfterExpiry: 5,
        },
      });

      product.currentQuality = 30;
      product.currentQuality.should.equal(25);

      product.currentQuality = 11;
      product.currentQuality.should.equal(11);

      product.currentQuality = -1;
      product.currentQuality.should.equal(0);
  });

  it("should properly set isExpired and isPastSellIn flags", () => {
    const productCategory: TProductCategory = {
      id: "Fish",
      name: "Fish",
      qualityChangePerDay: 0,
      qualityChangePerDayAfterSellInDate: 0,
      maxShelfLifeDaysAfterExpiry: 0,
    };

    const product = new Product({
      id: "SALMON",
      name: "Salmon",
      initialQuality: 1,
      productCategory,
      maxShelfLifeDaysAfterExpiry: 0,
      onShelfDate: DateUtils.addDays(-1, new Date()),
      sellInDate: new Date(),
    });

    product.isExpired.should.be.false;
    product.isPastSellIn.should.be.false;

    product.onShelfDate = new Date();
    product.isExpired.should.be.false;
    product.isPastSellIn.should.be.false;

    const product2 = new Product({
      id: "meat",
      name: "Meat",
      initialQuality: 1,
      productCategory,
      maxShelfLifeDaysAfterExpiry: 1,
      onShelfDate: new Date(),
      sellInDate: DateUtils.addDays(-2, new Date()),
    });

    product2.isExpired.should.be.true;
    product2.isPastSellIn.should.be.true;

    product2.onShelfDate = DateUtils.addDays(-2, new Date());
    product2.isExpired.should.be.false;
    product2.isPastSellIn.should.be.false;

    product2.onShelfDate = DateUtils.addDays(1, new Date());
    product2.isExpired.should.be.true;
    product2.isPastSellIn.should.be.true;

    product2.onShelfDate = DateUtils.addDays(2, new Date());
    product2.isExpired.should.be.true;
    product2.isPastSellIn.should.be.true;
  });
});
