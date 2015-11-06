import { generateData, titleize } from '../support/utils';
import moment from 'moment';

function template(id) {
  const startsAt = moment(faker.date.recent(-30));

  // Only a subset of the marketplace listings will have an image.
  const imageUrl = (id % 2 === 0) ? 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Market+Listing&w=300&h=300' : null;

  let images = [];

  if (imageUrl) {
    const imageUrl2 = 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Image+2&w=200&h=400';
    const imageUrl3 = 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Image+3&w=350&h=200';

    images = [
      {id: 1, primary: 1, image_url: imageUrl, market_post_id: id},
      {id: 2, primary: 0, image_url: imageUrl2, market_post_id: id},
      {id: 3, primary: 0, image_url: imageUrl3, market_post_id: id}
    ];
  }

  return {
    id: id,
    title: titleize(faker.lorem.sentences(1)),
    content: faker.lorem.sentences(5),
    content_id: id,
    published_at: startsAt.toISOString(),
    image_url: imageUrl,
    can_edit: true,
    has_contact_info: (id % 2 === 0), // only some posts will have contact info
    price: '$110, OBO',
    images: images
  };
}

export default generateData(100, template);
