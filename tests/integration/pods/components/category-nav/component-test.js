import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('category-nav', 'Integration | Component | category nav', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('categories', [{
    id: 1,
    name: 'foo',
    count: 5
  },
  {
    id: 2,
    name: 'bar',
    count: 10
  }]);

  this.set('moreCategories', [{
    id: 3,
    name: 'baz',
    count: 5
  },
  {
    id: 4,
    name: 'bing',
    count: 10
  }]);

  this.render(hbs`{{category-nav
    categories=(readonly categories)
    allCategories=(readonly moreCategories)
    openCategoriesModal='openCategoriesModal'}}
  `);

  assert.equal(this.$('[data-test-navItem]').length, 2);
});
