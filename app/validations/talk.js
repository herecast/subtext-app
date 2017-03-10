import Ember from 'ember';
import {
  validatePresence
} from 'ember-changeset-validations/validators';
import validateWysiwygContent from 'subtext-ui/validators/wysiwyg-content';

const {assign} = Ember;

export default {
  title: [
    validatePresence(true)
  ],
  content: [
    validateWysiwygContent()
  ]
};
