import { TProductCategory } from "./ProductCategory";
import DateUtils from "./utils";

export type TProduct = {
  id: String;
  name: String;
  initialQuality: Number; // 0 to 25
  productCategory: TProductCategory;
  sellInDate?: Date;
  onShelfDate?: Date;
  isRemoved?: Boolean;
} & Omit<Partial<TProductCategory>, "id" | "name">;

export default class Product implements TProduct {
  readonly id!: String;
  readonly name!: String;
  readonly initialQuality!: Number;
  readonly productCategory!: TProductCategory;
  readonly sellInDate?: Date;
  readonly qualityChangePerDay: Number;
  readonly qualityChangePerDayAfterSellInDate: Number;
  readonly maxShelfLifeDaysAfterExpiry?: Number;
  private _onShelfDate: Date = new Date();
  private _isRemoved: Boolean = false;

  private _currentQuality!: Number;

  readonly MIN_QUALITY = 0;
  readonly MAX_QUALITY = 25;

  constructor({
    id,
    name,
    initialQuality,
    productCategory,
    sellInDate,
    onShelfDate,
    maxShelfLifeDaysAfterExpiry,
    qualityChangePerDay,
    qualityChangePerDayAfterSellInDate,
  }: TProduct) {
    if (
      initialQuality < this.MIN_QUALITY ||
      initialQuality > this.MAX_QUALITY
    ) {
      throw RangeError(
        `Initial quality should be a number between ${this.MIN_QUALITY} and ${this.MAX_QUALITY}`
      );
    }
    this.id = id;
    this.name = name;
    this.initialQuality = initialQuality;
    this._currentQuality = initialQuality;
    this.productCategory = productCategory;
    this.sellInDate = sellInDate;
    this.onShelfDate = onShelfDate ?? new Date();
    this.maxShelfLifeDaysAfterExpiry =
      maxShelfLifeDaysAfterExpiry ??
      productCategory.maxShelfLifeDaysAfterExpiry;
    this.qualityChangePerDay =
      qualityChangePerDay ?? productCategory.qualityChangePerDay;
    this.qualityChangePerDayAfterSellInDate =
      qualityChangePerDayAfterSellInDate ??
      productCategory.qualityChangePerDayAfterSellInDate;
  }

  public get sellInDays(): Number | undefined {
    return this.sellInDate
      ? DateUtils.getDaysBetweenDates(this.onShelfDate, this.sellInDate)
      : undefined;
  }

  public get isExpired(): Boolean {
    if (
      this.isPastSellIn &&
      this.maxShelfLifeDaysAfterExpiry &&
      this.sellInDays &&
      this.sellInDays.valueOf() + this.maxShelfLifeDaysAfterExpiry.valueOf() < 0
    ) {
      return true;
    }
    return false;
  }

  public get isPastSellIn(): Boolean {
    return (this.sellInDays ?? 0) < 0;
  }

  public get currentQuality(): Number {
    return this._currentQuality;
  }

  public get isRemoved(): Boolean {
    return this._isRemoved;
  }

  public set isRemoved(value: Boolean) {
    this._isRemoved = value;
  }

  public get onShelfDate(): Date {
    return this._onShelfDate;
  }
  public set onShelfDate(value: Date) {
    this._onShelfDate = value;
  }

  public set currentQuality(quality: Number) {
    if (quality < this.MIN_QUALITY) {
      this._currentQuality = this.MIN_QUALITY;
    } else if (quality > this.MAX_QUALITY) {
      this._currentQuality = this.MAX_QUALITY;
    } else {
      this._currentQuality = quality;
    }
  }
}
