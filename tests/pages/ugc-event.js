import testSelector from 'ember-test-selectors';

import {
  create,
  visitable,
  fillable,
  clickable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/events/new'),
  selectOrganization(organization) {
    click(testSelector('organization-dropdown'));
    click(testSelector('organization-select', organization.id));
  },
  fillInTitle: fillable(testSelector('field', 'event-title')),
  fillInDescription: fillable(testSelector('component', 'summer-note') + ' .note-editable'),
  expandReach: fillable(testSelector('input', 'expand-reach')),
  selectVenue(venue) {
    const venueSearch = testSelector('field', 'venue-search');
    fillIn(venueSearch, venue.name);
    triggerEvent(venueSearch, 'keyup');
    click(testSelector('venue-result', venue.id));
  },
  addSingleDate(options) {
    click(testSelector('event-form-add-single-date'));
    // Focusing causes today to be selected
    if (typeof options === 'undefined'){
      triggerEvent(testSelector('component', 'start-date') + " input", 'focus');
    } else {
      fillIn(testSelector('component', 'start-date') + " input", options.startDate);
      fillIn(testSelector('event-subtitle'), options.subtitle);
      fillIn(testSelector('event-presenter'), options.presenter);
    }
    andThen(()=>{
      triggerEvent(testSelector('component', 'start-time') + " input", 'focus');
    });
    click(testSelector('save-event-date'));
  },
  addRecurringDates(options) {
    click(testSelector('event-form-add-repeating-dates'));
    andThen(() => {
      fillIn(testSelector('recurring-component', 'start-date') + " input", options.recurringStartDate);
      fillIn(testSelector('recurring-component', 'end-date') + " input", options.recurringEndDate);
      fillIn(testSelector('recurring-component', 'repeat-type'), options.repeat);
      triggerEvent(testSelector('recurring-component', 'start-time') + " input", 'focus');
      fillIn(testSelector('recurring-component', 'subtitle'), options.subtitle);
      fillIn(testSelector('recurring-component', 'presenter'), options.presenter);
      andThen(() => {
        click(testSelector('complete-recurring-form'));
      });
    });
  },
  addDeadline(deadlineDate) {
    click(testSelector('deadline'));
    fillIn(testSelector('input', 'event-deadline') + " input", deadlineDate);
  },
  addPrice(price) {
    click(testSelector('paid-toggle'));
    fillIn(testSelector('price-description'), price);
  },
  fillInImage(file) {
    return andThen(() => {
      const files = [file];
      files.item = function(index) {
        return this[index];
      };

      findWithAssert(testSelector('event-image') + ' input[type=file]').triggerHandler({
        type: 'change',
        target: {
          files: files
        }
      });
    });
  },
  addContactEmail: fillable(testSelector('contact-email')),
  addContactPhone: fillable(testSelector('contact-phone')),
  addEventUrl: fillable(testSelector('event-url')),
  selectLocation(location) {
    click(testSelector('action', 'open-location-selector'));
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
    click(
      testSelector('listserv-toggle')
    );
    andThen(() => {
      click(
        testSelector('for-listserv', listserv.id)
      );
    });
  },
  next: clickable(testSelector('action', 'next')),
  saveAndPublish: clickable(testSelector('action', 'save-and-publish'))
});
