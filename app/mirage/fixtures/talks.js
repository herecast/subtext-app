import { generateData, titleize } from '../support/utils';
import moment from 'moment';

function template(id) {
  const startsAt = moment(faker.date.recent(-30));

  // Only a subset of the authors will have an image.
  const authorImageUrl = (id % 2 === 0) ? 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Author+Face&w=300&h=300' : null;

  return {
    id: id,
    title: titleize(faker.lorem.sentences(1)),
    published_at: startsAt.toISOString(),
    user_count: faker.random.number(25),
    pageviews_count: faker.random.number(1000),
    author_name: faker.name.findName(),
    author_image_url: authorImageUrl
  };
}

export default generateData(24, template);
