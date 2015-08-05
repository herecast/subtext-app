import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  classNames: ['Card', 'NewsCard', 'u-flexColumn'],

  hasImage: Ember.computed.notEmpty('item.imageUrl'),

  date: function() {
    return moment(this.get('item.publishedAt')).format('L');
  }.property('item.publishedAt'),

  backgroundImage: function() {
    const url = this.get('item.imageUrl');
    const styles = `background-image: url(${url})`;

    return new Ember.Handlebars.SafeString(styles);
  }.property('item.imageUrl')
});
