import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'a',
  attributeBindings: ['href', 'target'],
  target: '_blank',

  click() {
    if (this.attrs.action) {
      this.attrs.action();
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
