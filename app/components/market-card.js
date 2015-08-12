import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  classNames: ['Card', 'MarketCard'],
  title: Ember.computed.oneWay('post.title'),

  subtitle: function() {
    return moment(this.get('post.publishedAt')).format('L');
  }.property('post.publishedAt'),

  hasImage: Ember.computed.notEmpty('post.imageUrl'),

  backgroundImage: function() {
    const url = this.get('post.imageUrl');
    const styles = `background-image: url(${url})`;

    return new Ember.Handlebars.SafeString(styles);
  }.property('post.imageUrl')
});
