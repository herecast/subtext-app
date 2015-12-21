import Ember from 'ember';

const isPresent = Ember.isPresent;

export default Ember.Component.extend({
  post: null, // the market post
  showInfo: false,
  mixpanel: Ember.inject.service('mixpanel'),

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

  isFromListServ: Ember.computed.not('post.hasContactInfo'),

  mailToHref: function() {
    const mailTo = `mailto:${this.get('email')}`;
    const formattedPublishDate = this.get('post.publishedAt').format('MMMM Do YYYY [at] HH:mm a');
    const firstLine = `On ${formattedPublishDate}, ${this.get('post.authorName')} wrote:`;
    let tmp = document.createElement("DIV");
    tmp.innerHTML = this.get('post.content');
    const sanitizedContent = tmp.textContent || tmp.innerText || "";
    const body = `%0D%0A%0D%0A${encodeURIComponent(firstLine)}%0D%0A%0D%0A${encodeURIComponent(sanitizedContent)}`;

    return `${mailTo}?subject=${encodeURIComponent(this.get('post.title'))}&body=${body}`;
  }.property('post.authorName', 'email', 'post.title', 'post.content'),

  actions: {
    toggleInfo() {
      if (!this.get('showInfo')) {
        this.toggleProperty('showInfo');

        if (this.get('isFromListServ')) {
          this.set('email', this.get('post.authorEmail'));
        } else {
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
    },

    trackReply() {
      const mixpanel = this.get('mixpanel');
      const currentUser = this.get('session.currentUser');
      const props = {};

      Ember.merge(props, mixpanel.getUserProperties(currentUser));
      Ember.merge(props, mixpanel.getNavigationControlProperties('Reply to Content', 'Reply to Listing'));
      mixpanel.trackEvent('selectNavControl', props);       
    }
  }
});
