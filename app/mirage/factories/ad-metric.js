import Mirage, {faker} from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  title() { return faker.lorem.sentence(); },
  image_url() { return faker.image.image(); },
  pubdate() { return new Date(); },

  impression_count() { return faker.random.number(999); },
  max_impressions() { return faker.random.number(999); },
  click_count() { return faker.random.number(999); },

  daily_impression_counts() {
    const dailyCounts = [];

    for(let i = 8; i > 0; i -= 1) {
      dailyCounts.push({
        report_date: moment().subtract(i,'days').format('L'),
        impression_count: faker.random.number(99)
      });
    }

    return dailyCounts;
  },
  daily_click_counts() {
    const dailyCounts = [];

    for(let i = 8; i > 0; i -= 1) {
      dailyCounts.push({
        report_date: moment().subtract(i,'days').format('L'),
        click_count: faker.random.number(99)
      });
    }

    return dailyCounts;
  }
});
