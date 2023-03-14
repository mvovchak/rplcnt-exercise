const DateUtils = {
  addDays: (days: number, date: Date = new Date()): Date => {
    return new Date(date.setDate(date.getDate() + days));
  },
  getDaysBetweenDates: (start: Date, end: Date): Number => {
    const oneDayMs = 1000 * 60 * 60 * 24;
    const diffInTimeMs = end.getTime() - start.getTime();

    const diffInDays = Math.round(diffInTimeMs / oneDayMs);

    return diffInDays === 0 ? Math.abs(diffInDays) : diffInDays; // fix -0 issue IEEE
  },
};

export default DateUtils;
