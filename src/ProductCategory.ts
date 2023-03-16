export type TProductCategory = {
  id: String;
  name: String;
  qualityChangePerDay: Number;
  qualityChangePerDayAfterSellInDate: Number;
  maxShelfLifeDaysPastSellIn?: Number;
};
