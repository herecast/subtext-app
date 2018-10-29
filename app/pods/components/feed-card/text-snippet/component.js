import { reads, not } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { inject as service } from '@ember/service';
import textSnippet from 'subtext-ui/mixins/components/text-snippet';

export default Component.extend(textSnippet, {
  classNames: 'FeedCard-TextSnippet',
  classNameBindings: ['isSnipped:snipped-text', 'isBlurred:blurred-text'],

  showTextSnippet: true,
  content: reads('model.content'),

  modals: service(),

  maxSnippetLength: 200,

  showContinueReading: computed('isSnipped', 'showTextSnippet', function() {
    if (get(this, 'showTextSnippet')) {
      return get(this, 'isSnipped');
    }

    return false;
  }),

  isBlurred: not('showTextSnippet'),

  actions: {
    showSignInMenu() {
      get(this, 'modals').showModal('modals/sign-in-register', 'sign-in');
    }
  }

});
