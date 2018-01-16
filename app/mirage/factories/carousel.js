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
  }
});
