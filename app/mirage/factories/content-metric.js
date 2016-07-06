import Mirage, {faker} from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  title() { return faker.lorem.sentence(); },
  imageUrl() { return faker.image.image(); },

  viewCount() { return faker.random.number(999); },
  commentCount() { return faker.random.number(999); },
  promosClickThruCount() { return faker.random.number(999); },

  comments() {
    return []; /* fill in later as needed */
  },
  dailyViewCounts() {
    const dailyCounts = [];

    for(let i = 8; i > 0; i -= 1) {
      dailyCounts.push({
        reportDate: moment().subtract(i,'days').toDate().toISOString(),
        viewCount: faker.random.number(99)
      });
    }

    return dailyCounts;
  },
  dailyPromoClickThruCounts() {
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
