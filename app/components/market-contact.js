import Ember from 'ember';
import config from '../config/environment';
import ajax from 'ic-ajax';

const isPresent = Ember.isPresent;

export default Ember.Component.extend({
  postId: null, // id of the market post
  showInfo: false,

  buttonClass: function() {
    const klass = 'Button Button--wide btn';

    if (this.get('showInfo')) {
      return `${klass} Button--primary`;
    } else {
      return `${klass} Button--market`;
    }
  }.property('showInfo'),

  infoLoaded: function() {
    return isPresent(this.get('email')) || isPresent(this.get('phone'));
  }.property('email', 'phone'),

  actions: {
    toggleInfo() {
      if (!this.get('showInfo')) {
        this.toggleProperty('showInfo');

        const id = this.get('postId');
        const url = `${config.API_NAMESPACE}/market_posts/${id}/contact`;

        this.set('isLoading', true);

        ajax(url).then((response) => {
          this.setProperties({
            email: response.market_post.contact_email,
            phone: response.market_post.contact_phone,
            isLoading: false
          });
        });
      }
    }
  }
});
