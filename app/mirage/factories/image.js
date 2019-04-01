import Mirage/*, { faker } */ from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  contentId: 1,
  image_url: 'https://via.placeholder.com/400x240.png?text=400x240',
  primary: false,
  _delete: false
});
