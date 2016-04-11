import Ember from 'ember';

let alreadyRun = false;

export function initialize() {
  if (alreadyRun) {
    return;
  } else {
    alreadyRun = true;
  }

  Ember.TextArea.reopen({
    attributeBindings: ['data-test-textarea']
  });
}

export default {
  name: 'modify-textarea',
  initialize
};
