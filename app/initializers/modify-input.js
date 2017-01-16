import Ember from 'ember';

let alreadyRun = false;

export function initialize() {
  if (alreadyRun) {
    return;
  } else {
    alreadyRun = true;
  }

  Ember.TextField.reopen({
    attributeBindings: ['data-test-field']
  });

  Ember.Checkbox.reopen({
    attributeBindings: ['data-test-field']
  });

  Ember.TextArea.reopen({
    attributeBindings: ['data-test-field']
  });
}

export default {
  name: 'modify-input',
  initialize
};
