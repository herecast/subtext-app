import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  title() {
    return 'Businesses';
  },
  carouselType() {
    return 'organization';
  },
  queryParams() {
    return {"type": "organization"};
  },
  afterCreate(content, server) {
    server.createList(content.carouselType, 5, {carouselId: parseInt(content.id)});
  }
});
