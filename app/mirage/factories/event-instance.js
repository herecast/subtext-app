import moment from 'moment';
import Mirage, { faker } from 'ember-cli-mirage';

export default Mirage.Factory.extend({

  startsAt() {
    const startHour = faker.random.number({min: 7, max: 12});
    const startsAt = moment(faker.date.recent(-90)).hour(startHour).minute(0).second(0);

    return startsAt.toISOString();
  },
  endsAt() {
    const startsAt = Date.parse(this.startsAt);
    // All are up to 8 hours long so they don't go past midnight
    const hourSpan = faker.random.number({min: 2, max: 8});
    const endsAt = moment(startsAt).add(hourSpan, 'hours');

    return endsAt.toISOString();
  }

});
