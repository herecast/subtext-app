import Mirage, {faker} from 'ember-cli-mirage';
import moment from 'moment';
import { titleize } from '../support/utils';

export default Mirage.Factory.extend({
  title() { return titleize(faker.lorem.sentences(1)); },
  commentCount() { return faker.random.number(8); },
  content() { return faker.lorem.paragraphs(2); },
  contentId() { return this.id; },
  imageUrl(i) {
    return (i % 2 === 0) ? 'https://placeholdit.imgix.net/~text?txtsize=33&txt=750%C3%97250&w=750&h=250' : null;
  },
  publishedAt() { return moment(faker.date.recent(-30)).toISOString(); },
  viewCount() { return faker.random.number(1000); },
  authorName() { return faker.name.findName(); },
  canEdit: true,
  contentLocations: [],

  afterCreate(talk, server) {
    if(!talk.parentContentId) {
      const parent = server.create('news');
      talk.update({
        parentContentId: parent.id,
        parentContentType: 'news'
      });
    }
  }
});
