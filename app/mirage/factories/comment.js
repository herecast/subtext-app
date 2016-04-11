import Mirage, {faker} from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  content() { return `<p><p>${faker.lorem.paragraph(1)}</p></p>`; },
  content_id() { return faker.random.number(20); },
  parent_content_id() { return faker.random.number(1000); },
  user_name() { return faker.name.findName(); },
  user_image_url(i) {
    return (i % 2 === 0) ? 'https://placeholdit.imgix.net/~text?txtsize=18&txt=Avatar&w=200&h=200' : null;
  },
  pubdate() { return moment(faker.date.recent(10)).toISOString(); }
});
