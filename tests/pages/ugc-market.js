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
  imageHelper(file) {
    return andThen(() => {
      const files = [file];
      files.item = function(index) {
        return this[index];
      };

      findWithAssert(testSelector('market-images') + ' input[type=file]').triggerHandler({
        type: 'change',
        target: {
          files: files
        }
      });
    });
  },
  fillInImage(file) {
    return this.imageHelper(file);
  },
  fillInSecondImage(file) {
    click(testSelector('add-another-image'));
    return this.imageHelper(file);
  },
  fillInCost: fillable(testSelector('field', 'market-cost')),
  fillInEmail: fillable(testSelector('field', 'market-contactEmail')),
  fillInPhone: fillable(testSelector('field', 'market-contactPhone')),
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
  pickListserv(listserv) {
    click(testSelector('listserv-toggle'));
    andThen(() => {
      click(
        testSelector('for-listserv', listserv.id)
        );
    });
  },
  next: clickable(testSelector('action', 'next')),
  saveAndPublish: clickable(testSelector('action', 'save-and-publish'))
});
