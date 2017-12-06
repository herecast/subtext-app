import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  canEdit: true,
  ownerName: faker.hacker.noun(),
  contactEmail: faker.internet.email(),
  contactPhone: faker.phone.phoneNumber(),
  content: faker.lorem.paragraph(),
  cost: "$40",
  costType: "paid",
  endsAt: faker.date.future(),
  eventUrl: faker.internet.url(),
  imageUrl: faker.image.food(),
  registrationDeadline: faker.date.future(),
  startsAt: faker.date.future(),
  subtitle: faker.company.catchPhraseDescriptor(),
  title: faker.company.catchPhraseDescriptor(),
  venueAddress: faker.address.streetAddress(),
  venueCity: faker.address.city(),
  venueName: faker.company.companyName(),
  venueState: faker.address.state(),
  venueUrl: faker.internet.url(),
  venueZip: faker.address.zipCode(),
  contentLocations: [],

  afterCreate(record, server) {
    record.firstInstanceId = server.create('eventInstance', {
      eventId: record.id
    }).id;
    record.save();
  }
});
