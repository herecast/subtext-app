import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('event-card', {
  // Specify the other units that are required for this test
  needs: ['component:truncate-text', 'component:fa-icon', 'component:gradient-truncation', 'helper:eq', 'helper:and']
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  var component = this.subject({
    event: {
      title: ''
    }
  });
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
