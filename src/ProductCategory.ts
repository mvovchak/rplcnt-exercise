'use strict';

export type TProductCategory = {
  id: string;
  name: string;
  qualityChangePerDay: number;
  qualityChangePerDayAfterSellInDate: number;
  maxShelfLifeDaysPastSellIn?: number;
};
