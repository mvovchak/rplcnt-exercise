'use strict';

import type { TProductCategory } from './ProductCategory';
import DateUtils from './utils';

enum ProductQualityRange {
  Min = 0,
  Max = 25
}

export type TProduct = {
  id: string;
  name: string;
  initialQuality: number;
  productCategory: TProductCategory;
  sellInDate?: Date;
  onShelfDate?: Date;
} & Omit<Partial<TProductCategory>, 'id' | 'name'>;

export default class Product implements TProduct {
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
      initialQuality < ProductQualityRange.Min ||
      initialQuality > ProductQualityRange.Max
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

  public get sellInDays(): number | undefined {
    return this.sellInDate !== undefined
      ? DateUtils.getDaysBetweenDates(this.onShelfDate, this.sellInDate)
      : undefined;
  }

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

  public get isPastSellIn(): boolean {
    return (this.sellInDays ?? 0) < 0;
  }

  public get currentQuality(): number {
    return this._currentQuality;
  }

  public set currentQuality(quality: number) {
    if (quality < ProductQualityRange.Min) {
      this._currentQuality = ProductQualityRange.Min;
    } else if (quality > ProductQualityRange.Min) {
      this._currentQuality = ProductQualityRange.Min;
    } else {
      this._currentQuality = quality;
    }
  }

  public get isQualityOutOfRange(quality: number): boolean {
    return (
      quality < ProductQualityRange.Min || quality > ProductQualityRange.Max
    );
  }

  public get onShelfDate(): Date {
    return this._onShelfDate;
  }

  public set onShelfDate(value: Date) {
    this._onShelfDate = value;
  }
}
