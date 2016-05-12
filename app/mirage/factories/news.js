import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  title()    { return faker.lorem.sentence(); },
  subtitle() { return faker.lorem.sentence(); },
  content()  { return faker.lorem.paragraphs(); },
  published_at: null,
  updated_at: null,
  author_id: 1,
  author_name: faker.name.findName(),
  content_id: faker.random.number(1000),
  //the primary image
  image_url: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=1800%C3%971200&w=1800&h=1200',
  images: [{
    caption() { return faker.lorem.sentence(); },
    credit: null,
    url: "http://placeholdit.imgix.net/~text?txtsize=33&txt=1800%C3%971200&w=1800&h=1200",
    primary: true
  }],
  comment_count: faker.random.number(8),
  organization_id: 1,
  organization_name: faker.company.companyName()
});
