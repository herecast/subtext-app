import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  promotion_id(id) { return id; },
  banner: null,
  image_url: 'https://placehold.it/600x500/61e49c/ffffff/&text=Ad',
  redirect_url: 'http://thelymeinn.com/',
  title: 'The Lyme in, a fake promo title'
});
