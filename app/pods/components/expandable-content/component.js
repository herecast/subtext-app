import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import Component from '@ember/component';
import { computed, set, get } from '@ember/object';

export default Component.extend({
  classNames: ['ExpandableContent'],
  tracking: service(),

  height: 300,

  isExpanded: false,
  needsToggleButton: false,
  alreadyRun: false,

  contentStyle: computed('height', 'isContentExpanded', function() {
    const isContentExpanded = get(this, 'isContentExpanded');
    const height = get(this, 'height');
    const style = (isContentExpanded) ? '' : `max-height: ${height}px;`;

    return htmlSafe(style);
  }),

  isContentExpanded: computed('isExpanded', 'needsToggleButton', function() {
    const isExpanded = get(this, 'isExpanded');
    const needsToggleButton = get(this, 'needsToggleButton');

    return (isExpanded || !needsToggleButton);
  }),

  _computeNeedsToggle() {
    const $content = this.$('.ExpandableContent-contentWrapper');
    const maxHeight = get(this, 'height');

    return ($content[0].scrollHeight >= maxHeight);
  },

  didRender() {
    this._super(...arguments);

    this.$('img').on('load', () => {
      set(this, 'needsToggleButton', this._computeNeedsToggle());
    });

    if (!get(this, 'alreadyRun')) {
      set(this, 'needsToggleButton', this._computeNeedsToggle());
      set(this, 'alreadyRun', true);
    }
  },

  viewMoreGTMEvent() {
    get(this, 'tracking').push({
      'event': 'content-view-more'
    });
  },

  actions: {
    toggle() {
      this.toggleProperty('isExpanded');
      if (get(this, 'isExpanded')) {
        this.viewMoreGTMEvent();
      }
    }
  }
});
