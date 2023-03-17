/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import chai from 'chai';
import sinonChai from 'sinon-chai';
import Product from '../Product';
import { type TProductCategory } from '../ProductCategory';
import DateUtils from '../utils';

chai.should();
chai.use(sinonChai);

describe('Product', () => {
  it('should create a product', () => {
    const productCategory: TProductCategory = {
      id: 'TESTCAT1',
      name: 'Test category',
      qualityChangePerDay: -1,
      qualityChangePerDayAfterSellInDate: -2,
      maxShelfLifeDaysPastSellIn: 5
    };

    const product = new Product({
      id: 'PRODUCT1',
      name: 'Test Product',
      initialQuality: 25,
      productCategory
    });

    product.currentQuality.should.equal(25);
    product.name.should.equal('Test Product');
    product.id.should.equal('PRODUCT1');
    product.productCategory.should.equal(productCategory);
    product.sellInDate?.should.be.undefined;
    product.maxShelfLifeDaysPastSellIn?.should.equal(5);
    product.qualityChangePerDayAfterSellInDate.should.equal(-2);
    product.qualityChangePerDay.should.equal(-1);
    product.isExpired.should.be.false;
    product.isPastSellIn.should.be.false;
    product.onShelfDate.toDateString().should.eql(new Date().toDateString());
    product.sellInDays?.should.eq(0);
  });

  it('should create a product with category overrides', () => {
    const productCategory: TProductCategory = {
      id: 'TESTCAT1',
      name: 'Test category',
      qualityChangePerDay: -1,
      qualityChangePerDayAfterSellInDate: -2,
      maxShelfLifeDaysPastSellIn: 5
    };

    const product = new Product({
      id: 'OLD CHEESE',
      name: 'Test Old Cheese',
      initialQuality: 1,
      productCategory,
      qualityChangePerDay: 2,
      qualityChangePerDayAfterSellInDate: 3,
      maxShelfLifeDaysPastSellIn: 10,
      onShelfDate: new Date('January 1, 2023'),
      sellInDate: DateUtils.addDays(1, new Date('January 1, 2023'))
    });

    product.productCategory.should.equal(productCategory);
    product.maxShelfLifeDaysPastSellIn?.should.equal(10);
    product.qualityChangePerDay.should.equal(2);
    product.qualityChangePerDayAfterSellInDate.should.equal(3);
    product.sellInDate?.toDateString().should.eq('Mon Jan 02 2023');
    product.isPastSellIn.should.be.false;
    product.isExpired.should.be.false;
    product.sellInDays?.should.eq(1);
  });

  it('should fail to create product outside quality range', () => {
    let invalidQuality = 26;
    (function () {
      new Product({
        id: 'PRODUCT1',
        name: 'Test Product',
        initialQuality: invalidQuality,
        sellInDate: new Date(),
        productCategory: {
          id: 'TESTCAT1',
          name: 'Test category',
          qualityChangePerDay: 1,
          qualityChangePerDayAfterSellInDate: 2,
          maxShelfLifeDaysPastSellIn: 5
        }
      });
    }).should.throw(RangeError);

    invalidQuality = -1;
    (function () {
      new Product({
        id: 'PRODUCT1',
        name: 'Test Product',
        initialQuality: invalidQuality,
        productCategory: {
          id: 'TESTCAT1',
          name: 'Test category',
          qualityChangePerDay: 1,
          qualityChangePerDayAfterSellInDate: 2,
          maxShelfLifeDaysPastSellIn: 5
        }
      });
    }).should.throw(RangeError);
  });

  it('should not set quality outside range', () => {
    const product: Product = new Product({
      id: 'PRODUCT1',
      name: 'Test Product',
      initialQuality: 2,
      sellInDate: new Date(),
      productCategory: {
        id: 'TESTCAT1',
        name: 'Test category',
        qualityChangePerDay: 1,
        qualityChangePerDayAfterSellInDate: 2,
        maxShelfLifeDaysPastSellIn: 5
      }
    });

    product.currentQuality.should.equal(2);

    product.currentQuality = 30;
    product.currentQuality.should.equal(25);

    product.currentQuality = 11;
    product.currentQuality.should.equal(11);

    product.currentQuality = -1;
    product.currentQuality.should.equal(0);
  });

  it('should update product attributes on shelf date change', () => {
    const productCategory: TProductCategory = {
      id: 'Fish',
      name: 'Fish',
      qualityChangePerDay: 0,
      qualityChangePerDayAfterSellInDate: 0,
      maxShelfLifeDaysPastSellIn: 0
    };

    const currentDate = new Date('January 18, 2022');

    const product = new Product({
      id: 'SALMON',
      name: 'Salmon',
      initialQuality: 1,
      productCategory,
      maxShelfLifeDaysPastSellIn: 0,
      onShelfDate: DateUtils.addDays(-1, currentDate),
      sellInDate: currentDate
    });

    product.isExpired.should.be.false;
    product.isPastSellIn.should.be.false;
    product.sellInDays?.should.equal(1);

    product.onShelfDate = currentDate;

    product.isExpired.should.be.false;
    product.isPastSellIn.should.be.false;
    product.sellInDays?.should.equal(0);

    product.onShelfDate = DateUtils.addDays(1, currentDate);

    product.isExpired.should.be.true;
    product.isPastSellIn.should.be.true;
    product.sellInDays?.should.equal(-1);

    const product2 = new Product({
      id: 'meat',
      name: 'Meat',
      initialQuality: 1,
      productCategory,
      maxShelfLifeDaysPastSellIn: 1,
      onShelfDate: currentDate,
      sellInDate: DateUtils.addDays(-2, currentDate)
    });

    product2.isExpired.should.be.true;
    product2.isPastSellIn.should.be.true;
    product.sellInDays?.should.equal(-1);

    product2.onShelfDate = DateUtils.addDays(-2, currentDate);
    product2.isExpired.should.be.false;
    product2.isPastSellIn.should.be.false;
    product2.sellInDays?.should.equal(0);

    product2.onShelfDate = DateUtils.addDays(1, currentDate);
    product2.isExpired.should.be.true;
    product2.isPastSellIn.should.be.true;
    product2.sellInDays?.should.equal(-3);

    product2.onShelfDate = DateUtils.addDays(5, currentDate);
    product2.isExpired.should.be.true;
    product2.isPastSellIn.should.be.true;
    product2.sellInDays?.should.equal(-7);
  });
});
