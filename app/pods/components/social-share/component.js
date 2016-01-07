import Ember from 'ember';
/* global FB */

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  classNames: ['SocialShare'],

  mailtoLink: computed('title', 'sharedBy', function() {
    const href = `${location.protocol}//${location.host}${location.pathname}`;
    const title = encodeURIComponent(get(this, 'title'));
    const sharedBy = get(this, 'sharedBy');
    const subject = `Shared with you: ${title}`;
    var body;
    if (sharedBy) {
      body = `${sharedBy} shared the following content from dailyUV.com with you: ${href}`;
    } else {
      body = `I want to share the following content from dailyUV.com with you: ${href}`;
    }

    return `mailto:?subject=${subject}&body=${body}`;
  }),

  actions: {
    shareFacebook() {
      FB.ui({
        method: 'share',
        href: `${location.protocol}//${location.host}${location.pathname}`
      }, function(){});
    }
  }
});
