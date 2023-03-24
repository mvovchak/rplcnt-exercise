'use strict';

// Utils

/**
 * DateUtils
 *
 * @type {{ addDays: (days: number, date: Date) => Date; getDaysBetweenDates: (start: Date, end: Date) => number; }}
 */
const DateUtils = {
  addDays: (days: number, date: Date = new Date()): Date => {
    const newDate = new Date(date.valueOf());
    newDate.setDate(date.getDate() + days);

    return newDate;
  },
  getDaysBetweenDates: (start: Date, end: Date): number => {
    const oneDayMs = 1000 * 3600 * 24;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const diffInTimeMs =
      startTime > endTime ? endTime - startTime : Math.abs(startTime - endTime);

    const diffInDays = Math.ceil(diffInTimeMs / oneDayMs);
    return diffInDays;
  }
};

// Types

/**
 * Product Category Type
 *
 * @typedef {TProductCategory}
 */
type TProductCategory = {
  id: string;
  name: string;
  qualityChangePerDay: number;
  qualityChangePerDayAfterSellInDate: number;
  maxShelfLifeDaysPastSellIn?: number;
};

/**
 * Product Type
 *
 * @typedef {TProduct}
 */
type TProduct = {
  id: string;
  name: string;
  initialQuality: number;
  productCategory: TProductCategory;
  sellInDate?: Date;
  onShelfDate?: Date;
} & Omit<Partial<TProductCategory>, 'id' | 'name'>;

/**
 * Product Model
 *
 * @class Product
 * @typedef {Product}
 * @implements {TProduct}
 */
class Product implements TProduct {
  readonly id!: string;
  readonly name!: string;
  readonly initialQuality!: number;
  readonly productCategory!: TProductCategory;
  readonly sellInDate?: Date;
  readonly qualityChangePerDay: number;
  readonly qualityChangePerDayAfterSellInDate: number;
  readonly maxShelfLifeDaysPastSellIn?: number;
  private _onShelfDate: Date = new Date();
  private _currentQuality!: number;

  readonly MIN_QUALITY = 0;
  readonly MAX_QUALITY = 25;

  constructor({
    id,
    name,
    initialQuality,
    productCategory,
    sellInDate,
    onShelfDate,
    maxShelfLifeDaysPastSellIn,
    qualityChangePerDay,
    qualityChangePerDayAfterSellInDate
  }: TProduct) {
    if (
      initialQuality < this.MIN_QUALITY ||
      initialQuality > this.MAX_QUALITY
    ) {
      throw RangeError(
        `Initial quality should be a number between \
        ${this.MIN_QUALITY} and ${this.MAX_QUALITY}`
      );
    }
    this.id = id;
    this.name = name;
    this.initialQuality = initialQuality;
    this._currentQuality = initialQuality;
    this.productCategory = productCategory;
    this.sellInDate = sellInDate;
    this.onShelfDate = onShelfDate ?? new Date();
    this.maxShelfLifeDaysPastSellIn =
      maxShelfLifeDaysPastSellIn ?? productCategory.maxShelfLifeDaysPastSellIn;
    this.qualityChangePerDay =
      qualityChangePerDay ?? productCategory.qualityChangePerDay;
    this.qualityChangePerDayAfterSellInDate =
      qualityChangePerDayAfterSellInDate ??
      productCategory.qualityChangePerDayAfterSellInDate;
  }

  /**
   * How many days left after sellIn date passed (if product has sellIn)
   *
   * @public
   * @readonly
   * @type {(number | undefined)}
   */
  public get sellInDays(): number | undefined {
    return this.sellInDate !== undefined
      ? DateUtils.getDaysBetweenDates(this.onShelfDate, this.sellInDate)
      : undefined;
  }

  /**
   * Product is expired and should be removed from the shelf
   *
   * @public
   * @readonly
   * @type {boolean}
   */
  public get isExpired(): boolean {
    if (
      this.isPastSellIn &&
      this.maxShelfLifeDaysPastSellIn !== undefined &&
      this.sellInDays !== undefined &&
      this.sellInDays.valueOf() + this.maxShelfLifeDaysPastSellIn.valueOf() < 0
    ) {
      return true;
    }
    return false;
  }

