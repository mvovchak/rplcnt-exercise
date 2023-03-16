import Product from "./Product";
import DateUtils from "./utils";

export default class StoreInventory {
  private _products: Product[] = [];
  private _currentDate: Date = new Date();

  constructor(products: Product[]) {
    this.products = products.map((product) => {
      return new Product({
        ...product,
        onShelfDate: product.onShelfDate ?? this.currentDate,
      });
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

  updateInventory() {
    this.currentDate = DateUtils.addDays(1, this.currentDate);
    this.updateDailyQuality();
  }

  deleteRemovedProducts() {
    this.products = this.products.filter((product) => !product.isRemoved);
  }

  printInventory() {
    console.log("-".repeat(process.stdout.columns));
    console.log(
      `Updated on: ${this.currentDate.toLocaleDateString("en-us", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`
    );
    console.table(
      this.products.map((product) => {
        const sellInDays = product.sellInDays ?? "never";
        return {
          name: product.name,
          quality: product.currentQuality,
          "sell in (days)": sellInDays,
          category: product.productCategory.name,
          isRemoved: product.isRemoved ? "yes" : "no",
        };
      })
    );
  }

  private updateDailyQuality() {
    this.products.forEach((product) => {
      if (product.isRemoved) {
        return;
      }

      product.onShelfDate = new Date(this.currentDate);

      const newQuality = product.isPastSellIn
        ? product.qualityChangePerDayAfterSellInDate.valueOf()
        : product.qualityChangePerDay.valueOf();

      product.currentQuality = product.currentQuality.valueOf() + newQuality;

      if (product.isExpired) {
        product.isRemoved = true;
      }
    });
  }
}
