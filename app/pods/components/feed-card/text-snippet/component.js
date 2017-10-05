import Ember from 'ember';
import textSnippet from 'subtext-ui/mixins/components/text-snippet';

const { get, computed, inject:{service} } = Ember;

export default Ember.Component.extend(textSnippet, {
  classNames: 'FeedCard-TextSnippet',
  classNameBindings: ['isSnipped:snipped-text', 'isBlurred:blurred-text'],

  showTextSnippet: false,
  content: computed.reads('model.content'),

  modals: service(),

  maxSnippetLength: 200,

  showContinueReading: computed('isSnipped', 'showTextSnippet', function() {
    if (get(this, 'showTextSnippet')) {
      return get(this, 'isSnipped');
    }

    return false;
  }),

  isBlurred: computed.not('showTextSnippet'),

  actions: {
    showSignInMenu() {
      get(this, 'modals').showModal('modals/sign-in-register', 'sign-in');
    }
  }

});
