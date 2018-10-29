import Mixin from '@ember/object/mixin';
import { computed, get } from '@ember/object';
import { isPresent } from '@ember/utils';
import sanitize from 'npm:sanitize-html';

export default Mixin.create({
  //over-ride in component
  maxSnippetLength: 100,

  content: '',

  textSnippet: computed('content', 'maxSnippetLength', function() {
    const content = get(this, 'content');
    const sanitizeOptions = {
      allowedTags: [],
      allowedAttributes: []
    };
    const strippedOfHTML = isPresent(content) ? sanitize(content, sanitizeOptions) : '';
    const maxSnippetLength = get(this, 'maxSnippetLength');

    if (strippedOfHTML.length > maxSnippetLength) {
      return strippedOfHTML.substring(0, maxSnippetLength-1);
    }

    return strippedOfHTML;
  }),

  isSnipped: computed('textSnippet', function() {
    return get(this, 'textSnippet').length >= get(this, 'maxSnippetLength') - 1;
  })
});
