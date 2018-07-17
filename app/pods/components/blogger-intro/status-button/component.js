import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'BloggerIntro-StatusButton',
  classNameBindings: ['isOk:is-ok', 'isNotOk:is-not-ok', 'isLoading:is-loading'],

  isOk: false,
  isNotOk: false,
  isLoading: false
});
