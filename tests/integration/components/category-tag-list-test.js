import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('category-tag-list', 'Integration | Component | category tag list', {
  integration: true
});

test('displaying parent categories', function(assert) {
  const categories = [{
    "id":"10000",
    "name":"Restaurants",
    "description":"",
    "icon_class":"fa-cutlery",
    "child_categories": [{
    "id":"10001",
    "name":"Italian Restaurants",
    "description":""
  },{
    "id":"10002",
    "name":"Cafes",
    "description":""
  },{
    "id":"10003",
    "name":"French Restaurants",
    "description":""
  }]
  },{
  "id":"20000",
  "name":"Drinks",
  "description":"",
  "icon_class":"fa-glass",
  'child_categories': [{
    "id":"20001",
    "name":"Martinis",
    "description":"",
    "icon_class":""
  },{
    "id":"20002",
    "name":"Beer",
    "description":"",
    "icon_class":""
  }]
}];

  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
  this.setProperties({
    categories: categories,
    parentCategory: null,
    subCategory: null,
    actions: {
      selectTag() {},
      removeTag() {}
    }
  });

  this.render(hbs`
   {{category-tag-list
     categories=categories
     selectTag=(action 'selectTag')
     removeTag=(action 'removeTag')
     parentCategory=parentCategory
     subCategory=subCategory
   }}`);

  let string = this.$().text().trim();

  assert.ok(string.match(/Restaurants/) && string.match(/Drinks/), 'it should dislay all the parent categories');

  this.set('parentCategory', categories[0]);

  const $restaurantTag = this.$('ul').find("li .CategoryTag-body:contains('Restaurants')");
  $restaurantTag.click();

  string = this.$().text().trim();

  assert.equal(string, 'Restaurants', 'it should display the selected parent category only');
});
