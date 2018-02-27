import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('event-preview-summary', {
  needs: ['component:disabled-checkbox', 'component:async-button', 'helper:not', 'service:history', 'component:locations-nearby']
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
