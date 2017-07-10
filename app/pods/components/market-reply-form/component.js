import Ember from 'ember';

const {
  get,
  setProperties,
  computed,
  inject
} = Ember;

export default Ember.Component.extend({
  tracking: inject.service(),
  post: null,

  classNames: ['MarketReplyForm'],
  classNameBindings: ['hideForm:is-closed:is-open'],

  hideForm: true,

  _resetProperties() {
    setProperties(this, {
      email               : null,
      mailToParts         : { },
      hideForm            : true
    });
  },

  _buildMailToParts() {
    const formattedPublishDate = get(this, 'post.publishedAt').format('MMMM Do YYYY [at] HH:mm a');

    const tmp = document.createElement("DIV");
    tmp.innerHTML = `\n\n On ${formattedPublishDate}, ${this.get('post.authorName')} wrote: \n ${get(this, 'post.content')}`;

    const body = encodeURIComponent(tmp.innerText || tmp.textContent);

    return {
      to      : `${get(this, 'post.contactEmail')}`,
      subject : `Someone is interested in your DailyUV Market post! — ${encodeURIComponent(get(this, 'post.title'))}`,
      body    : `${body}`
    };
  },

  hasContactEmail: computed.notEmpty('post.contactEmail'),

  _pushGTMReplyEvent(event) {
    get(this, 'tracking').push({
      'event'        : 'market-reply-email-click',
      'email-choice' : event,
    });
  },

  actions: {
    showForm() {
      setProperties(this, {
        mailToParts: this._buildMailToParts(),
        hideForm: false
      });

      get(this, 'tracking').push({
        'event': 'market-reply-click'
      });
    },

    cancel() {
      this._resetProperties();
    },

    trackReplyEmailClick(mailChoice) {
      this._pushGTMReplyEvent(mailChoice);
    }
  }
});
