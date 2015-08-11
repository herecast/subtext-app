import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('content-query-filter', 'Unit | Component | content query filter', {
  // Specify the other units that are required for this test
  needs: ['helper:fa-icon'],
  unit: true
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
