import Ember from 'ember';
/* global FB */

export default Ember.Component.extend({
  classNames: ['SocialShare'],

  mailtoLink: function() {
    const href = `${location.protocol}//${location.host}${location.pathname}`;
    const title = encodeURIComponent(this.get('title'));
    const sharedBy = this.get('sharedBy');
    const subject = `Shared with you: ${title}`;
    var body;
    if (sharedBy) {
      body = `${sharedBy} shared the following content from dailyUV.com with you: ${href}`;
    } else {
      body = `I want to share the following content from dailyUV.com with you: ${href}`;
    }

    return `mailto:?subject=${subject}&body=${body}`;
  }.property('title', 'sharedBy'),

  actions: {
    shareFacebook() {
      FB.ui({
        method: 'share',
        href: `${location.protocol}//${location.host}${location.pathname}`
      }, function(){});
    }
  }
});
