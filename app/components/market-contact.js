import Ember from 'ember';
import moment from 'moment';

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

  isFromListServ: Ember.computed.not('post.hasContactInfo'),

  mailToHref: function() {
    if (this.get('isFromListServ')) {
      const mailTo = `mailto:${this.get('post.authorEmail')}`;
      const formattedPublishDay = moment(this.get('post.publishedAt')).format('MMMM Do YYYY');
      const formattedPublishTime = moment(this.get('post.publishedAt')).format('HH:mm a');
      const formattedPublishDate = `${formattedPublishDay} at ${formattedPublishTime}`;
      const firstLine = `On ${formattedPublishDate}, ${this.get('post.authorName')} wrote:`;
      let tmp = document.createElement("DIV");
      tmp.innerHTML = this.get('post.content');
      const sanitizedContent = tmp.textContent || tmp.innerText || "";
      const body = `%0D%0A%0D%0A${firstLine}%0D%0A%0D%0A${sanitizedContent}`;
      return `${mailTo}?subject=${this.get('post.title')}&body=${body}`;
    }
  }.property('post.authorName', 'post.authorEmail', 'post.title', 'post.content', 'isFromListServ'),

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