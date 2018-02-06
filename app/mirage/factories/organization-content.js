import Mirage, {faker} from 'ember-cli-mirage';
import { titleize } from '../support/utils';
import moment from 'moment';

const imageUrl = 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Market+Listing&w=300&h=300';
const date1 = "2028-05-25T14:23:43-04:00";
const date2 = "2017-06-25T14:23:43-04:00";

export default Mirage.Factory.extend({
  authorId() { return faker.random.number(9999); },
  authorName() { return faker.name.findName(); },
  avatarUrl() { return faker.image.avatar(); },
  bizFeedPublic() { return faker.random.arrayElement([null, true, false]); },
  campaignEnd() { return moment(date1).toISOString(); },
  campaignStart() { return moment(faker.date.recent(-30)).toISOString(); },
  clickCount() { return faker.random.number(999); },
  commentCount() { return faker.random.number(999); },
  content() { return faker.lorem.sentences(5); },
  contentId(id) { return id; },
  contentType() { return faker.random.arrayElement(["market", "news", "event", "campaign", "sponsored_content"]); },
  cost() { return faker.random.number(999); },
  createdAt() { return moment(date2).toISOString(); },
  endsAt() { return moment(date1).toISOString(); },
  eventId() { return faker.random.number(999); },
  eventInstanceId() { return faker.random.number(999); },
  imageUrl: imageUrl,
  parentContentId() { return faker.random.number(999); },
  parentContentType() { return faker.random.number(999); },
  parentEventInstanceId() { return faker.random.number(999); },
  publishedAt() { return faker.random.arrayElement([null, date1, date2]); },
  redirectUrl: null,
  registrationDeadline: null,
  startsAt() { return faker.random.arrayElement([null, date1, date2]); },
  sunsetDate() { return faker.random.arrayElement([null, date1, date2]); },
  title() { return titleize(faker.lorem.sentences(1)); },
  updatedAt() { return faker.random.arrayElement([null, date1, date2]); },
  venueAddress() { return faker.address.streetAddress(); },
  venueName() { return faker.company.companyName(); },
  viewCount() { return faker.random.number(999); },

  afterCreate(content, server) {
    content.organization = content.organization || server.create('organization');
    content.organizationName = content.organization.name;
    content.organizationProfileImageUrl = content.organization.profileImageUrl;
  }
});
