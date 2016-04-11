import Mirage, {faker} from 'ember-cli-mirage';
import { titleize } from '../support/utils';
import moment from 'moment';

export default Mirage.Factory.extend({
  title() { return titleize(faker.lorem.sentences(1)); },
  click_count() { return faker.random.number(8); },
  pubdate() { return moment().add(-2, 'days').toISOString(); },
  impression_count() { return faker.random.number(1000); },
  max_impression() { return faker.random.number(1000); },
  image_url: 'https://placeholdit.imgix.net/~text?txtsize=33&txt=750%C3%97250&w=750&h=250',
  redirect_url: 'http://thelymeinn.com/',
  campaign_start() { return moment().add(-2, 'days'); },
  compaign_end() { return faker.date.future(); }
});
