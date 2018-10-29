import { triggerEvent, triggerKeyEvent, click, fillIn } from '@ember/test-helpers';
import createImageFixture from 'subtext-ui/tests/helpers/create-image-fixture';
import { run } from '@ember/runloop';
import {
  create,
  visitable,
  fillable,
  clickable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/market/new'),
  fillInTitle: fillable('[data-test-field="market-title"]'),
  fillInDescription: fillable('[data-test-component="summer-note"]' + ' .note-editable'),
  addImageFile() {
    return new Promise((resolve) => {
      const options = {
        height: 200,
        width: 200,
        name: 'image.png',
        type: 'image/png'
      };
      createImageFixture(options)
      .then(async (file) => {
        await triggerEvent('[data-test-market-images]' + ' input[type=file]', 'change', [file] );
        resolve();
      });
    });
  },
  fillInCost: fillable('[data-test-field="market-cost"]'),
  fillInEmail: fillable('[data-test-field="market-contactEmail"]'),
  fillInPhone: fillable('[data-test-field="market-contactPhone"]'),
  selectNewLocation(locationId) {
    return run(async () => {
      await click('[data-test-action="change-location"]');
      await fillIn('[data-test-new-location-input]', 'asdfasdf');
      await triggerKeyEvent('[data-test-new-location-input]', 'keyup', 13);
      await click(`[data-test-location-choice="${locationId}"]`);
    });
  },
  next: clickable('[data-test-action="next"]'),
  saveAndPublish: clickable('[data-test-action="save-and-publish"]')
});
