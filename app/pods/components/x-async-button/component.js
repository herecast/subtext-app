import { set, get } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'button',
  attributeBindings: ['cannotSubmit:disabled', 'isDisabled:disabled', 'data-test-component', 'data-test-action'],

  activePromise: null,
  noIcon: false,

  promiseAction: function() {},
  pending: 'Saving...',
  fulfilled: 'Saved!',
  rejected: 'Submission Failed',
  default: 'Submit',
  isDisabled: false,

  cannotSubmit: readOnly('activePromise.isPending'),

  click(e) {
    e.preventDefault();

    if (!get(this, 'isDisabled') && !get(this, 'cannotSubmit')) {
      const promise = this.promiseAction();
      const objectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);
      const proxy = objectPromiseProxy.create({ promise });

      set(this, 'activePromise', proxy);
    }
  },

  willDestroyElement() {
    if (isPresent(get(this, 'activePromise'))) {
      get(this, 'activePromise').destroy();
      set(this, 'activePromise', null);
    }

    this._super(...arguments);
  }
});
