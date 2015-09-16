import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  title: Ember.computed.oneWay('post.title'),

  subtitle: function() {
    return moment(this.get('post.publishedAt')).format('L');
  }.property('post.publishedAt'),

  hasImage: Ember.computed.notEmpty('post.coverImageUrl'),

  backgroundImage: function() {
    const url = this.get('post.coverImageUrl');
    const styles = `background-image: url(${url})`;

    return new Ember.Handlebars.SafeString(styles);
  }.property('post.coverImageUrl')
});
