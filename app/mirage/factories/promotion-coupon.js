import Mirage, { faker } from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  promotion_id() {return Math.floor( Math.random() * 20000 );},
  image_url: 'https://placehold.it/360x640/61e49c/ffffff/&text=Coupon',
  promotion_type: 'coupon',
  title()    { return faker.lorem.sentence(); },
  message()    { return faker.lorem.paragraphs(); }
});
