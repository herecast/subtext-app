import Mirage, { faker } from 'ember-cli-mirage';
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
  daily_view_counts() {
    const dailyCounts = [];

    for(let i = 8; i > 0; i -= 1) {
      dailyCounts.push({
        report_date: moment().subtract(i,'days').toDate().toISOString(),
        view_count: faker.random.number(99)
      });
    }

    return dailyCounts;
  },
  daily_promo_click_thru_counts() {
    const dailyCounts = [];

    for(let i = 8; i > 0; i -= 1) {
      dailyCounts.push({
        report_date: moment().subtract(i,'days').toDate().toISOString(),
        click_count: faker.random.number(99)
      });
    }

    return dailyCounts;
  }
});
