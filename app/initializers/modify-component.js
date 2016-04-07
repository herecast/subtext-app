import Ember from 'ember';

let alreadyRun = false;

export function initialize() {
  if (alreadyRun) {
    return;
  } else {
    alreadyRun = true;
  }

  Ember.Component.reopen({
    attributeBindings: ['data-test-component']
  });
}

export default {
  name: 'modify-component',
  initialize
};
