import Component from '@ember/component';

export default Component.extend({
  classNames: 'BloggerIntro-StatusButton',
  classNameBindings: ['isOk:is-ok', 'isNotOk:is-not-ok', 'isLoading:is-loading'],

  isOk: false,
  isNotOk: false,
  isLoading: false
});
