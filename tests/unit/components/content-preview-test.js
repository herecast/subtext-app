import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('content-preview', {
  needs: ['component:report-abuse',
    'component:fa-icon', 'component:truncate-text']
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
