import Ember from 'ember';

const isPresent = Ember.isPresent;

export default Ember.Component.extend({
  post: null, // the market post
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

        this.set('isLoading', true);

        this.get('post').loadContactInfo().then(() => {
          this.setProperties({
            isLoading: false,
            email: this.get('post.contactEmail'),
            phone: this.get('post.contactPhone'),
          });
        });
      }
    }
  }
});
