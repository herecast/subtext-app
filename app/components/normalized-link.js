import Component from '@ember/component';
import { computed, get } from '@ember/object';
import TestSelector from 'subtext-app/mixins/components/test-selector';

export default Component.extend(TestSelector, {
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
