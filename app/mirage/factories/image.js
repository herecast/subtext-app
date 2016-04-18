import Mirage/*, {faker} */ from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  content_id: 1,
  image_url: 'https://placeholdit.imgix.net/~text?txtsize=18&txt=Avatar&w=200&h=200',
  primary: false,
  _delete: false
});
