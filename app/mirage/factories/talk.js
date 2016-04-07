import Mirage, {faker} from 'ember-cli-mirage';
import moment from 'moment';
import { titleize } from '../support/utils';

export default Mirage.Factory.extend({
  title() { return titleize(faker.lorem.sentences(1)); },
  comment_count() { return faker.random.number(8); },
  content() { return faker.lorem.paragraphs(2); },
  content_id(id) { return id; },
  image_url(i) {
    return (i % 2 === 0) ? 'https://placeholdit.imgix.net/~text?txtsize=33&txt=750%C3%97250&w=750&h=250' : null;
  },
  parent_content_id() { return faker.random.number(1000); },
  parent_content_type() {
    return (Math.random() < 0.5) ? 'event' : 'news';
  },
  published_at() { return moment(faker.date.recent(-30)).toISOString(); },
  commenter_count() { return faker.random.number(25); },
  view_count() { return faker.random.number(1000); },
  author_name() { return faker.name.findName(); },
  author_image_url(i) {
    return (i % 2 === 0) ? 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Author+Face&w=100&h=100' : null;
  }
});
