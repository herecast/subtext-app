import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'h1',
  classNames: ['SectionHeader', 'ContentForm-sectionHeader'],

  formattedType: computed('type', function() {
    if (this.get('type') !== 'post') {
      return `${this.get('type')} Listing`;
    } else {
      return this.get('type');
    }
  })
});
