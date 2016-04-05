import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'h1',
  classNames: ['SectionHeader', 'ContentForm-sectionHeader'],

  formattedType: computed('type', function() {
    if (this.get('type') === 'market') {
      return 'listing';
    } else {
      return this.get('type');
    }
  })
});
