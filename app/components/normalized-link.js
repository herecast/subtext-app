import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { get, computed } = Ember;

export default Ember.Component.extend(TestSelector, {
  tagName: 'a',
  attributeBindings: ['href', 'target'],
  target: '_blank',

  click() {
    const action = get(this, 'action');
    if (action) {
      action();
      return true;
    }
  },

  href: computed('url', function() {
    const url = this.get('url');

    if (url && url.indexOf('http') === 0) {
      return url;
    } else {
      return `http://${url}`;
    }
  })
});
