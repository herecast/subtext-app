import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('event-form-date', {
  // Specify the other units that are required for this test
  needs: ['component:pikaday-input', 'helper:fa-icon']
});

test('it renders', function(assert) {
  assert.expect(1);

  // Creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  // this.render();
  // assert.equal(component._state, 'inDOM');
});
