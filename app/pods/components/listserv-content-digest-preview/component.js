import Ember from 'ember';
/* global jQuery */

const { computed, get } = Ember;

export default Ember.Component.extend({
  classNames: ['ListservContentDigestPreview'],
  enhancedPost: computed.alias('model.enhancedPost'),

  venueName: computed.alias('enhancedPost.venueName'),
  venueCity: computed.alias('enhancedPost.venueCity'),
  venueState: computed.alias('enhancedPost.venueState'),

  bodySanitized: computed('enhancedPost.content', function(){
    const body = get(this, 'enhancedPost.content');
    const $div = jQuery('<div>').append(
      // The editor is not adding lines between paragraphs
      // this causes no space to be between the text version's
      // paragraphs.
      body.replace(/></g, "> <")
    );

    return $div.text().trim();
  }),

  price: computed('enhancedPost.cost', 'enhancedPost.price', function() {
    const price = get(this, 'enhancedPost.price');
    const cost = get(this, 'enhancedPost.cost');

    return price || cost;
  }),

  imageUrl: computed('enhancedPost.imageUrl', 'enhancedPost.primaryImage', function() {
    return get(this, 'enhancedPost.imageUrl') ||
            get(this, 'enhancedPost.primaryImage.imageUrl') ;
  })
});
