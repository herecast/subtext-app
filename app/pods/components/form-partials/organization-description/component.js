import Component from '@ember/component';
import { set, get } from '@ember/object';
import { isBlank, isPresent } from '@ember/utils';
import { run } from '@ember/runloop';

export default Component.extend({

  organization: null,
  model: null,
  onFormUpdate() {},

  didReceiveAttrs() {
    this._super(...arguments);
    const organization = get(this, 'organization');

    if (isBlank(get(this, 'model'))) {
      set(this, 'model', {});
    }

    if (isPresent(organization)) {
      set(this, 'model.description', get(organization, 'description'));
    }
  },

  formUpdated() {
    this.onFormUpdate(true, get(this, 'model'));
  },

  actions: {
    formUpdated(description) {
      set(this, 'model.description', description);
      run.debounce(this, this.formUpdated, 100);
    }
  }
});
