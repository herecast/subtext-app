import Ember from 'ember';
import sanitize from 'npm:sanitize-html';
import ugcConfig from 'subtext-ui/sanitizers/ugc';

const { $ } = Ember;

function fixBadLists(content) {
  // This filter is to fix <ul><ul><li></li></ul></ul>
  // pastes.  This can happen from google docs.
  // The editor doesn't understand them,
  // and it makes it hard to undo the formatting.
  let $content = $('<div>').append(content).clone();
  $content.find('ul > ul').wrap('<li>');
  $content.find('ol > ol').wrap('<li>');
  return $content.html();
}

export function sanitizeContent(rawContent) {
  // TODO TDD actual Sanitizer config
  const cleanedContent = sanitize(rawContent, ugcConfig);
  const listsFixed = fixBadLists(cleanedContent);
  return listsFixed;
}
