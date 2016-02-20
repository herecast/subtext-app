import { moduleFor, test } from 'ember-qunit';
/* global Ember, sinon */

moduleFor('controller:directory', 'Unit | Controller | directory', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  beforeEach() {
    const parentCat = Ember.Object.create({ id: 1, name: 'fooParent', parents: [], child_categories: []});
    const childCat1 = Ember.Object.create({ id: 2, name: 'barChild', parents: [parentCat], child_categories: [] });
    const childCat2 = Ember.Object.create({ id: 3, name: 'bazChild', parents: [parentCat], child_categories: [] });

    parentCat.child_categories.pushObjects([childCat1, childCat2]);

    const categories = [parentCat, childCat1, childCat2];

    this.subject({
      categories: categories,
      transitionToRoute: sinon.spy()
    });
  }
});

test('computing top level categories', function(assert) {
  const controller = this.subject();

  const category = Ember.Object.create({
    name: 'foo',
    parents: []
  });

  const categories = [];
  controller.set('categories', categories);

  assert.equal(controller.get('toplevelCategories.length'), 0, 'it should not have top level categories if there are no categories');

  categories.pushObject(category);
  assert.equal(controller.get('toplevelCategories.firstObject.name'), 'foo', 'it should extract the top level categories');
});

test('handling search terms', function(assert) {
  const controller = this.subject();

  controller.send('updateQuery', 'foo');
  assert.equal(controller.get('searchTerms'), 'foo', 'it should update the search terms');
  assert.equal(controller.get('parentCategory'), null, 'it should not set the parent category when searchTerms is less than 4 characters');
  assert.ok(controller.transitionToRoute.calledWith('directory'), 'it should transition to the directory root path');

  controller.send('updateQuery', 'fooPar');
  assert.equal(controller.get('searchTerms'), 'fooPar', 'it should update the search terms');
  assert.equal(controller.get('parentCategory.name'), 'fooParent', 'it should set the parent category when there is an exact match for a parent category name');
  assert.ok(controller.transitionToRoute.calledWith('directory.search'), 'it should transition to the directory search path');

  controller.send('updateQuery', 'foo');
  assert.equal(controller.get('searchTerms'), 'foo', 'it should update the search terms');
  assert.equal(controller.get('parentCategory.name'), null, 'it should clear the parent category when searchTerms is less than 4 characters');
  assert.ok(controller.transitionToRoute.calledWith('directory'), 'it should transition back to the directory root path');

  controller.send('updateQuery', 'fooParent'); // go back to 'directory' and make sure the controller has a parentCategory
  controller.send('updateQuery', 'xfhblf');
  assert.equal(controller.get('searchTerms'), 'xfhblf', 'it should update the search terms');
  assert.equal(controller.get('parentCategory.name'), null, 'it should clear the parent category when there is no parent category match');
  assert.ok(controller.transitionToRoute.calledWith('directory.search'), 'it should transition to the directory search path');
  // TODO it should also send a query to the server
});

test('setting and removing tags', function(assert) {
  const controller = this.subject();
  const parentCategory = controller.get('categories.firstObject');
  const subCategory = parentCategory.get('child_categories.firstObject');

  controller.send('setParentCategory', parentCategory);
  assert.equal(controller.get('parentCategory.name'), 'fooParent', 'it sets the parentCategory');
  assert.equal(controller.get('subCategory'), null, 'it should not have a subCategory');
  assert.ok(controller.transitionToRoute.calledWith('directory.search'), 'it should transition to the directory search path');

  controller.send('removeTag', 'parent');
  assert.equal(controller.get('parentCategory'), null, 'it removes the parentCategory');
  assert.ok(controller.transitionToRoute.calledWith('directory'), 'it should transition to the directory root path');

  controller.send('setParentCategory', parentCategory);
  controller.send('setSubCategory', subCategory);
  assert.equal(controller.get('subCategory.name'), 'barChild', 'it sets the subcategory');
  assert.ok(controller.transitionToRoute.calledWith('directory'), 'it should transition to the directory root path');
});
