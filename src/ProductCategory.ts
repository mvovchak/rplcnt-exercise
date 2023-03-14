export type TProductCategory = {
    id: String;
    name: String; // default category rules
    qualityChangePerDay: Number; // -1 default
    qualityChangePerDayAfterExpiry: Number; // -2 default
    maxShelfLifeDaysAfterExpiry?: Number; // 5 days default
  };
