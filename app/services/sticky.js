import Service from '@ember/service';
import { set, get, setProperties } from '@ember/object';

/**
 * This service should be used in conjunction with a sticky-container and sticky-position.
 * Both will use the service to communicate the location at which sticky-items should "stick".
 */
export default Service.extend({
  init() {
    this._super(...arguments);
    setProperties(this, {
      stickyPositions: {}
    });
  },

  getPosition(positionName) {
    const position = get(this, `stickyPositions.${positionName}`);
    return position ? position.getPosition() : null;
  },

  setPosition(positionName, elementTopPosition) {
    set(this, `stickyPositions.${positionName}`, elementTopPosition);
  },

  removePosition(positionName) {
    const stickyPositions = get(this, 'stickyPositions');
    if (positionName in stickyPositions) {
      delete stickyPositions[positionName];
    }
  }
});
