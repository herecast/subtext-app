import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { computed, get } = Ember;

export default Ember.Component.extend(TestSelector, {
  classNames: ['UserMenuIdentityItem'],
  classNameBindings: ['expanded:UserMenuIdentityItem--expanded'],

  helpText: computed('name', function() {
    return `Create or manage content as '${get(this,'name')}'.`;
  }),

  buttonText: computed('isUserAccount', function() {
    if (get(this, 'isUserAccount')) {
      return 'MyStuff';
    } else {
      return 'Profile Page';
    }
  }),

  name: null,
  isUserAccount: false,
  avatarUrl: null,
  expanded: true,

  actions: {
    titleAction() {
      const titleAction = get(this, 'titleAction');
      if (titleAction) {
        titleAction();
      }
    },
    buttonAction() {
      const buttonAction = get(this, 'buttonAction');
      if (buttonAction) {
        buttonAction();
      }
    }
  }
});
