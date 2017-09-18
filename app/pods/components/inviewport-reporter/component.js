import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

const {setProperties, get} = Ember;

export default Ember.Component.extend(InViewportMixin, {
  classNames: 'InviewportReporter',

  reportOnce: false,
  reportScrollInto: false,
  mustScrollUp: false,
  mustScrollDown: false,
  reportEnterViewport: false,
  reportExitViewport: false,

  didInsertElement() {
    this._super(...arguments);

    setProperties(this, {
      viewportUseRAF: true,
      viewportSpy:    !get(this, 'reportOnce')
    });
  },

  didEnterViewport() {
    this.reportEvent('reportEnterViewport');
  },

  didExitViewport() {
    this.reportEvent('reportExitViewport');
  },

  didScroll(direction) {
    if (direction !== 'none') {
      if( (get(this, 'mustScrollUp') && direction === 'up') ||
          (get(this, 'mustScrollDown') && direction === 'down') ||
          ((!get(this, 'mustScrollUp') && !get(this, 'mustScrollDown')) && get(this, 'reportScrollInto')) ) {
          this.reportEvent('reportScrollInto');
      }
    }
  },

  reportEvent(trigger) {
    if (get(this, trigger)) {
      this.attrs.callback();
    }
  }

});
