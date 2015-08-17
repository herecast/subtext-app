import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('content-preview', {
  needs: ['template:events/show', 'component:content-comments', 'component:report-abuse',
    'helper:fa-icon', 'component:background-image', 'component:x-truncate',
    'component:event-similar-content', 'component:event-map', 'component:event-other-dates']
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
