const DateUtils = {
  addDays: (days: number, date: Date = new Date()): Date => {
    const newDate = new Date(date.valueOf());
    newDate.setDate(date.getDate() + days);

    return newDate;
  },
  getDaysBetweenDates: (start: Date, end: Date): Number => {
    const oneDayMs = 1000 * 3600 * 24;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const diffInTimeMs =
      startTime > endTime ? endTime - startTime : Math.abs(startTime - endTime);

    const diffInDays = Math.ceil(diffInTimeMs / oneDayMs);
    return diffInDays;
  },
};

export default DateUtils;
