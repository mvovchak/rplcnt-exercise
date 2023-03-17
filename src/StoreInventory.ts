import Product from './Product';
import DateUtils from './utils';

export default class StoreInventory {
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

  public updateInventory(): void {
    this.currentDate = DateUtils.addDays(1, this.currentDate);
    this.updateDailyQuality();
    // this.deleteExpiredProducts(); could be called here to remove expired products from the system
  }

  public deleteExpiredProducts(): void {
    this.products = this.products.filter((product) => !product.isExpired);
  }

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

  private updateDailyQuality(): void {
    this.products.forEach((product) => {
      product.onShelfDate = new Date(this.currentDate);

      const newQuality = product.isPastSellIn
        ? product.qualityChangePerDayAfterSellInDate.valueOf()
        : product.qualityChangePerDay.valueOf();

      product.currentQuality = product.currentQuality.valueOf() + newQuality;
    });
  }

  public get products(): Product[] {
    return this._products;
  }

  private set products(products: Product[]) {
    this._products = products;
  }

  public get currentDate(): Date {
    return this._currentDate;
  }

  private set currentDate(currentDate: Date) {
    this._currentDate = currentDate;
  }
}
