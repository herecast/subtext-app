import { moduleFor, test } from 'ember-qunit';
/* global Ember, sinon */

moduleFor('controller:directory', 'Unit | Controller | directory', {
  needs: ['model:business-profile'],

  beforeEach() {
    const parentCat = Ember.Object.create({ id: 1, name: 'fooParent', parent_ids: [ ], child_ids: [ 2, 3 ] });
    const childCat1 = Ember.Object.create({ id: 2, name: 'barChild',  parent_ids: [1], child_ids: [ ] });
    const childCat2 = Ember.Object.create({ id: 3, name: 'bazChild',  parent_ids: [1], child_ids: [ ] });

    const categories = [parentCat, childCat1, childCat2];

    this.subject({
      categories: categories,
      transitionToRoute: sinon.spy(),
      geo: {
        userLocation: {
          coords: {
            lat: 10.000,
            lng: -20.000
          }
        }
      },
      store: {
        query: sinon.spy()
      }
    });
  }
});

test('computing top level categories', function(assert) {
  const controller = this.subject();
  const category = Ember.Object.create({
    name: 'foo',
    parent_ids: [],
    child_ids: [1]
  });
  const categories = [];
  controller.set('categories', categories);

  assert.equal(controller.get('toplevelCategories.length'), 0, 'it should not have top level categories if there are no categories');

  controller.get('categories').pushObject(category);

  assert.equal(controller.get('toplevelCategories.length'), 1, 'it should extract the top level categories');
  // TODO add at least one child category to test accuracy of ^^
  // it should filter out the child categories
});

test('search terms: short searches', function(assert) {
  const controller = this.subject();

  controller.send('updateQuery', 'foo');

  assert.equal(controller.get('searchTerms'), 'foo', 'it should update the search terms');
  assert.equal(controller.get('parentCategory'), null, 'it should not set the parent category when searchTerms is less than 4 characters');
  assert.ok(controller.transitionToRoute.calledWith('directory'), 'it should transition to the directory root path');
  assert.equal(controller.store.query.notCalled, true, 'it should not make a query');
});

test('search terms: short searches should clear the query param', function(assert) {
  const controller = this.subject();
  controller.set('query', 'antidisestablishmentarianism');

  controller.send('updateQuery', 'foo');

  assert.equal(controller.get('query'), null, 'it should clear the query parameter');
});

test('search terms: partial category matches', function(assert) {
  const controller = this.subject();

  controller.send('updateQuery', 'fooPar');

  assert.equal(controller.get('searchTerms'), 'fooPar', 'it should update the search terms');
  assert.equal(controller.get('parentCategory.name'), 'fooParent', 'it should set the parent category when there is an exact match for a parent category name');
  assert.ok(controller.transitionToRoute.calledWith('directory.search'), 'it should transition to the directory search path');
  assert.equal(controller.store.query.notCalled, true, 'it should not make a query');
});

test('search terms: exact category matches', function(assert) {
  const controller = this.subject();
  controller.set('query', 'dummy-query');

  controller.send('updateQuery', 'fooParent'); // go back to 'directory' and make sure the controller has a parentCategory
  controller.send('updateQuery', 'foo');

  assert.equal(controller.get('searchTerms'), 'foo', 'it should update the search terms');
  assert.equal(controller.get('parentCategory.name'), null, 'it should clear the parent category when searchTerms is less than 4 characters');
  assert.ok(controller.transitionToRoute.calledWith('directory'), 'it should transition back to the directory root path');
  assert.equal(controller.store.query.notCalled, true, 'it should not make a query');
  assert.equal(controller.get('query'), null, 'it should clear the query param');
});

