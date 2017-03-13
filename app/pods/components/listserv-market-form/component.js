import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const {
  get,
  Component
} = Ember;

export default Component.extend(TestSelector, {
  tagName: 'form',

  submit() {
    // browser event
    const save = get(this, 'save');

    if(save) {
      const cs = get(this, 'changeset');
      save(cs);
    }

    return false;
  },

  actions: {
    updateContent(content) {
      get(this, 'changeset').set('content', content);
    }
  }

});
