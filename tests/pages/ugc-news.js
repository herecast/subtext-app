import { click, find, triggerEvent, triggerKeyEvent, fillIn } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import createImageFixture from 'subtext-ui/tests/helpers/create-image-fixture';
import {
  create,
  visitable,
  fillable,
  clickable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/news/new'),
  fillInTitle: fillable('[data-test-field="title"]'),
  fillInSubtitle: fillable('[data-test-field="subtitle"]'),
  fillInContent: fillable('[data-test-component="summer-note"]' + ' .note-editable'),
  openFeaturedImage() {
    return run(async () => {
      await click(find('[data-test-featured-image="button"]'));
    });
  },
  submitImage() {
    return run(async () => {
      await click(find('[data-test-news-image="submit"]'));
    });
  },
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
        await triggerEvent(find('[data-test-news-image="form"]' + ' input[type=file]'), 'change', [file] );
        resolve();
      });
    });
  },
  startOverrideAuthor: clickable('[data-test-author-override="toggle"]'),
  overrideAuthor(author) {
    return run(async () => {
      await fillIn('[data-test-field="authorName"]', author);
    });
  },
  pickToSchedule: clickable('[data-test-schedule-publish="button"]'),
  scheduleDate(date) {
    return run(async () => {
      await click('[data-test-schedule-publish="date"]');
      await click(`[data-pick='${date}']`);
    });
  },
  scheduleTime(time) {
    return run(async () => {
      await click('[data-test-schedule-publish="time"]');
      await click(`[data-pick='${time}']`);
    });
  },
  selectNewLocation(locationId) {
    return run(async () => {
      await click('[data-test-action="change-location"]');
      await fillIn('[data-test-input="new-location"]', 'asdfasdf');
      await triggerKeyEvent('[data-test-input="new-location"]', 'keydown', 13);
      await click(`[data-test-location-choice="${locationId}"]`);
    });
  },
  scheduleConfirm: clickable('[data-test-schedule-publish="confirm"]')
});
