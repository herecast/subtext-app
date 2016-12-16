import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { set, get, computed } = Ember;

export default Ember.Component.extend(TestSelector, {
  classNames: ['UserMenuIdentitySwitcher'],
  "data-test-component":'user-menu-identity-switcher',

  user: null,
  organizations: [],
  openItem: null,

  userAvatarUrl: computed('user.userImageUrl', function(){
    const userImageUrl = get(this, 'model.userImageUrl');

    return (userImageUrl ? userImageUrl : '/images/user-default-avatar.svg');
  }),

  didReceiveAttrs() {
    this._super(...arguments);
    set(this, 'openItem',
      this.attrs.user
    );
  },

  actions: {
    expandItem(ctx) {
      set(this, 'openItem', ctx);
    },
    openDashboard() {
      if ('openDashboard' in this.attrs) {
        this.attrs.openDashboard(...arguments);
      }
    }
  }
});
