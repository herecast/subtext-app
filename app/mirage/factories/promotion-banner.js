import Mirage, { faker } from 'ember-cli-mirage';
import { titleize } from '../support/utils';
import moment from 'moment';

export default Mirage.Factory.extend({
  title() { return titleize(faker.lorem.sentences(1)); },
  clickCount() { return faker.random.number(8); },
  pubdate() { return moment().add(-2, 'days').toISOString(); },
  impressionCount() { return faker.random.number(1000); },
  maxImpression() { return faker.random.number(1000); },
  imageUrl: 'https://placeholdit.imgix.net/~text?txtsize=33&txt=750%C3%97250&w=750&h=250',
  redirectUrl: 'http://thelymeinn.com/',
  campaignStart() { return moment().add(-2, 'days'); },
  compaignEnd() { return faker.date.future(); }
});
