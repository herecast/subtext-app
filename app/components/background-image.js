import Ember from 'ember';

const { computed, String: { htmlSafe }  } = Ember;

export default Ember.Component.extend({
  attributeBindings: ['style'],

  style: computed('imageUrl', function() {
    const imageUrl = this.get('imageUrl'),
      style = (imageUrl) ? `background-image: url('${imageUrl}')` : '';

    return htmlSafe(style);
  })
});
