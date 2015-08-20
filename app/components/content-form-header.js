import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'h1',
  classNames: ['SectionHeader', 'ContentForm-sectionHeader'],

  formattedType: function() {
    if (this.get('type') === 'market') {
      return 'listing';
    } else {
      return this.get('type');
    }
  }.property('type')
});
