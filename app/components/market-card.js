import Ember from 'ember';
import moment from 'moment';
import TrackCard from 'subtext-ui/mixins/components/track-card';

const { get } = Ember;

export default Ember.Component.extend(TrackCard, {
  title: Ember.computed.oneWay('post.title'),
  isSimilarContent: false,

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
    trackSimilarContentClick() {
      this.trackEvent('selectSimilarContent', {
        navControl: 'Market',
        navControlGroup: 'Market Card',
        sourceContentId: get(this, 'sourceContentId')
      });
    }
  }
});
