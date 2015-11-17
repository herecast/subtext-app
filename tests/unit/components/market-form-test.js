import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import resolver from '../../helpers/resolver';

moduleForComponent('market-form', 'Unit | Component | market form', {
  // Specify the other units that are required for this test
  needs: ['component:summer-note', 'component:fa-icon', 'component:form-group',
    'component:image-upload-list'
  ],
  unit: true,

  setup: function() {
    this.container.register('template:partials/content-form-buttons',
           resolver.resolve('template:partials/content-form-buttons'));
  }
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  var component = this.subject({
    model: Ember.Object.create({
      images: [Ember.Object.create()]
    })
  });

  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
