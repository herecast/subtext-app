import Ember from 'ember';

export function initialize(/* container, application */) {
  Ember.TextField.reopen({
    attributeBindings: ['aria-expanded', 'autocomplete']
  });
}

export default {
  name: 'input-attributes',
  initialize: initialize
};
