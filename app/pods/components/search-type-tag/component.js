import Component from '@ember/component';
import { get, computed } from '@ember/object';

export default Component.extend({
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
