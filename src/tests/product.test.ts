import chai from "chai";
import sinonChai from "sinon-chai";
import Product from "../Product";
import { TProductCategory } from "../ProductCategory";

chai.should();
chai.use(sinonChai);

describe("Product tests", () => {
  it("should create a product", () => {
    const productCategory: TProductCategory = {
      id: "TESTCAT1",
      name: "Test category",
      qualityChangePerDay: -1,
      qualityChangePerDayAfterExpiry: -2,
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
    product.expiryDate?.should.be.undefined;
    product.maxShelfLifeDaysAfterExpiry?.should.equal(5);
    product.qualityChangePerDayAfterExpiry.should.equal(-2);
    product.qualityChangePerDay.should.equal(-1);
  });

  it("should create a product with category overrides", () => {
    const productCategory: TProductCategory = {
      id: "TESTCAT1",
      name: "Test category",
      qualityChangePerDay: -1,
      qualityChangePerDayAfterExpiry: -2,
      maxShelfLifeDaysAfterExpiry: 5,
    };

    const product = new Product({
      id: "OLD CHEESE",
      name: "Test Old Cheese",
      initialQuality: 1,
      productCategory,
      qualityChangePerDay: 2,
      qualityChangePerDayAfterExpiry: 3,
      maxShelfLifeDaysAfterExpiry: 10,
    });

    product.productCategory.should.equal(productCategory);
    product.maxShelfLifeDaysAfterExpiry?.should.equal(10);
    product.qualityChangePerDay.should.equal(2);
    product.qualityChangePerDayAfterExpiry.should.equal(3);
  });

  it("should fail to create product outside quality range", () => {
    (function () {
      new Product({
        id: "PRODUCT1",
        name: "Test Product",
        initialQuality: 26,
        expiryDate: new Date(),
        productCategory: {
          id: "TESTCAT1",
          name: "Test category",
          qualityChangePerDay: 1,
          qualityChangePerDayAfterExpiry: 2,
          maxShelfLifeDaysAfterExpiry: 5,
        },
      });
    }.should.throw(RangeError));

    (function () {
      new Product({
        id: "PRODUCT1",
        name: "Test Product",
        initialQuality: -1,
        expiryDate: new Date(),
        productCategory: {
          id: "TESTCAT1",
          name: "Test category",
          qualityChangePerDay: 1,
          qualityChangePerDayAfterExpiry: 2,
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
        expiryDate: new Date(),
        productCategory: {
          id: "TESTCAT1",
          name: "Test category",
          qualityChangePerDay: 1,
          qualityChangePerDayAfterExpiry: 2,
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
  
});
