import Ember from 'ember';
/* global FB */

export default Ember.Component.extend({
  classNames: ['SocialShare'],

  mailtoLink: function() {
    const href = `${location.protocol}//${location.host}${location.pathname}`;
    const title = this.get('title');
    const sharedBy = this.get('sharedBy');
    const subject = `Shared with you: ${title}`;
    const body = `${sharedBy} shared the following content from dailyUV.com with you: ${href}`;

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
