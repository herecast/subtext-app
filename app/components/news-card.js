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
    const text = this.get('item.content');
    const tmp = document.createElement("div");

    tmp.innerHTML = text;

    return tmp.textContent;
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
