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
  fillInImage(file) {
    return andThen(() => {
      const files = [file];
      files.item = function(index) {
        return this[index];
      };

      findWithAssert(testSelector('talk-image') + ' input[type=file]').triggerHandler({
        type: 'change',
        target: {
          files: files
        }
      });
    });
  },
  selectLocation(location) {
    click(
      testSelector('action', 'open-location-selector')
    );
    andThen(() => {
      click(
        testSelector('click-target'),
        testSelector('link', 'choose-location') +
        testSelector('location', location.id)
      );
    });
  },
  pickRadius(radius) {
    click(
      testSelector('radius', radius)
    );
  },
  pickListserv() {
    click(
      testSelector('listserv-toggle')
    );
  },
  next: clickable(testSelector('action', 'next')),
  saveAndPublish: clickable(testSelector('action', 'save-and-publish'))
});
