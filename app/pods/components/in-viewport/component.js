import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

const {setProperties} = Ember;

/**
 * Convenience component to fire closure actions when `ember-in-viewport` events occur
 */
export default Ember.Component.extend(InViewportMixin, {
  classNames: ['InViewport'],

  didInsertElement() {
    this._super(...arguments);
    setProperties(this, {
      viewportSpy: true
    });
  }
});
