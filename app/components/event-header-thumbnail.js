import Ember from 'ember';

//TODO: photo-banner and event-header could be one generic component
export default Ember.Component.extend({
  classNames: ['EventHeader-thumbnail'],
  attributeBindings: ['style'],

  style: function() {
    const imageUrl = this.get('imageUrl');

    return `background-image: url('${imageUrl}')`.htmlSafe();
  }.property('imageUrl')
});
