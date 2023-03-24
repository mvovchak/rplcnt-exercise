'use strict';

import type { TProductCategory } from './ProductCategory';
import { DateUtils } from './utils';

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

/**
 * Product representation
 *
 * @export
 * @class Product
 * @typedef {Product}
 * @implements {TProduct}
 */
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
    if (this.isQualityOutOfRange(initialQuality)) {
      throw RangeError(
        `Initial quality should be a number between \
        ${ProductQualityRange.Min} and ${ProductQualityRange.Max}`
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
    return this.isPastSellIn && this.isPastMaxShelfLife();
  }

  private isPastMaxShelfLife(): boolean {
    return (this.sellInDays ?? 0) + (this.maxShelfLifeDaysPastSellIn ?? 0) < 0;
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
    } else if (quality > ProductQualityRange.Max) {
      this._currentQuality = ProductQualityRange.Max;
    } else {
      this._currentQuality = quality;
    }
  }

  private isQualityOutOfRange(quality: number): boolean {
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

/*
Possible onSale representation
 offers: Offer[] [{
  name: 'Summer Promotion'}
  startDate: Date!
  endDate: Date!
  sellInLessThen: Number!
}]
 */
