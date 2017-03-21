import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const {
  get,
  set,
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
    },

    normalizeUrl(changeset) {
      let url = get(changeset, 'eventUrl').trim();
      const protocol = /^[a-z]+:/i;

      if (url === 'http://') {
        url = '';
      } else if (!protocol.test(url) && url.length > 0) {
        url = 'http://' + url;
      }

      set(changeset, 'eventUrl', url);
    },

    validate(changeset) {
      changeset.validate();
    }
  }

});
