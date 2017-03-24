import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { computed, get } = Ember;

export default Ember.Component.extend(TestSelector, {
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
