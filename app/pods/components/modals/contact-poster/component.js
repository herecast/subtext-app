import { inject as service } from '@ember/service';
import { setProperties, get } from '@ember/object';
import ModalInstance from 'subtext-ui/pods/components/modal-instance/component';
import moment from 'moment';

export default ModalInstance.extend({
  tracking: service(),
  attributeBindings: ['data-test-modal-contact-poster'],

  init() {
    this._super(...arguments);

    setProperties(this, {
      mailToParts: this._buildMailToParts()
    });

    get(this, 'tracking').push({
      'event': 'market-reply-click'
    });
  },

  _buildMailToParts() {
    const publishedAt = get(this, 'model.publishedAt') || moment();
    const formattedPublishDate = publishedAt.format('MMMM Do YYYY [at] HH:mm a');

    const tmp = document.createElement("DIV");
    tmp.innerHTML = `\n\n On ${formattedPublishDate}, ${this.get('model.authorName')} wrote: \n ${get(this, 'model.content')}`;

    const body = encodeURIComponent(tmp.innerText || tmp.textContent);


    return {
      to      : `${get(this, 'model.contactEmail')}`,
      subject : `Someone is interested in your DailyUV Market post! — ${encodeURIComponent(get(this, 'model.title'))}`,
      body    : `${body}`
    };
  },

  _resetProperties() {
    setProperties(this, {
      email               : null,
      mailToParts         : { }
    });
  },

  _pushGTMReplyEvent(event) {
    get(this, 'tracking').push({
      'event'        : 'market-reply-email-click',
      'email-choice' : event,
    });
  },

  actions: {
    close() {
      this._resetProperties();
      this.close();
    },

    trackReplyEmailClick(mailChoice) {
      this._pushGTMReplyEvent(mailChoice);
    }
  }
});
