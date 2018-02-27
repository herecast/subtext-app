import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('talk-preview-summary', 'Unit | Component | talk preview summary', {
  // Specify the other units that are required for this test
  needs: ['component:disabled-checkbox', 'component:async-button', 'helper:not', 'service:history', 'component:locations-nearby'],
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