  /**
   * Is past sell in date
   *
   * @public
   * @readonly
   * @type {boolean}
   */
  public get isPastSellIn(): boolean {
    return (this.sellInDays ?? 0) < 0;
  }

  /**
   * Get current quality
   *
   * @public
   * @type {number}
   */
  public get currentQuality(): number {
    return this._currentQuality;
  }

  /**
   * Get current quality, if outside range set to min/max range accordingly
   *
   * @public
   * @returns number
   */
  public set currentQuality(quality: number) {
    if (quality < this.MIN_QUALITY) {
      this._currentQuality = this.MIN_QUALITY;
    } else if (quality > this.MAX_QUALITY) {
      this._currentQuality = this.MAX_QUALITY;
    } else {
      this._currentQuality = quality;
    }
  }

  /**
   * Get date on shelf (current date)
   *
   * @public
   * @type {Date}
   */
  public get onShelfDate(): Date {
    return this._onShelfDate;
  }

  /**
   * Set date on shelf (current date)
   *
   * @public
   * @type {Date}
   */
  public set onShelfDate(value: Date) {
    this._onShelfDate = value;
  }
}

/**
 * Store inventory, holds products and updates the daily quality
 *
 * @class StoreInventory
 * @typedef {StoreInventory}
 */
class StoreInventory {
  private _products: Product[] = [];
  private _currentDate: Date = new Date();

  constructor(products: Product[]) {
    this.products = products.map((product) => {
      return new Product({
        ...product,
        onShelfDate: this.currentDate
      });
    });
  }

  /**
   * Updates daily store inventory
   *
   * @public
   */
  public updateInventory(): void {
    this.currentDate = DateUtils.addDays(1, this.currentDate);
    this.updateDailyQuality();
    // this.deleteExpiredProducts(); could be called here to remove expired products from the system
  }

  /**
   * Deletes products that are expired
   *
   * @public
   */
  public deleteExpiredProducts(): void {
    this.products = this.products.filter((product) => !product.isExpired);
  }

  /**
   * Prints current inventory
   *
   * @public
   */
  public printInventory(): void {
    console.log('-'.repeat(process.stdout.columns));
    console.log(
      `Updated on: ${this.currentDate.toLocaleDateString('en-us', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })}`
    );
    console.table(
      this.products.map((product) => ({
        name: product.name,
        quality: product.currentQuality,
        sellInDays: product.sellInDays ?? '-',
        category: product.productCategory.name,
        expired: product.isExpired ? 'yes' : 'no',
        pastSellIn: product.isPastSellIn ? 'yes' : 'no'
      }))
    );
  }

  /**
   * Updates daily quality
   *
   * @private
   */
  private updateDailyQuality(): void {
    this.products.forEach((product) => {
      product.onShelfDate = new Date(this.currentDate);

      const newQuality = product.isPastSellIn
        ? product.qualityChangePerDayAfterSellInDate.valueOf()
        : product.qualityChangePerDay.valueOf();

      product.currentQuality = product.currentQuality.valueOf() + newQuality;
    });
  }

  /**
   * Get all products
   *
   * @private
   */
  public get products(): Product[] {
    return this._products;
  }

  /**
   * Set new products
   *
   * @private
   */
  private set products(products: Product[]) {
    this._products = products;
  }

  /**
   * Get inventory's current date
   *
   * @private
   */
  public get currentDate(): Date {
    return this._currentDate;
  }

  /**
   * Set inventory's current date
   *
   * @private
   */
  private set currentDate(currentDate: Date) {
    this._currentDate = currentDate;
  }
}

// Mock data

const defaultProductCategory: TProductCategory = {
  id: 'DEFAULT',
  name: 'Default',
  qualityChangePerDay: -1,
  qualityChangePerDayAfterSellInDate: -2,
  maxShelfLifeDaysPastSellIn: 5
};

