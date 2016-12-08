import Ember from 'ember';

const { isPresent, computed } = Ember;

export default Ember.Component.extend({
  post: null, // the market post
  showInfo: false,

  buttonClass: computed('showInfo', function() {
    const klass = 'Button Button--wide btn';

    if (this.get('showInfo')) {
      return `${klass} Button--primary`;
    } else {
      return `${klass} Button--market market-reply`;//market-reply for google tag manager
    }
  }),

  infoLoaded: computed('email', 'phone', function() {
    return isPresent(this.get('email')) || isPresent(this.get('phone'));
  }),

  isFromListServ: Ember.computed.not('post.hasContactInfo'),

  mailToHref: computed('post.authorName', 'email', 'post.title', 'post.content', function() {
    const mailTo = `mailto:${this.get('email')}`;
    const formattedPublishDate = this.get('post.publishedAt').format('MMMM Do YYYY [at] HH:mm a');
    const firstLine = `On ${formattedPublishDate}, ${this.get('post.authorName')} wrote:`;
    let tmp = document.createElement("DIV");
    tmp.innerHTML = this.get('post.content');
    const sanitizedContent = tmp.textContent || tmp.innerText || "";
    const body = `%0D%0A%0D%0A${encodeURIComponent(firstLine)}%0D%0A%0D%0A${encodeURIComponent(sanitizedContent)}`;

    return `${mailTo}?subject=${encodeURIComponent(this.get('post.title'))}&body=${body}`;
  }),

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
    }
  }
});
