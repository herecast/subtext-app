import { generateData, titleize } from '../support/utils';
import moment from 'moment';

function template(id) {
  const startsAt = moment(faker.date.recent(-30));

  // Only a subset of the authors will have an image.
  const imageUrl = (id % 2 === 0) ? 'http://placeholdit.imgix.net/~text?txtsize=33&txt=1800%C3%971200&w=1800&h=1200' : null;

  return {
    id: id,
    author_id: 1,
    author_name: faker.name.findName(),
    content: faker.lorem.paragraphs(4),
    content_id: 1,
    content_snippet: faker.lorem.sentences(4),
    image_url: imageUrl,
    publication_id: 1,
    publication_name: faker.company.companyName(),
    published_at: startsAt.toISOString(),
    subtitle: titleize(faker.lorem.sentences(1)),
    title: titleize(faker.lorem.sentences(1))
  };
}

export default generateData(24, template);