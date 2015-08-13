import { generateData, titleize } from '../support/utils';
import moment from 'moment';

function template(id) {
  const startsAt = moment(faker.date.recent(-30));

  // Only a subset of the marketplace listings will have an image.
  const imageUrl = (id % 2 === 0) ? 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Market+Listing&w=300&h=300' : null;

  return {
    id: id,
    title: titleize(faker.lorem.sentences(1)),
    content: faker.lorem.sentences(5),
    published_at: startsAt.toISOString(),
    image_url: imageUrl,
    can_edit: true,
    price: '$110, OBO'
  };
}

export default generateData(100, template);
