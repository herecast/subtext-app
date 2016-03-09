import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('category-tag', 'Integration | Component | category tag', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
  //
  this.set('category', {
    icon_class: 'fa-arrows',
    name: 'Subtext'
  });

  this.set('actions', {
    selectTag() {}
  });

  this.render(hbs`
    {{category-tag
      category=category
      selectTag=(action 'selectTag')
      removable=false
    }}
  `);

  //TODO test that with removable=true the close button renders
  assert.equal(this.$().text().trim(), 'Subtext');
});
