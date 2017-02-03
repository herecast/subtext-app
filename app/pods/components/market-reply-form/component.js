import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';

/* global dataLayer */

const { get, set, setProperties, run, inject } = Ember;

export default Ember.Component.extend(Validation, {
  api: inject.service(),
  post: null,

  classNames: ['MarketReplyForm'],
  classNameBindings: ['hideForm:is-closed:is-open'],

  lastStage: false,
  hideForm: true,
  currentStep: 0,

  email: null,
  name: null,
  message: null,

  errors: { },
  hasErrors: false,

  cannedReplies: [{
    label: "I need more info",
    fieldLabelText: "My question:",
    placeholderText: "Type your question here..."
  },{
    label: "I want to make an offer",
    fieldLabelText: "Your offer:",
    placeholderText: "Make an offer...",
    isPreferredOption: true
  }],

  selectedCannedReply: null,

  _resetProperties() {
    setProperties(this, {
      email               : null,
      name                : null,
      message             : null,
      mailToParts         : { },
      selectedCannedReply : null,
      lastStage           : false,
      hideForm            : true,
      hasErrors           : false,
      errors              : { },
      currentStep         : 0
    });
  },

  _validateForm() {
    this.validatesEmailFormatOf(get(this, 'email'));
    this.validatePresenceOf('name');
    this.validatePresenceOf('message');

    if (!Ember.keys(get(this, 'errors')).length) {
      return true;
    }
  },

  _scrollToFormTop() {
    // TODO scroll to form top
  },

  _buildMailToParts() {
    const formattedPublishDate = get(this, 'post.publishedAt').format('MMMM Do YYYY [at] HH:mm a');

    const tmp = document.createElement("DIV");
    tmp.innerHTML = `${get(this, 'message')} \n\n On ${formattedPublishDate}, ${this.get('post.authorName')} wrote: \n ${get(this, 'post.content')}`;

    const body = encodeURIComponent(tmp.innerText || tmp.textContent);

    return {
      to      : `${get(this, 'post.contactEmail')}`,
      subject : `${encodeURIComponent(get(this, 'subjectLine'))}`,
      body    : `${body}`
    };
  },

  actions: {
    revalidateForm() {
      if (get(this, 'hasErrors')) {
        this._validateForm();
      }
    },

    showForm(cannedReply) {
      setProperties(this, {
        selectedCannedReply: cannedReply,
        subjectLine: `[${get(cannedReply, 'label')}] Re: ${get(this, 'post.title')}`,
        hideForm: false,
        currentStep: 1
      });

      this._scrollToFormTop();

      get(this, 'post').loadContactInfo();

      run.later(() => {
        Ember.$('#email').focus();
      });
    },

    cancel() {
      if (typeof dataLayer !== "undefined") {
        dataLayer.push({
          'event': 'market-reply-cancel',
          'chosen-reply': get(this, 'selectedCannedReply.label'),
          'step' : get(this, 'currentStep')
        });
      }
      this._resetProperties();
    },

    trackDefaultEmailClick() {
      if (typeof dataLayer !== "undefined") {
        dataLayer.push({
          'event': 'market-reply-default-email-click'
        });
      }
      return true;
    },

    submit() {
      if (this._validateForm()) {
        const api = get(this, 'api');
        setProperties(this, {
          lastStage: true,
          hasErrors: false,
          mailToParts: this._buildMailToParts(),
          currentStep: 2
        });

        if (typeof dataLayer !== "undefined") {
          dataLayer.push({
            'event': 'market-reply-submit',
            'chosen-reply': get(this, 'selectedCannedReply.label')
          });
        }

        api.sendUnconfirmedUserRegistration(get(this, 'name'), get(this, 'email'));

      } else {
          if (typeof dataLayer !== "undefined") {
            dataLayer.push({
            'event': 'market-reply-submit-error',
            'chosen-reply': get(this, 'selectedCannedReply.label')
            });
          }
          set(this, 'hasErrors', true);
        }
      }
  }
});
