import Product from "./Product";
import DateUtils from "./utils";

export default class StoreInventory {
  products: Product[] = [];
  currentDate: Date = new Date();

  constructor(products: Product[]) {
    this.products = products;
  }

  moveToNextDay() {
    this.currentDate = DateUtils.addDays(1, this.currentDate);
    this.updateDailyQuality();
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
        const sellInDays = this.getSellInDays(product.expiryDate) ?? "never";
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

  private getSellInDays(expiryDate?: Date): Number | undefined {
    return !expiryDate
      ? undefined
      : DateUtils.getDaysBetweenDates(this.currentDate, expiryDate);
  }

  private updateDailyQuality() {
    this.products.forEach((product) => {
      if (product.isRemoved) {
        return;
      }

      product.currentQuality =
        product.currentQuality.valueOf() +
        product.qualityChangePerDay.valueOf();

      const sellInDays = this.getSellInDays(product.expiryDate);
      if (
        sellInDays &&
        sellInDays.valueOf() +
          (product.maxShelfLifeDaysAfterExpiry
            ? product.maxShelfLifeDaysAfterExpiry.valueOf()
            : 0) <=
          0
      ) {
        product.isRemoved = true;
      }
    });
  }
}
