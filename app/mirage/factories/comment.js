import Mirage, {faker} from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  content() { return `<p>${faker.lorem.paragraph(1)}</p>`; },
  contentId() { return faker.random.number(20); },
  parentContentId() { return faker.random.number(1000); },
  userName() { return faker.name.findName(); },
  userImageUrl(i) {
    return (i % 2 === 0) ? 'https://placeholdit.imgix.net/~text?txtsize=18&txt=Avatar&w=200&h=200' : null;
  },
  publishedAt() { return moment(faker.date.recent(10)).toISOString(); }
});
