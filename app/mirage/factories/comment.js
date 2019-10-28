import Mirage, { faker } from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  content() { return `<p>${faker.lorem.paragraph(1)}</p>`; },
  userName() { return faker.name.findName(); },
  avatarImageUrl(i) {
    return (i % 2 === 0) ? 'https://via.placeholder.com/200x200.png?text=200x200' : null;
  },
  publishedAt() { return moment(faker.date.recent(10)).toISOString(); }
});
