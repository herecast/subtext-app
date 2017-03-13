import {
  validatePresence
} from 'ember-changeset-validations/validators';
import validateWysiwygContent from 'subtext-ui/validators/wysiwyg-content';

export default {
  title: [
    validatePresence(true)
  ],
  content: [
    validateWysiwygContent()
  ]
};
