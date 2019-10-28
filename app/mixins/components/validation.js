import { A } from '@ember/array';
import $ from 'jquery';
import Mixin from '@ember/object/mixin';
import { isEmpty, isPresent, isBlank } from '@ember/utils';
import { run } from '@ember/runloop';
import { set, get } from '@ember/object';

export default Mixin.create({
  init() {
    this._super(...arguments);
    set(this, 'errors', {});
    set(this, 'hasSubmittedForm', false);
  },

  scrollToFirstError() {
    let offset = get(this, 'media.isMobile') ? $(".MobileHeader").height() : $(".MainNav-wrapper").height();
    $('html, body').animate({
      scrollTop: $(".has-error").offset().top - offset
    }, 1000);
  },

  // Override in mixed in classes
  // validateForm() {
  // },

  isValid() {
    this.validateForm();

    return isBlank(Object.keys(this.get('errors')));
  },

  validatePresenceOf(attr) {
    const value = this.get(attr);
    const attrName = A(attr.split('.')).get('lastObject');

    const isValid = isPresent(value);

    if (isValid) {
      this.set(`errors.${attrName}`, null);
      delete this.get('errors')[attrName];
    } else {
      this.set(`errors.${attrName}`, 'Cannot be blank');
    }

    return isValid;
  },

  validateImage(name) {
    const attrKey = name || 'image';
    const image = this.get(attrKey);

    if (isBlank(image)) {
      this.set(`errors.${attrKey}`, null);
      delete this.get('errors')[attrKey];
      return true;
    }

    const isJPG = image.type === 'image/jpeg';
    const isPNG = image.type === 'image/png';
    const maxSize = 5242880; // 5MB

    if (!isJPG && !isPNG) {
      this.set(`errors.${attrKey}`, 'must be a jpg or png');
    } else if (image.size > maxSize) {
      this.set(`errors.${attrKey}`, 'must be < 5MB');
    } else {
      this.set(`errors.${attrKey}`, null);
      delete this.get('errors')[attrKey];
    }
  },

  validateWYSIWYG(attr) {
    let value = this.get(attr);
    const attrName = A(attr.split('.')).get('lastObject');

    // The WYSIWYG editor automatically wraps content in a <p> tag, but if the
    // user hits the backspace, that tags will be removed, and we don't need
    // to use jQuery to get the text content.
    const wrappedWithP = (value || '').match(/^<p>/);

    // As soon as you click into the WYSIWYG editor, it sets the content to an
    // empty <p> tag. We only really care about the text content when validating.
    if (isPresent(value) && wrappedWithP) {
      value = $(value).text();
    }

    if (isPresent(value)) {
      this.set(`errors.${attrName}`, null);
      delete this.get('errors')[attrName];
    } else {
      this.set(`errors.${attrName}`, 'Cannot be blank');
    }
  },

  hasValidPassword(password) {
    const isLongEnough = (isPresent(password) && password.length >= 8) ? true : false;

    if (!isLongEnough) {
      set(this, 'errors.password', 'Is too short (minimum is 8 characters)');
    }

    if (isEmpty(password)) {
      set(this, 'errors.password', 'Cannot be blank');
    }

    if(isLongEnough) {
      set(this, 'errors.password', null);
      delete get(this, 'errors')['password'];
    }

    return isLongEnough;
  },

  hasValidEmail(email) {
    // From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
    // Retrieved 2014-01-14
    //const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    // FROM http://emailregex.com/ 6/30/2018

    // eslint-disable-next-line no-useless-escape
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  },

  validatesEmailFormatOf(email) {
    const isValid = this.hasValidEmail(email);

    if (isValid) {
      set(this, 'errors.email', null);
      delete get(this, 'errors')['email'];
    } else {
      set(this, 'errors.email', 'Invalid email');
    }
    if (isEmpty(email)) {
      set(this, 'errors.email', 'Cannot be blank');
    }

    return isValid && !isEmpty(email);
  },

  hasValidPhone(phone) {
    // FROM http://stackoverflow.com/questions/123559/a-comprehensive-regex-for-phone-number-validation
    // Retrieved 9-26-16
    const phoneRegex = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;

    return isBlank(phone) || phoneRegex.test(phone);
  },

  urlIsValid(url) {
    const urlRegex = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/ig;
    return urlRegex.test(url);
  },

  hasValidUrl(attrName) {
    const url = get(this, `model.${attrName}`);

    if (isBlank(url) || this.urlIsValid(url)) {
      this.set(`errors.${attrName}`, null);
      delete this.get('errors')[attrName];
      return true;
    } else {
      this.set(`errors.${attrName}`, 'Invalid URL');
      return false;
    }
  },

  hasValidTwitterHandle() {
    const twitterHandle = get(this, 'model.twitterHandle');
    const twitterHandleRegex = /^@([A-Za-z0-9_]+)$/;

    if (isBlank(twitterHandle) || twitterHandleRegex.test(twitterHandle)) {
      this.set('errors.twitterHandle', null);
      delete this.get('errors')['twitterHandle'];
    } else {
      this.set('errors.twitterHandle', 'Twitter handle must start with @. The handle may have letters, numbers and underscores, but no spaces.');
    }
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
        //eslint-disable-next-line ember/closure-actions
        this.sendAction('afterDetails');
      } else {
        run.later(() => {
          this.scrollToFirstError();
        });
      }
    },

  }
});
