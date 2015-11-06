import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  title: Ember.computed.oneWay('post.title'),
  isSimilarContent: false,
  mixpanel: Ember.inject.service('mixpanel'),

  subtitle: function() {
    return moment(this.get('post.publishedAt')).format('L');
  }.property('post.publishedAt'),

  hasImage: Ember.computed.notEmpty('post.coverImageUrl'),

  backgroundImage: function() {
    const url = this.get('post.coverImageUrl');
    const styles = `background-image: url(${url})`;

    return new Ember.Handlebars.SafeString(styles);
  }.property('post.coverImageUrl'),

  actions: {
    trackSimilarContentClick(){
      const mixpanel = this.get('mixpanel');
      const currentUser = this.get('session.currentUser');
      const props = {};
      const sourceContentId = window.location.href.split('/').slice(-1).pop();

      Ember.merge(props, mixpanel.getUserProperties(currentUser));
      Ember.merge(props, 
         mixpanel.getNavigationProperties('Market', 'Market Card', 1));
      Ember.merge(props, mixpanel.getContentProperties(this.get('post')));
      Ember.merge(props, {'sourceContentId': sourceContentId});
      mixpanel.trackEvent('selectSimilarContent', props);
    }
  }
});
