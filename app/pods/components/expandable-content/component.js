import Ember from 'ember';

const { get, set, computed } = Ember;

export default Ember.Component.extend({
  classNames: ['ExpandableContent'],

  isExpanded: false,
  height: 300,
  needsToggleButton: false,

  contentStyle: computed('height', 'isContentExpanded', function() {
    const isContentExpanded = get(this, 'isContentExpanded');
    const height = get(this, 'height');
    const style = (isContentExpanded) ? '' : `max-height: ${height}px;`;

    return Ember.String.htmlSafe(style);
  }),

  isContentExpanded: computed('isExpanded', 'needsToggleButton', function() {
    const isExpanded = get(this, 'isExpanded');
    const needsToggleButton = get(this, 'needsToggleButton');

    return (isExpanded || !needsToggleButton);
  }),

  computeNeedsToggle() {
    const $content = this.$('.ExpandableContent-contentWrapper');
    const maxHeight = get(this, 'height');

    if ($content[0].scrollHeight >= maxHeight) {
      Ember.run.next(this, function() {
        if (!get(this, 'isDestroyed')) {
          set(this, 'needsToggleButton', true);
        }
      });
      return true;
    } else {
      Ember.run.next(this, function() {
        if (!get(this, 'isDestroyed')) {
          set(this, 'needsToggleButton', false);
        }
      });
      return false;
    }
  },

  didRender() {
    this._super(...arguments);

    let maxHeightReached = false;

    this.$('img').on('load', () => {
      if(!maxHeightReached) {
        maxHeightReached = this.computeNeedsToggle();
      }
    });

    maxHeightReached = this.computeNeedsToggle();
  },

  actions: {
    toggle() {
      this.toggleProperty('isExpanded');
    }
  }
});
