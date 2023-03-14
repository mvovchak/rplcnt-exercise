import { TProductCategory } from "./ProductCategory";

export type TProduct = {
  id: String;
  name: String;
  initialQuality: Number; // 0 to 25
  productCategory: TProductCategory;
  expiryDate?: Date;
  isRemoved?: Boolean;
} & Omit<Partial<TProductCategory>, "id" | "name">;

export default class Product implements TProduct {
  readonly id!: String;
  readonly name!: String;
  readonly initialQuality!: Number;
  readonly productCategory!: TProductCategory;
  readonly expiryDate?: Date;
  readonly qualityChangePerDay: Number;
  readonly qualityChangePerDayAfterExpiry: Number;
  readonly maxShelfLifeDaysAfterExpiry?: Number;
  private _isRemoved: Boolean = false;

  private _currentQuality!: Number;

  readonly MIN_QUALITY = 0;
  readonly MAX_QUALITY = 25;

  constructor({
    id,
    name,
    initialQuality,
    productCategory,
    expiryDate,
    maxShelfLifeDaysAfterExpiry,
    qualityChangePerDay,
    qualityChangePerDayAfterExpiry,
  }: TProduct) {
    if (initialQuality < this.MIN_QUALITY || initialQuality > this.MAX_QUALITY) {
      throw RangeError(`Initial quality should be a number between ${this.MIN_QUALITY} and ${this.MAX_QUALITY}`);
    }
    this.id = id;
    this.name = name;
    this.initialQuality = initialQuality;
    this._currentQuality = initialQuality;
    this.productCategory = productCategory;
    this.expiryDate = expiryDate;
    this.maxShelfLifeDaysAfterExpiry =
      maxShelfLifeDaysAfterExpiry ??
      productCategory.maxShelfLifeDaysAfterExpiry;
    this.qualityChangePerDay =
      qualityChangePerDay ?? productCategory.qualityChangePerDay;
    this.qualityChangePerDayAfterExpiry =
      qualityChangePerDayAfterExpiry ??
      productCategory.qualityChangePerDayAfterExpiry;
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