const organicProductCategory: TProductCategory = {
  id: 'ORGANIC',
  name: 'Organic Products',
  qualityChangePerDay: -2,
  maxShelfLifeDaysPastSellIn: 5,
  qualityChangePerDayAfterSellInDate: -4
};

const products: Product[] = [
  new Product({
    id: 'APPLE',
    name: 'Apple',
    initialQuality: 10,
    productCategory: defaultProductCategory,
    sellInDate: DateUtils.addDays(10)
  }),
  new Product({
    id: 'BANANA',
    name: 'Banana',
    initialQuality: 9,
    productCategory: defaultProductCategory,
    sellInDate: DateUtils.addDays(7)
  }),
  new Product({
    id: 'STRAWBERRY',
    name: 'Strawberry',
    initialQuality: 10,
    productCategory: defaultProductCategory,
    sellInDate: DateUtils.addDays(5)
  }),
  new Product({
    id: 'CHEDDAR',
    name: 'Cheddar Cheese',
    initialQuality: 16,
    productCategory: defaultProductCategory,
    qualityChangePerDay: 1,
    qualityChangePerDayAfterSellInDate: 1,
    sellInDate: undefined
  }),
  new Product({
    id: 'RAMEN',
    name: 'Instant Ramen',
    initialQuality: 25,
    productCategory: defaultProductCategory, // Could be a special category instead (non-perishable)
    maxShelfLifeDaysPastSellIn: undefined,
    qualityChangePerDay: 0,
    qualityChangePerDayAfterSellInDate: 0
  }),
  new Product({
    id: 'ORG_AVOCADO',
    name: 'Organic Avocado',
    initialQuality: 25,
    productCategory: organicProductCategory,
    sellInDate: DateUtils.addDays(5)
  }),
  new Product({
    id: 'ORG_TOMATOES',
    name: 'Organic Tomatillos',
    initialQuality: 4,
    productCategory: organicProductCategory,
    sellInDate: DateUtils.addDays(2)
  }),
  new Product({
    id: 'PAST_SELLIN',
    name: 'Past due date - to be removed',
    initialQuality: 4,
    productCategory: organicProductCategory,
    sellInDate: DateUtils.addDays(-4)
  })
];

// ---------------------------------------------
// Implementation
const storeInventory: StoreInventory = new StoreInventory(products);

storeInventory.printInventory();

const days = 30;

Array.from(Array(days).keys()).map(() => {
  storeInventory.updateInventory();
  storeInventory.printInventory();
});

// Tests
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect, assert } = chai;
chai.should();
chai.use(sinonChai);

const describe = (name: string, cb: Function) => {
  console.log(name);
  console.group();
  cb();
  console.groupEnd();
};

let passingTestsCount = 0;
let failedTestsCount = 0;
const it = (name: string, cb: Function) => {
  try {
    cb();
    passingTestsCount++;
    console.log(`✅ ${name}`);
  } catch (e) {
    failedTestsCount++;
    console.warn(`❌ ${name}`);
    console.error(e);
  }
};

