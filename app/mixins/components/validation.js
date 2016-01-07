import Ember from 'ember';

const {
  get,
  isPresent,
  run,
  set
} = Ember;

export default Ember.Mixin.create({
  init() {
    this._super(...arguments);
    set(this, 'errors', {});
    set(this, 'hasSubmittedForm', false);
  },

  scrollToFirstError() {
    Ember.$('html, body').animate({
      scrollTop: Ember.$(".has-error").offset().top
    }, 1000);
  },

  // Override in mixed in classes
  // validateForm() {
  // },

  isValid() {
    this.validateForm();

    return Ember.isBlank(Ember.keys(this.get('errors')));
  },

  validatePresenceOf(attr) {
    const value = this.get(attr);
    const attrName = Ember.A(attr.split('.')).get('lastObject');

    if (Ember.isPresent(value)) {
      this.set(`errors.${attrName}`, null);
      delete this.get('errors')[attrName];
    } else {
      this.set(`errors.${attrName}`, 'Cannot be blank');
    }
  },

  validateWYSIWYG(attr) {
    let value = this.get(attr);
    const attrName = Ember.A(attr.split('.')).get('lastObject');

    // The WYSIWYG editor automatically wraps content in a <p> tag, but if the
    // user hits the backspace, that tags will be removed, and we don't need
    // to use jQuery to get the text content.
    const wrappedWithP = (value || '').match(/^<p>/);

    // As soon as you click into the WYSIWYG editor, it sets the content to an
    // empty <p> tag. We only really care about the text content when validating.
    if (isPresent(value) && wrappedWithP) {
      value = Ember.$(value).text();
    }

    if (Ember.isPresent(value)) {
      this.set(`errors.${attrName}`, null);
      delete this.get('errors')[attrName];
    } else {
      this.set(`errors.${attrName}`, 'Cannot be blank');
    }
  },

  hasValidPassword(password) {
    const isLongEnough = (password.length >= 8) ? true : false;

    if (!isLongEnough) {
      set(this, 'errors.password', 'Is too short (minimum is 8 characters)');
    }

    if (password === '') {
      set(this, 'errors.password', 'Cannot be blank');
    }

    return isLongEnough;
  },

  hasValidEmail(email) {
    // From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
    // Retrieved 2014-01-14
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return Ember.isBlank(email) || emailRegex.test(email);
  },

  hasValidUrl(url) {
    // Copyright (c) 2010-2013 Diego Perini, MIT licensed
    // https://gist.github.com/dperini/729294
    // see also https://mathiasbynens.be/demo/url-regex
    // modified to allow protocol-relative URLs
    const urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

    return Ember.isBlank(url) || urlRegex.test(url);
  },

  actions: {
    validateForm() {
      if (get(this, 'hasSubmittedForm')) {
        run.later(() => {
          this.validateForm();
        });
      }
    },

    next() {
      set(this, 'hasSubmittedForm', true);

      if (this.isValid()) {
        this.sendAction('afterDetails');
      } else {
        run.later(() => {
          this.scrollToFirstError();
        });
      }
    },

  }
});
