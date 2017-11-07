import Ember from 'ember';

const {
  inject,
  computed,
  isPresent,
  set,
  get
} = Ember;

export default Ember.Component.extend({
  classNames: ['LocationSwitcherTooltip'],
  userLocation: inject.service(),
  localStorage: inject.service(),
  session: inject.service(),
  locationIsConfirmed: computed.reads('userLocation.locationIsConfirmed'),
  fastboot: inject.service(),
  isFastBoot: computed.reads('fastboot.isFastBoot'),
  tracking: inject.service(),

  dismissedAt: null,

  showTip: computed('isFastBoot', 'locationIsConfirmed', 'dismissedAt', function() {
    const isFastBoot = get(this, 'isFastBoot');
    const locationIsConfirmed = get(this, 'locationIsConfirmed');
    const dismissedAt = get(this, 'dismissedAt');

    if(isFastBoot || locationIsConfirmed) {
      return false;
    } else if(isPresent(dismissedAt)) {
      const today = new Date();
      const oneWeekAgo = today.setDate(today.getDate() -7);

      return oneWeekAgo > dismissedAt;
    } else {
      return true;
    }
  }),

  // HOOKS

  init() {
    this._super(...arguments);

    this._getDismissedAt();
  },

  didInsertElement() {
    this._super(...arguments);

    if(get(this, 'showTip')) {
      // So the jobs button & tooltip can hide
      get(this, 'session').set('isLocationSwitcherToolTipOpen', true);
    }
  },

  didDestroyElement() {
    this._super(...arguments);

    this._unsetOpen();
  },

  actions: {
    dismiss() {
      get(this, 'tracking').trackLocationToolTipDismiss();
      this._setDismissedAt(new Date());
      this._unsetOpen();
    }
  },

  // PRIVATE
  _unsetOpen() {
    // So the jobs button & tooltip can show
    get(this, 'session').set('isLocationSwitcherToolTipOpen', false);
  },

  _getDismissedAt() {
    const isFastBoot = get(this, 'isFastBoot');

    if(!isFastBoot) {
      const serializedDismissed = get(this, 'localStorage').getItem('location-switcher-tooltip-dismissed');

      if(isPresent(serializedDismissed)) {
        set(this, 'dismissedAt', new Date(parseInt(serializedDismissed)) );
      }
    }
  },

  _setDismissedAt(date) {
    if(!get(this, 'isFastBoot')) {
      get(this, 'localStorage').setItem('location-switcher-tooltip-dismissed', date.getTime());
      set(this, 'dismissedAt', date);
    }
  },
});
