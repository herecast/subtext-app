import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import $ from 'jquery';
import Component from '@ember/component';

/**
 * This is a helper component to be used in conjunction with a sticky-container.
 * It is used as an empty placeholder to mark the position at which items should stick.
 * This way we can identify a sticky location anywhere on the page.
 */
export default Component.extend({
  classNames: ['StickyPosition'],
  name: null,

  stickyService: service('sticky'),

  getPosition() {
    return $(this.element).position().top;
  },

  updatePosition() {
    const name = get(this, 'name');
    const stickyService = get(this, 'stickyService');
    stickyService.setPosition(name, this);
  },

  didInsertElement() {
    this._super(...arguments);
    run.next(this, this.updatePosition);
  },

  willDestroyElement() {
    this._super(...arguments);
    const name = get(this, 'name');
    const stickyService = get(this, 'stickyService');
    stickyService.removePosition(name);
  }
});
