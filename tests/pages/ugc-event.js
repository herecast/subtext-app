import testSelector from 'ember-test-selectors';

import {
  create,
  visitable,
  fillable,
  clickable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/event/new'),
  fillInTitle: fillable(testSelector('field', 'event-title')),
  fillInDescription: fillable(testSelector('component', 'summer-note') + ' .note-editable'),
  selectVenue(venue) {
    const venueSearch = testSelector('field', 'venue-search');
    fillIn(venueSearch, venue.name);
    triggerEvent(venueSearch, 'keyup');
    click(testSelector('venue-result', venue.id));
  },
  addSingleDate() {
    click(testSelector('event-form-add-single-date'));
    // Focusing causes today to be selected
    triggerEvent(testSelector('component', 'start-date') + " input", 'focus');
    andThen(()=>{
      triggerEvent(testSelector('component', 'start-time') + " input", 'focus');
    });
    click(testSelector('save-event-date'));
  },
  next: clickable(testSelector('action', 'next')),
  saveAndPublish: clickable(testSelector('action', 'save-and-publish'))
});
