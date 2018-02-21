import testSelector from 'ember-test-selectors';

import {
  create,
  visitable,
  fillable,
  clickable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/news/new'),
  fillInTitle: fillable(testSelector('field', 'title')),
  fillInSubtitle: fillable(testSelector('field', 'subtitle')),
  fillInContent: fillable(testSelector('component', 'summer-note') + ' .note-editable'),
  fillInImage(file) {
    click(testSelector('featured-image', 'button'));
    andThen(() => {
      const files = [file];
      files.item = function(index) {
        return this[index];
      };

      findWithAssert(testSelector('news-image', 'form') + ' input[type=file]').triggerHandler({
        type: 'change',
        target: {
          files: files
        }
      });
    });
    click(testSelector('news-image', 'submit'));
  },
  startOverrideAuthor: clickable(testSelector('author-override', 'toggle')),
  overrideAuthor(author) {
    fillIn(testSelector('field', 'authorName'), author);
  },
  pickToSchedule: clickable(testSelector('schedule-publish', 'button')),
  scheduleDate(date) {
    click(testSelector('schedule-publish', 'date'));
    andThen(() => {
      find(`[data-pick='${date}']`).trigger('click');
    });
  },
  scheduleTime(time) {
    click(testSelector('schedule-publish', 'time'));
    andThen(() => {
      find(`[data-pick='${time}']`).trigger('click');
    });
  },
  scheduleConfirm: clickable(testSelector('schedule-publish', 'confirm'))
});
