import { generateData, titleize } from '../support/utils';
import moment from 'moment';

function template(id) {
  const startsAt = moment(faker.date.recent(-30));

  // Only a subset of the authors will have an image.
  const imageUrl = (id % 2 === 0) ? 'https://knotweed.s3.amazonaws.com/content/776906/1970-2015.jpg' : null;

  return {
    id: id,
    title: titleize(faker.lorem.sentences(1)),
    content_snippet: faker.lorem.sentences(4),
    published_at: startsAt.toISOString(),
    author_name: faker.name.findName(),
    author_id: 1,
    image_url: imageUrl,
    publication_name: faker.company.companyName(),
    publication_id: 1
  };
}

export default generateData(24, template);
