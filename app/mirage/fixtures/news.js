import { generateData, titleize } from '../support/utils';
import moment from 'moment';

function generateContent(num, opts = {}) {
  const text = faker.lorem.paragraphs(num);
  const youtube = (opts.youtube) ? '<iframe width="420" height="315" src="https://www.youtube.com/embed/bUpF2d4H3x8" frameborder="0" allowfullscreen></iframe>' : null;

  return (youtube) ? text + '<br>' + youtube : text;
}

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
    comment_count: faker.random.number(8),
    content: generateContent(4, { youtube: (id % 2 === 0) }),
    content_id: faker.random.number(1000),
    image_url: imageUrl,
    images: images,
    publication_id: 1,
    publication_name: faker.company.companyName(),
    published_at: startsAt.toISOString(),
    subtitle: titleize(faker.lorem.sentences(1)),
    title: titleize(faker.lorem.sentences(1))
  };
}

export default generateData(50, template);