describe('Date Utils', () => {
  it('should add days to a date', () => {
    const date1 = DateUtils.addDays(10, new Date('March 1, 2023'));
    expect(date1).to.eql(new Date('March 11, 2023'));

    const date2 = DateUtils.addDays(-32, new Date('February 15, 2023'));
    expect(date2).to.eql(new Date('January 14, 2023'));

    const date3 = DateUtils.addDays(0, new Date('February 15, 2023'));
    expect(date3).to.eql(new Date('February 15, 2023'));

    const date4 = DateUtils.addDays(390, new Date('February 15, 2023'));
    expect(date4).to.eql(new Date('March 11, 2024'));
  });

  it('should return difference in days between two dates', () => {
    expect(
      DateUtils.getDaysBetweenDates(
        new Date('March 1, 2023'),
        new Date('March 31, 2023')
      )
    ).to.eq(30);
    expect(
      DateUtils.getDaysBetweenDates(
        new Date('January 21, 2023'),
        new Date('January 15, 2023')
      )
    ).to.eq(-6);
    expect(
      DateUtils.getDaysBetweenDates(
        new Date('January 21, 2023'),
        new Date('January 21, 2023')
      )
    ).to.eq(0);
    expect(
      DateUtils.getDaysBetweenDates(
        new Date('January 1, 2023'),
        new Date('January 1, 2025')
      )
    ).to.eq(731);
  });
});

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

    expect(product.currentQuality).to.equal(25);
    expect(product.name).to.equal('Test Product');
    expect(product.id).to.equal('PRODUCT1');
    expect(product.productCategory).to.equal(productCategory);
    expect(product.sellInDate).to.be.undefined;
    expect(product.maxShelfLifeDaysPastSellIn)?.to.equal(5);
    expect(product.qualityChangePerDayAfterSellInDate).to.equal(-2);
    expect(product.qualityChangePerDay).to.equal(-1);
    expect(product.isExpired).to.be.false;
    expect(product.isPastSellIn).to.be.false;
    expect(product.onShelfDate.toDateString()).to.eql(
      new Date().toDateString()
    );
    expect(product.sellInDays)?.to.be.undefined;
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

    expect(product.productCategory).to.equal(productCategory);
    expect(product.maxShelfLifeDaysPastSellIn)?.to.equal(10);
    expect(product.qualityChangePerDay).to.equal(2);
    expect(product.qualityChangePerDayAfterSellInDate).to.equal(3);
    expect(product.sellInDate?.toDateString()).to.eq('Mon Jan 02 2023');
    expect(product.isPastSellIn).to.be.false;
    expect(product.isExpired).to.be.false;
    expect(product.sellInDays)?.to.eq(1);
  });

  it('should fail to create product outside quality range', () => {
    let invalidQuality = 26;
    expect(function () {
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
    }).to.throw();

    invalidQuality = -1;
    expect(function () {
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
    }).to.throw();
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

    expect(product.currentQuality).to.equal(2);

    product.currentQuality = 30;
    expect(product.currentQuality).to.equal(25);

    product.currentQuality = 11;
    expect(product.currentQuality).to.equal(11);

    product.currentQuality = -1;
    expect(product.currentQuality).to.equal(0);
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

    expect(product.isExpired).to.be.false;
    expect(product.isPastSellIn).to.be.false;
    expect(product.sellInDays)?.to.equal(1);

    product.onShelfDate = currentDate;

    expect(product.isExpired).to.be.false;
    expect(product.isPastSellIn).to.be.false;
    expect(product.sellInDays)?.to.equal(0);

    product.onShelfDate = DateUtils.addDays(1, currentDate);

    expect(product.isExpired).to.be.true;
    expect(product.isPastSellIn).to.be.true;
    expect(product.sellInDays)?.to.equal(-1);

    const product2 = new Product({
      id: 'meat',
      name: 'Meat',
      initialQuality: 1,
      productCategory,
      maxShelfLifeDaysPastSellIn: 1,
      onShelfDate: currentDate,
      sellInDate: DateUtils.addDays(-2, currentDate)
    });

    expect(product2.isExpired).to.be.true;
    expect(product2.isPastSellIn).to.be.true;
    expect(product.sellInDays)?.to.equal(-1);

    product2.onShelfDate = DateUtils.addDays(-2, currentDate);
    expect(product2.isExpired).to.be.false;
    expect(product2.isPastSellIn).to.be.false;
    expect(product2.sellInDays)?.to.equal(0);

    product2.onShelfDate = DateUtils.addDays(1, currentDate);
    expect(product2.isExpired).to.be.true;
    expect(product2.isPastSellIn).to.be.true;
    expect(product2.sellInDays)?.to.equal(-3);

    product2.onShelfDate = DateUtils.addDays(5, currentDate);
    expect(product2.isExpired).to.be.true;
    expect(product2.isPastSellIn).to.be.true;
    expect(product2.sellInDays)?.to.equal(-7);
  });
});

