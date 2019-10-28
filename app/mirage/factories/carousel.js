import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  title() {
    return 'Content';
  },
  carouselType() {
    return 'content';
  },
  queryParams() {
    return {"type": "content"};
  }
});
