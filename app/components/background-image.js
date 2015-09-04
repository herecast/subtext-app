import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['style'],

  style: function() {
    const imageUrl = this.get('imageUrl');

    if (imageUrl) {
      return `background-image: url('${imageUrl}')`.htmlSafe();
    }
  }.property('imageUrl')
});
