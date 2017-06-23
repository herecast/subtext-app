import Ember from 'ember';

const {get, set} = Ember;

export default Ember.Component.extend({
  tagName: 'article',
  email: null,
  didComplete: false,

  actions: {
    onEmailSubmit() {
      set(this, 'didComplete', true);
    },
    onJoinClick() {
      const changeModule = get(this, 'changeModule');
      if (changeModule) {
        changeModule('register');
      }
    }
  }
});
