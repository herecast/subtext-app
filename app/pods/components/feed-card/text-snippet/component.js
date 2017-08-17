import Ember from 'ember';

const { get, computed, isPresent, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-TextSnippet',
  classNameBindings: ['isSnipped:snipped-text', 'isBlurred:blurred-text'],

  showTextSnippet: false,
  content: null,
  eventInstanceId: null,

  modals: service(),

  maxSnippetLength: 200,

  textSnippet: computed('content', function() {
    const content = get(this, 'content');
    const strippedOfHTML = isPresent(content) ? content.replace(/(<([^>]+)>)/ig,"") : '';
    const maxSnippetLength = get(this, 'maxSnippetLength');

    if (strippedOfHTML.length > maxSnippetLength) {
      return strippedOfHTML.substring(0, maxSnippetLength-1);
    }

    return strippedOfHTML;
  }),

  isSnipped: computed('textSnippet', 'showTextSnippet', function() {
    if (get(this, 'showTextSnippet')) {
      return get(this, 'textSnippet').length >= get(this, 'maxSnippetLength') - 1;
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
