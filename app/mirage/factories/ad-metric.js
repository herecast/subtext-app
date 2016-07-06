import Mirage, {faker} from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  title() { return faker.lorem.sentence(); },
  imageUrl() { return faker.image.image(); },
  pubdate() { return new Date(); },

  impressionCount() { return faker.random.number(999); },
  maxImpressions() { return faker.random.number(999); },
  clickCount() { return faker.random.number(999); },

  dailyImpressionCounts() {
    const dailyCounts = [];

    for(let i = 8; i > 0; i -= 1) {
      dailyCounts.push({
        reportDate: moment().subtract(i,'days').toDate().toISOString(),
        impressionCount: faker.random.number(99)
      });
    }

    return dailyCounts;
  },
  dailyClickCounts() {
    const dailyCounts = [];

    for(let i = 8; i > 0; i -= 1) {
      dailyCounts.push({
        reportDate: moment().subtract(i,'days').toDate().toISOString(),
        clickCount: faker.random.number(99)
      });
    }

    return dailyCounts;
  }
});
