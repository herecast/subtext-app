import { generateData, titleize } from '../support/utils';
import moment from 'moment';

function template(id) {
  const startsAt = moment(faker.date.recent(-30));

  // Only a subset of news will have images.
  let imageUrl = null;
  let images = [];
  if (id % 2 === 0) {
    imageUrl = 'http://placeholdit.imgix.net/~text?txtsize=33&txt=1800%C3%971200&w=1800&h=1200';
    images = [
      {
        caption: faker.lorem.sentences(1),
        credit: faker.name.findName(),
        primary: true,
        url: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=1800%C3%971200&w=1800&h=1200'
      },
       {
        caption: faker.lorem.sentences(1),
        credit: faker.name.findName(),
        primary: false,
        url: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=1800%C3%971200&w=1800&h=1200'
      },
    ];
  }

  return {
    id: id,
    author_id: 1,
    author_name: faker.name.findName(),
    content: faker.lorem.paragraphs(4),
    content_id: faker.random.number(1000),
    content_snippet: faker.lorem.sentences(4),
    image_url: imageUrl,
    images: images,
    publication_id: 1,
    publication_name: faker.company.companyName(),
    published_at: startsAt.toISOString(),
    subtitle: titleize(faker.lorem.sentences(1)),
    title: titleize(faker.lorem.sentences(1))
  };
}

export default generateData(24, template);