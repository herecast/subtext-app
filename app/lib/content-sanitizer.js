import Ember from 'ember';
import sanitize from 'npm:sanitize-html';
import ugcConfig from 'subtext-ui/sanitizers/ugc';

const {$} = Ember;

function cleanHtml($content) {
  // This filter is to fix <ul><ul><li></li></ul></ul>
  // pastes.  This can happen from google docs.
  // The editor doesn't understand them,
  // and it makes it hard to undo the formatting.
  $content.find('ul > ul').wrap('<li>');
  $content.find('ol > ol').wrap('<li>');

  // Remove unnecessary tags causing formatting errors, such as a <b> tag with font-style: normal
  replaceWithSpan($content.find('u[style*="text-decoration:none"]'));
  replaceWithSpan($content.find('u[style*="text-decoration-line:underline"]'));
  replaceWithSpan($content.find('i[style*="font-style:normal"]'));
  replaceWithSpan($content.find('b[style*="font-weight:normal"]'));
  replaceWithSpan($content.find('strong[style*="font-weight:normal"]'));

  // style attributes get stripped, so wrap with respective elements instead
  $content.find('[style*="text-decoration:underline"]').wrap('<u></u>');
  $content.find('[style*="text-decoration-line:underline"]').wrap('<u></u>');
  $content.find('[style*="font-style:italic"]').wrap('<i></i>');

  ['bold', 'bolder', '700', '600', '500'].forEach((boldStyle) => {
    $content.find(`[style*="font-weight:${boldStyle}"]`).wrap('<b></b>');
  });

  // Remove extra <p> tags added into list items from pasted content
  $content.find('li > p').contents().unwrap();

  return $content;
}

function replaceWithSpan($elm) {
  $elm.replaceWith(`<span>${$elm.html()}</span>`);
}

export function sanitizeContent(content) {
  // TODO TDD actual Sanitizer config
  const $content = $('<div />').html(content);
  const cleanedContent = cleanHtml($content).html();
  return sanitize(cleanedContent, ugcConfig);
}
