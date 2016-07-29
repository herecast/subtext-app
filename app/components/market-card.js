import Ember from 'ember';
import moment from 'moment';

const { get, computed } = Ember;

export default Ember.Component.extend({
  attributeBindings: ['data-test-market-card'],
  'data-test-market-card': Ember.computed.oneWay('post.id'),

  title: Ember.computed.oneWay('post.title'),
  isSimilarContent: false,

  subtitle: computed('post.publishedAt', function() {
    return moment(get(this, 'post.publishedAt')).format('L');
  }),

  hasImage: Ember.computed.notEmpty('post.coverImageUrl'),

  userLocation: computed.oneWay('session.currentUser.location'),

  backgroundImage: computed('post.coverImageUrl', function() {
    const url = get(this, 'post.coverImageUrl');
    const styles = `background-image: url(${url})`;

    return new Ember.Handlebars.SafeString(styles);
  }),

  actions: {
    onTitleClick() {
      if (this.attrs.onTitleClick) {
        this.attrs.onTitleClick();
      }

      return true;
    }
  }
});
