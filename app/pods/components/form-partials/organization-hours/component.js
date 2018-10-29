import Component from '@ember/component';
import { set, get, setProperties } from '@ember/object';
import { isBlank, isPresent } from '@ember/utils';
import { run } from '@ember/runloop';

export default Component.extend({
  organization: null,

  init() {
    this._super(...arguments);
    setProperties(this, {
      model: {}
    });
  },

  onFormUpdate() {},

  didReceiveAttrs() {
    this._super(...arguments);

    if (isBlank(get(this, 'model'))) {
      set(this, 'model', {});
    }

    const organization = get(this, 'organization');

    if (isPresent(organization)) {
      set(this, 'model.hours', get(organization, 'hours'));
    }
  },

  formUpdated() {
    this.onFormUpdate(true, get(this, 'model'));
  },

  actions: {
    formUpdated(hours) {
      set(this, 'model.hours', hours);
      run.debounce(this, this.formUpdated, 100);
    }
  }
});
