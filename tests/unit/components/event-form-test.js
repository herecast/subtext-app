import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('event-form', {
  // Specify the other units that are required for this test
  needs: ['component:event-form-dates', 'component:summer-note',
    'component:event-form-cost', 'component:event-form-venue',
    'helper:fa-icon'
  ]
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
