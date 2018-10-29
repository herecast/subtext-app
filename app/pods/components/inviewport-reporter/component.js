import Component from '@ember/component';
import { get, setProperties } from '@ember/object';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
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
          this.reportEvent('reportScrollInto', direction);
      }
    }
  },

  reportEvent(trigger, direction) {
    if (get(this, trigger)) {
      if (get(this, 'callback')) {
        get(this, 'callback')(trigger.replace('report',''), direction);
      }
    }
  }

});
