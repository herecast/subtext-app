import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'a',
  attributeBindings: ['href', 'target'],
  target: '_blank',

  href: function() {
    const url = this.get('url');

    if (url && url.indexOf('http') === 0) {
      return url;
    } else {
      return `http://${url}`;
    }
  }.property('url')
});
