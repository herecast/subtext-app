import { triggerEvent, triggerKeyEvent, click, fillIn, visit } from '@ember/test-helpers';
import createImageFixture from 'subtext-app/tests/helpers/create-image-fixture';
import { run } from '@ember/runloop';
import {
  create,
  fillable,
  clickable
} from 'ember-cli-page-object';

export default create({
  start() {
    return run(async () => {
      await visit('/');
      await click('[data-test-button="open-job-tray"]');
      await click('[data-test-ugc-job-link]' + `[data-test-link="market"]`);
    });
  },
  fillInTitle: fillable('[data-test-jobs-field="title"]'),
  fillInDescription: fillable('[data-test-jobs-field="content"]'),
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
        await triggerEvent('[data-test-jobs-field="images"]' + ' input[type=file]', 'change', [file] );
        resolve();
      });
    });
  },
  fillInCost: fillable('[data-test-jobs-field="cost"]'),
  fillInEmail: fillable('[data-test-jobs-field="contact-email"]'),
  fillInUrl: fillable('[data-test-jobs-field="url"]'),
  fillInPhone: fillable('[data-test-jobs-field="contact-phone"]'),
  selectNewLocation(locationId) {
    return run(async () => {
      await click('[data-test-action="change-location"]');
      await fillIn('[data-test-input="new-location"]', 'asdfasdf');
      await triggerKeyEvent('[data-test-input="new-location"]', 'keydown', 13);
      await click(`[data-test-location-choice="${locationId}"]`);
    });
  },
  preview: clickable('[data-test-action="preview"]'),
  launch: clickable('[data-test-action="launch"]')
});
