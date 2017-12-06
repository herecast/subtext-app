import testSelector from 'ember-test-selectors';

import {
  create,
  visitable,
  fillable,
  clickable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/talk/new'),
  fillInTitle: fillable(testSelector('field', 'talk-title')),
  fillInDescription: fillable(testSelector('component', 'talk-content') + ' .note-editable'),
  next: clickable(testSelector('action', 'next')),
  saveAndPublish: clickable(testSelector('action', 'save-and-publish'))
});
