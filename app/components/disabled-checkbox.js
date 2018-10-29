import Component from '@ember/component';

export default Component.extend({
  classNames: ['DisabledCheckbox'],
  classNameBindings: ['checked:is-checked']
});
