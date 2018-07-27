import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  period_start() { return faker.date.past(); },

  period_end() { return faker.date.past(); },

  paid_impressions() { return faker.random.number(9999); },

  pay_per_impression() { return faker.random.number(100) / 100; },

  total_payment() { return faker.random.number(1000) / 100; },

  payment_date() { return faker.date.past(); },

  report_url: 'reports/12345'
});
