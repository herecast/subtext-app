import Ember from 'ember';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';

const {isPresent} = Ember;

export default function validateWysiwygContent() {
  return (key, value) => {
    // The WYSIWYG editor automatically wraps content in a <p> tag, but if the
    // user hits the backspace, that tags will be removed, and we don't need
    // to use jQuery to get the text content.
    const wrappedWithP = (value || '').match(/^<p>/);

    // As soon as you click into the WYSIWYG editor, it sets the content to an
    // empty <p> tag. We only really care about the text content when validating.
    if (isPresent(value) && wrappedWithP) {
      value = Ember.$(value).text();
    }

    return isPresent(value) || buildMessage(key, 'resent', value);
  };
}
