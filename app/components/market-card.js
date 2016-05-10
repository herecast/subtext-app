import Ember from 'ember';
import moment from 'moment';
import TrackCard from 'subtext-ui/mixins/components/track-card';

const { get, computed } = Ember;

export default Ember.Component.extend(TrackCard, {
  attributeBindings: ['data-test-market-card'],
  'data-test-market-card': Ember.computed.oneWay('post.id'),

  title: Ember.computed.oneWay('post.title'),
  isSimilarContent: false,

  subtitle: computed('post.publishedAt', function() {
    return moment(this.get('post.publishedAt')).format('L');
  }),

  hasImage: Ember.computed.notEmpty('post.coverImageUrl'),

  userLocation: computed.oneWay('session.currentUser.location'),

  backgroundImage: computed('post.coverImageUrl', function() {
    const url = this.get('post.coverImageUrl');
    const styles = `background-image: url(${url})`;

    return new Ember.Handlebars.SafeString(styles);
  }),

  actions: {
    trackSimilarContentClick() {
      this.trackEvent('selectSimilarContent', {
        navControl: 'Market',
        navControlGroup: 'Market Card',
        sourceContentId: get(this, 'sourceContentId')
      });
    }
  }
});
