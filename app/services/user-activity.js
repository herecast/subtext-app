//adapted from https://github.com/elwayman02/ember-user-activity/blob/master/addon/services/scroll-activity.js
import { get, setProperties } from '@ember/object';

import { run } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import Service, { inject as service } from '@ember/service';

export default Service.extend({
  fastboot: service(),
  
  init() {
    if (get(this, 'fastboot.isFastBoot')) { return; }

    this._super(...arguments);
    setProperties(this, {
      _trackers: []
    });
  },

  willDestroy() {
    if (get(this, 'fastboot.isFastBoot')) { return; }

    this._trackers = [];
  },

  register(target, element) {
    if (get(this, 'fastboot.isFastBoot')) { return; }

    this._trackers.push({
      target,
      element,
      registerTime: Date.now()
    });
  },

  unregister(target) {
    this._removeTracker(target);
  },

  triggerTimedEvents(target, callback=()=>{}, timeIntervals=[], onRegister=false) {
    if (get(this, 'fastboot.isFastBoot')) { return; }

    let tracker = this._getTracker(target);

    setProperties(tracker, {
      callback,
      timeIntervals,
      onRegister
    });

    this._reportTimedEvents(tracker);

  },

  _reportTimedEvents({callback, timeIntervals, onRegister}) {

    if (onRegister && timeIntervals[0] !== 0) {
      timeIntervals.unshift(0);
    }

    let timerFn = function(time) {
      run.later(() => {callback(time);}, time);
    };

    for (let i=0;i<timeIntervals.length;i++) {
      const timeInterval = timeIntervals[i];
      timerFn(timeInterval);
    }
  },

  _getTracker(target) {
    return get(this, '_trackers')[this._getTrackerIndex(target)];
  },

  _removeTracker(target) {
    const trackerIndex = this._getTrackerIndex(target);

    if( !isEmpty(trackerIndex)) {
      let trackers = get(this, '_trackers');

      trackers.slice(trackerIndex, 1);
    }
  },

  _getTrackerIndex(target) {
    const trackers = get(this, '_trackers');

    for (let i=0;i<trackers.length;i++) {
      let tracker = trackers[i];
      if (tracker.target === target) {
        return i;
      }
    }

    return null;
  }
});
