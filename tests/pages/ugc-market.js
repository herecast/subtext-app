import testSelector from 'ember-test-selectors';

import {
  create,
  visitable,
  fillable,
  clickable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/market/new'),
  fillInTitle: fillable(testSelector('field', 'market-title')),
  fillInDescription: fillable(testSelector('component', 'summer-note') + ' .note-editable'),
  next: clickable(testSelector('action', 'next')),
  saveAndPublish: clickable(testSelector('action', 'save-and-publish'))
});
