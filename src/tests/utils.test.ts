import chai from 'chai';
import DateUtils from '../utils';

chai.should();

describe('Date Utils', () => {
  it('should add days to a date', () => {
    const date1 = DateUtils.addDays(10, new Date('March 1, 2023'));
    date1.should.eql(new Date('March 11, 2023'));

    const date2 = DateUtils.addDays(-32, new Date('February 15, 2023'));
    date2.should.eql(new Date('January 14, 2023'));

    const date3 = DateUtils.addDays(0, new Date('February 15, 2023'));
    date3.should.eql(new Date('February 15, 2023'));

    const date4 = DateUtils.addDays(390, new Date('February 15, 2023'));
    date4.should.eql(new Date('March 11, 2024'));
  });

  it('should return difference in days between two dates', () => {
    DateUtils.getDaysBetweenDates(
      new Date('March 1, 2023'),
      new Date('March 31, 2023')
    ).should.eq(30);
    DateUtils.getDaysBetweenDates(
      new Date('January 21, 2023'),
      new Date('January 15, 2023')
    ).should.eq(-6);
    DateUtils.getDaysBetweenDates(
      new Date('January 21, 2023'),
      new Date('January 21, 2023')
    ).should.eq(0);
    DateUtils.getDaysBetweenDates(
      new Date('January 1, 2023'),
      new Date('January 1, 2025')
    ).should.eq(731);
  });
});
