import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  title()    { return faker.lorem.sentence(); },
  subtitle() { return faker.lorem.sentence(); },
  content()  { return faker.lorem.paragraphs(); },
  publishedAt: null,
  updatedAt: null,
  authorId: 1,
  authorName: faker.name.findName(),
  contentId: faker.random.number(1000),
  //the primary image
  imageUrl: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=1800%C3%971200&w=1800&h=1200',
  images: [{
    caption() { return faker.lorem.sentence(); },
    credit: null,
    url: "http://placeholdit.imgix.net/~text?txtsize=33&txt=1800%C3%971200&w=1800&h=1200",
    primary: true
  }],
  commentCount: faker.random.number(8),
  organizationId: null,
  organizationName: faker.company.companyName(),
  canEdit: true
});
