import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['SearchTypeTag'],
  "data-test-component": 'search-type-tag',
  classNameBindings: ['allowWrap:allow-wrap', 'large:SearchTypeTag--large'],
  remove: null, //closure action

  allowWrap: false,
  type: null,
  large: false,
  label: computed('type', function() {
    const type = get(this, 'type') || "";

    switch(type) {
      case "event":
        return "Events";
      default:
        return type.toString().capitalize();
    }
  })
});