describe('StoreInventory', () => {
  it('should initialize product inventory with mock data', () => {
    const storeInventory: StoreInventory = new StoreInventory(products);
    expect(storeInventory.products).to.be.an('array').that.has.length(8);
    expect(storeInventory.currentDate.toDateString()).to.eq(
      new Date().toDateString()
    );
  });

  it('should initialize product inventory with no products', () => {
    const storeInventory: StoreInventory = new StoreInventory([]);
    expect(storeInventory.products).to.be.an('array').that.is.empty;
  });

  it('should update the inventory and its product attributes', () => {
    const storeInventory: StoreInventory = new StoreInventory([
      new Product({
        id: 'PRODUCT1',
        name: 'Test Product',
        initialQuality: 2,
        sellInDate: new Date(),
        productCategory: {
          id: 'TESTCAT1',
          name: 'Test category',
          qualityChangePerDay: -1,
          qualityChangePerDayAfterSellInDate: -2,
          maxShelfLifeDaysPastSellIn: 5
        }
      })
    ]);

    const {
      products: [product]
    } = storeInventory;
    const inventorySpy = sinon.spy(storeInventory, 'updateInventory');

    expect(storeInventory.currentDate.toDateString()).to.equal(
      new Date().toDateString()
    );

    expect(product.onShelfDate.toDateString()).to.equal(
      new Date().toDateString()
    );

    expect(product.initialQuality).to.eq(2);
    expect(product.currentQuality).to.eq(2);
    expect(product.isExpired).to.be.false;

    const days = 3;

    Array.from(Array(days).keys()).forEach((_, i) => {
      storeInventory.updateInventory();
      expect(storeInventory.currentDate.toDateString()).to.equal(
        DateUtils.addDays(i + 1).toDateString()
      );
    });

    expect(product.currentQuality).to.eq(0);
    expect(product.isExpired).to.be.false;
    expect(product.sellInDays)?.to.eq(-3);

    storeInventory.updateInventory();

    expect(product.currentQuality).to.eq(0);
    expect(product.initialQuality).to.eq(2);
    expect(product.sellInDays)?.to.eq(-4);
    expect(product.isExpired).to.be.false;
    expect(product.isPastSellIn).to.be.true;

    expect(storeInventory.currentDate.toDateString()).to.equal(
      product.onShelfDate.toDateString()
    );

    Array.from(Array(2).keys()).forEach(() => {
      storeInventory.updateInventory();
    });

    expect(product.isExpired).to.be.true;
    expect(product.sellInDays)?.to.eq(-6);
    expect(product.isPastSellIn).to.be.true;

    expect(inventorySpy).to.have.callCount(6);
  });

  it('should not expire non-perishable product', () => {
    const product: Product = new Product({
      id: 'PRODUCT1',
      name: 'Test Product',
      initialQuality: 25,
      sellInDate: undefined,
      productCategory: {
        id: 'TESTCAT1',
        name: 'Non-perishable',
        qualityChangePerDay: 0,
        qualityChangePerDayAfterSellInDate: 0,
        maxShelfLifeDaysPastSellIn: undefined
      }
    });
    const storeInventory: StoreInventory = new StoreInventory([product]);
    const inventorySpy = sinon.spy(storeInventory, 'updateInventory');

    expect(storeInventory.currentDate.toDateString()).to.equal(
      new Date().toDateString()
    );
    expect(product.initialQuality).to.eq(25);
    expect(product.currentQuality).to.eq(25);
    expect(product.isExpired).to.be.false;

    const days = 10;
    Array.from(Array(days).keys()).forEach(() => {
      storeInventory.updateInventory();
    });

    expect(product.currentQuality).to.eq(25);
    expect(product.isExpired).to.be.false;
    expect(product.isPastSellIn).to.be.false;
    expect(product.sellInDays)?.to.be.undefined;
    expect(inventorySpy).to.have.callCount(10);
  });

  it('should update daily quality for Cheddar cheese - no expiry + increase in quality', () => {
    const storeInventory: StoreInventory = new StoreInventory([
      new Product({
        id: 'CHEDDAR',
        name: 'Cheddar Cheese',
        initialQuality: 1,
        sellInDate: undefined,
        productCategory: {
          id: 'TESTCAT1',
          name: 'Test category',
          qualityChangePerDay: 1,
          qualityChangePerDayAfterSellInDate: 1,
          maxShelfLifeDaysPastSellIn: undefined
        }
      })
    ]);

    const inventorySpy = sinon.spy(storeInventory, 'updateInventory');

    const {
      products: [product]
    } = storeInventory;

    expect(product.isExpired).to.be.false;
    expect(product.isPastSellIn).to.be.false;

    Array.from(Array(24).keys()).forEach(() => {
      storeInventory.updateInventory();
    });

    expect(product.currentQuality).to.eq(25);
    expect(product.isExpired).to.be.false;
    expect(product.isPastSellIn).to.be.false;
    expect(product.sellInDays)?.to.be.undefined;
    expect(inventorySpy).to.have.callCount(24);
  });

  it('should update the inventory with a custom product (Ramen) - non-perishable, quality stays the same', () => {
    const storeInventory: StoreInventory = new StoreInventory([
      new Product({
        id: 'RAMEN',
        name: 'Ramen Noodle',
        initialQuality: 23,
        sellInDate: undefined,
        productCategory: {
          id: 'TESTCAT1',
          name: 'Test category',
          qualityChangePerDay: 0,
          qualityChangePerDayAfterSellInDate: 0,
          maxShelfLifeDaysPastSellIn: undefined
        }
      })
    ]);

    const {
      products: [product]
    } = storeInventory;
    const inventorySpy = sinon.spy(storeInventory, 'updateInventory');

    const days = 27;
    Array.from(Array(days).keys()).forEach(() => {
      storeInventory.updateInventory();
    });

    expect(product.currentQuality).to.eq(23);
    expect(product.isExpired).to.be.false;
    expect(product.isPastSellIn).to.be.false;
    expect(product.sellInDays)?.to.be.undefined;
    expect(inventorySpy).to.have.callCount(days);
  });

  it('should update daily quality for custom product (Organic)', () => {
    const storeInventory: StoreInventory = new StoreInventory([
      new Product({
        id: 'APPLEJUICE',
        name: 'Apple Juice',
        initialQuality: 6,
        sellInDate: DateUtils.addDays(6, new Date()),
        onShelfDate: new Date(),
        productCategory: {
          id: 'ORGANIC',
          name: 'Organic Products',
          qualityChangePerDay: -2,
          qualityChangePerDayAfterSellInDate: -4,
          maxShelfLifeDaysPastSellIn: 2
        }
      })
    ]);

    const {
      products: [product]
    } = storeInventory;

    const inventorySpy = sinon.spy(storeInventory, 'updateInventory');

    storeInventory.updateInventory();
    expect(product.currentQuality).to.eq(4);
    expect(product.sellInDays)?.to.eq(5);
    expect(product.isPastSellIn).to.be.false;

    Array.from(Array(2).keys()).forEach(() => {
      storeInventory.updateInventory();
    });

    expect(product.currentQuality).to.eq(0);
    expect(product.sellInDays)?.to.eq(3);
    expect(product.isExpired).to.be.false;
    expect(product.isPastSellIn).to.be.false;

    Array.from(Array(4).keys()).forEach(() => {
      storeInventory.updateInventory();
    });

    expect(product.isPastSellIn).to.be.true;
    expect(product.sellInDays)?.to.equal(-1);
    expect(product.isExpired).to.be.false;

    Array.from(Array(6).keys()).forEach(() => {
      storeInventory.updateInventory();
    });

    expect(inventorySpy).to.have.callCount(13);

    expect(product.isExpired).to.be.true;
  });

  it('should remove products from inventory', () => {
    const storeInventory: StoreInventory = new StoreInventory(products);

    Array.from(Array(30).keys()).forEach(() => {
      storeInventory.updateInventory();
    });

    expect(storeInventory.products).to.have.length(8);
    storeInventory.deleteExpiredProducts();
    expect(storeInventory.products).to.have.length(2);
  });
});

console.log('Passing', passingTestsCount);
console.log('Failed', failedTestsCount);
