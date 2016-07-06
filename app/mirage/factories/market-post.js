import Mirage, {faker} from 'ember-cli-mirage';
import { titleize } from '../support/utils';
import moment from 'moment';

const imageUrl = 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Market+Listing&w=300&h=300';

export default Mirage.Factory.extend({
  title() { return titleize(faker.lorem.sentences(1)); },
  content() { return faker.lorem.sentences(5); },
  contentId(id) { return id; },
  publishedAt() { return moment(faker.date.recent(-30)).toISOString(); },
  imageUrl(id) {
    return (id % 2 === 0) ? imageUrl : null;
  },
  canEdit: true,
  hasContactInfo(id) { return (id % 2 === 0); }, // only some posts will have contact info
  price: '$110, OBO',
  myTownOnly() { return faker.helpers.shuffle(true,false); },
  images(id) {
    let images = [];

    if (id % 2 === 0) {
      const imageUrl2 = 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Image+2&w=200&h=400';
      const imageUrl3 = 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Image+3&w=350&h=200';

      images = [
        {id: 1, primary: 1, image_url: imageUrl, market_post_id: id},
        {id: 2, primary: 0, image_url: imageUrl2, market_post_id: id},
        {id: 3, primary: 0, image_url: imageUrl3, market_post_id: id}
      ];
    }

    return images;
  }
});
