import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  classNames: ['Card', 'NewsCard', 'u-flexColumn'],
  classNameBindings: ['missingContent:hidden'],
  hasImage: Ember.computed.notEmpty('item.imageUrl'),
  isSimilarContent: false,
  mixpanel: Ember.inject.service('mixpanel'),

  missingContent: Ember.computed.empty('item'),

  date: function() {
    return moment(this.get('item.publishedAt')).format('L');
  }.property('item.publishedAt'),

  content: function() {
    let text = this.get('item.content');

    if (text) {
      // Replace <br> and </p> tags with spaces so that they are more readable
      // on the news card. Otherwise there's no space between sentences.
      text = text.replace(/(<br +?\/?>)/g, ' ');
      text = text.replace(/<\/p>/g, '</p> ');

      const tmp = document.createElement("div");

      tmp.innerHTML = text;

      return tmp.textContent;
    }
  }.property('item.content'),

  actions: {
    trackSimilarContentClick(){
      const mixpanel = this.get('mixpanel');
      const currentUser = this.get('session.currentUser');
      const props = {};

      Ember.merge(props, mixpanel.getUserProperties(currentUser));
      Ember.merge(props, 
         mixpanel.getNavigationProperties('News', 'News Card', 1));
      Ember.merge(props, mixpanel.getContentProperties(this.get('item')));
      Ember.merge(props, {'sourceContentId': this.get('sourceContentId')});
      mixpanel.trackEvent('selectSimilarContent', props);
    }
  }
});
