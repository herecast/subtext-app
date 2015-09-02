import { generateData, titleize } from '../support/utils';
import moment from 'moment';

function template(id) {
  const startsAt = moment(faker.date.recent(-30));

  // Only a subset of the authors will have an image.
  const authorImageUrl = (id % 2 === 0) ? 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Author+Face&w=100&h=100' : null;
  const imageUrl = (id % 2 === 0) ? 'https://placeholdit.imgix.net/~text?txtsize=33&txt=750%C3%97250&w=750&h=250' : null;

  return {
    id: id,
    title: titleize(faker.lorem.sentences(1)),
    content: faker.lorem.paragraphs(2),
    content_id: faker.random.number(1000),
    image_url: imageUrl,
    parent_content_id: faker.random.number(1000),
    published_at: startsAt.toISOString(),
    commenter_count: faker.random.number(25),
    view_count: faker.random.number(1000),
    author_name: faker.name.findName(),
    author_image_url: authorImageUrl
  };
}

export default generateData(50, template);
