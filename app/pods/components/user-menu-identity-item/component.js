import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Component.extend({
  classNames: ['UserMenuIdentityItem'],
  classNameBindings: ['expanded:UserMenuIdentityItem--expanded'],
  buttonText: 'Manage Content',
  helpText: computed('name', function() {
    return `Create or manage content as '${get(this,'name')}'.`;
  }),
  name: null,
  avatarUrl: null,
  expanded: true,

  actions: {
    titleAction() {
      if('titleAction' in this.attrs) {
        this.attrs.titleAction();
      }
    },
    buttonAction() {
      if('buttonAction' in this.attrs) {
        this.attrs.buttonAction();
      }
    }
  }
});
