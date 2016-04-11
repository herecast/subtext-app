import Ember from 'ember';

let alreadyRun = false;

export function initialize() {
  if (alreadyRun) {
    return;
  } else {
    alreadyRun = true;
  }

  Ember.LinkComponent.reopen({
    attributeBindings: ['data-test-link']
  });
}

export default {
  name: 'modify-link-to',
  initialize
};
