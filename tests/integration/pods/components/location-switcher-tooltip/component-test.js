import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('location-switcher-tooltip', 'Integration | Component | location switcher tooltip', {
  integration: true
});

test('when user location is confirmed', function(assert) {
  this.setProperties({
    localStorage: {
      getItem() {
        return null;
      }
    },
    userLocation: {
      locationIsConfirmed: true
    },
    fastboot: {
      isFastBoot: false
    },
  });

  this.render(hbs`{{location-switcher-tooltip userLocation=userLocation fastboot=fastboot localStorage=localStorage}}`);

  assert.equal(this.$('[data-test-message]').length, 0,
    "It does not show the tooltip"
  );
});

test('when is fastboot, user not confirmed', function(assert) {
  this.setProperties({
    localStorage: {
      getItem() {
        return null;
      }
    },
    userLocation: {
      locationIsConfirmed: false
    },
    fastboot: {
      isFastBoot: true
    },
  });

  this.render(hbs`{{location-switcher-tooltip userLocation=userLocation fastboot=fastboot localStorage=localStorage}}`);

  assert.equal(this.$('[data-test-message]').length, 0,
    "It does not show the tooltip"
  );
});

test('when not fastboot, user not location confirmed, not dismissed', function(assert) {
  this.setProperties({
    localStorage: {
      getItem() {
        return null;
      }
    },
    userLocation: {
      locationIsConfirmed: false
    },
    fastboot: {
      isFastBoot: false
    },
  });

  this.render(hbs`{{location-switcher-tooltip userLocation=userLocation fastboot=fastboot localStorage=localStorage}}`);

  assert.equal(this.$('[data-test-message]').length, 1,
    "It shows the tooltip"
  );
});

test('when not fastboot, user not location confirmed, dismissed', function(assert) {
  this.setProperties({
    localStorage: {
      getItem(key) {
        if(key === 'location-switcher-tooltip-dismissed') {
          return (new Date()).getTime();
        } else {
          return null;
        }
      }
    },
    userLocation: {
      locationIsConfirmed: false
    },
    fastboot: {
      isFastBoot: false
    },
  });

  this.render(hbs`{{location-switcher-tooltip userLocation=userLocation fastboot=fastboot localStorage=localStorage}}`);

  assert.equal(this.$('[data-test-message]').length, 0,
    "It does not show the tooltip"
  );
});

test('clicking the Got it button', function(assert) {
  let dismissed = false;
  let eventTracked = false;

  const mocks = {
    localStorage: {
      getItem() {
        return null;
      },
      setItem(key, value) {
        if(key === 'location-switcher-tooltip-dismissed') {
          dismissed = value;
        }
      }
    },
    userLocation: {
      locationIsConfirmed: false
    },
    fastboot: {
      isFastBoot: false
    },
    tracking: {
      trackLocationToolTipDismiss() {
        eventTracked = true;
      }
    }
  };

  this.setProperties(mocks);

  this.render(hbs`{{location-switcher-tooltip userLocation=userLocation fastboot=fastboot localStorage=localStorage tracking=tracking}}`);

  this.$('[data-test-action]').click();

  assert.ok(!!dismissed,
    "Clicking the button sets the local storage key to prevent further displays");

  assert.ok(eventTracked,
    "Clicking the button sends a tracking event");

  assert.equal(
    this.$('[data-test-message]').length, 0,
    "The message is hidden after button is clicked");
});
