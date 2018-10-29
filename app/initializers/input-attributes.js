import TextField from '@ember/component/text-field';

export function initialize(/* container, application */) {
  TextField.reopen({
    attributeBindings: ['aria-expanded', 'autocomplete']
  });
}

export default {
  name: 'input-attributes',
  initialize: initialize
};
