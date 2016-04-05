import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  attributeBindings: ['style'],

  style: computed('imageUrl', function() {
    const imageUrl = this.get('imageUrl');

    if (imageUrl) {
      return `background-image: url('${imageUrl}')`.htmlSafe();
    }
  })
});
