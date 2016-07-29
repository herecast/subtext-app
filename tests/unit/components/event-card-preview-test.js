import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('event-card-preview', {
  // Specify the other units that are required for this test
  needs: ['component:x-truncate', 'component:fa-icon',
    'template:components/event-card', 'component:gradient-truncation', 'helper:eq', 'helper:and']
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
