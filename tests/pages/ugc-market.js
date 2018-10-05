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
  selectNewLocation(locationId) {
    click(testSelector('action', 'change-location'));

    andThen(() => {
      fillIn(testSelector('new-location-input'), 'asdfasdf');
      click(testSelector('button', 'change-input-value'));

      andThen(() => {
        click(testSelector('location-choice', locationId));
      });
    });
  },
  next: clickable(testSelector('action', 'next')),
  saveAndPublish: clickable(testSelector('action', 'save-and-publish'))
});
