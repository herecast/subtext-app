import Ember from 'ember';

const { get, set, computed } = Ember;

export default Ember.Component.extend({
  classNames: ['ExpandableContent'],

  isExpanded: false,
  height: 300,
  needsToggleButton: true,

  contentStyle: computed('height', 'isExpanded', function() {
    const isExpanded = get(this, 'isExpanded');
    const needsToggleButton = get(this, 'needsToggleButton');
    const height = get(this, 'height');
    const style = (isExpanded || ! needsToggleButton) ? '' : `max-height: ${height}px;`;

    return Ember.String.htmlSafe(style);
  }),

  isContentExpanded: computed('isExpanded', 'needsToggleButton', function() {
    const isExpanded = get(this, 'isExpanded');
    const needsToggleButton = get(this, 'needsToggleButton');

    return (isExpanded || ! needsToggleButton);
  }),

  didRender() {
    this._super(...arguments);

    // Hide toggle button if original height of content is <= its collapsed height
    const $this = this.$();
    if ($this) {
      const $content = $this.find('.ExpandableContent-contentWrapper');
      if ($content.length && $content[0].scrollHeight <= get(this, 'height')) {
        Ember.run.next(this, function() {
          set(this, 'needsToggleButton', false);
        });
      }
    }
  },

  actions: {
    toggle() {
      this.toggleProperty('isExpanded');
    }
  }
});