test('search terms: no category match', function(assert) {
  const controller = this.subject();
  const expectedQuery = {
    query: 'xfhblf',
    lat: 10.000,
    lng: -20.000
  };

  controller.send('updateQuery', 'fooParent'); // go back to 'directory' to make sure the controller has a parentCategory
  controller.send('updateQuery', 'xfhblf');

  assert.equal(controller.get('searchTerms'), 'xfhblf', 'it should update the search terms');
  assert.equal(controller.get('parentCategory.name'), null, 'it should clear the parent category when there is no parent category match');
  assert.ok(controller.transitionToRoute.calledWith('directory.search.results'), 'it should transition to the directory search path');
  assert.equal(controller.store.query.calledWithExactly('business-profile', expectedQuery), true, 'it should make a query');
  assert.equal(controller.get('query'), 'xfhblf', 'it should set the query param');
});

test('search terms: clear category before making query', function(assert) {
  const controller = this.subject();
  const parentCategory = controller.get('categories.firstObject');

  const subCategory = controller.get('categories').filterBy('id', parentCategory.get('child_ids')[0])[0];
  const expectedQuery = {
    query: 'xfhblf',
    lat: 10.000,
    lng: -20.000
  };
  controller.send('setParentCategory', parentCategory);
  controller.send('setSubCategory', subCategory);

  assert.equal(controller.get('subcategory_id'), 2, 'it needs to have a subcategory so we can clear it');

  // enter new search terms that don't match a category so that the query is made
  controller.send('updateQuery', 'xfhblf');

  assert.equal(controller.store.query.calledWithExactly('business-profile', expectedQuery), true, 'it should make a query');
  assert.equal(controller.get('subcategory_id'), null, 'it should clear the subcategory_id before making a regular query');
  assert.equal(controller.get('query'), 'xfhblf', 'it should set the query param');
});

test('category tags: setting parent category', function(assert) {
  const controller = this.subject();
  const parentCategory = controller.get('categories.firstObject');

  controller.send('setParentCategory', parentCategory);

  assert.equal(controller.get('parentCategory.name'), 'fooParent', 'it sets the parentCategory');
  assert.equal(controller.get('subCategory'), null, 'it should not have a subCategory');
  assert.ok(controller.transitionToRoute.calledWith('directory.search'), 'it should transition to the directory search path');
  assert.equal(controller.store.query.notCalled, true, 'it should not make a query');
});

test('category tags: removing parent category', function(assert) {
  const controller = this.subject();

  controller.send('removeTag', 'parent');

  assert.equal(controller.get('parentCategory'), null, 'it removes the parentCategory');
  assert.ok(controller.transitionToRoute.calledWith('directory'), 'it should transition to the directory root path');
  assert.ok(controller.store.query.notCalled, true, 'it should not make a query');
});

test('category tags: removing subcategory', function(assert) {
  const controller = this.subject();
  const parentCategory = controller.get('categories.firstObject');
  const subCategory = controller.get('categories').filterBy('id', parentCategory.get('child_ids')[0])[0];

  controller.send('setParentCategory', parentCategory);
  controller.send('setSubCategory', subCategory);

  // reset spy after sending setSubCategory action, which causes a query
  controller.store.query.reset();

  controller.send('removeTag', 'child');

  assert.equal(controller.get('subCategory'), null, 'it removes the subCategory');
  assert.equal(controller.get('subcategory_id'), null, 'it should clear the category_id param');
  assert.ok(controller.store.query.notCalled, true, 'it should not make a query');
});

test('category tags: setting subcategory', function(assert) {
  const controller = this.subject();
  const parentCategory = controller.get('categories.firstObject');
  const subCategory = controller.get('categories').filterBy('id', parentCategory.get('child_ids')[0])[0];

  const expectedQuery = {
    category_id: 2,
    lat: 10.000,
    lng: -20.000
  };

  controller.send('setParentCategory', parentCategory);
  controller.send('setSubCategory', subCategory);

  assert.equal(controller.get('subCategory.name'), 'barChild', 'it sets the subcategory');
  assert.ok(controller.transitionToRoute.calledWith('directory.search.results'), 'it should transition to the directory search results path');
  assert.equal(controller.store.query.calledWithExactly('business-profile', expectedQuery), true, 'it should make a query');
  assert.equal(controller.get('subcategory_id'), 2, 'it should set the subcategory_id param');
});
