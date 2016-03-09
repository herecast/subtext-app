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
      transitionToRoute: sinon.spy()
    });
  }
});

test('updateQuery action: short query', function(assert) {
  const controller = this.subject();
  controller.set('coords', {lat: 10, lng: 10});

  controller.send('updateQuery', '3ch');
  assert.ok(controller.transitionToRoute.calledWith('directory'), "Transition to Directory Route");
});

test('updateQuery action: long enough query', function(assert) {
  const controller = this.subject();
  controller.set('coords', {lat: 10, lng: 12});

  controller.send('updateQuery', '4chr');
  assert.ok(controller.transitionToRoute.calledWith('directory.search', {
    queryParams: {
      lat: 10,
      lng: 12,
      query: '4chr',
      category_id: null
    }
  }), "Transition to Search Route");
});

test('updateQuery action: long enough query; no coords set', function(assert) {
  const controller = this.subject();
  controller.set('coords', null);

  controller.send('updateQuery', '4chr');
  assert.notOk(controller.transitionToRoute.calledWith('directory.search'), "does not Transition to Search Route");
});

test('setCategory action', function(assert) {
  const controller = this.subject();
  controller.setProperties({
    coords: {lat: 10, lng: 12},
    query: "test"
  });

  const category = controller.get('categories.firstObject');

  controller.send('setCategory', category);

  assert.equal(controller.get('query'), null);

  assert.ok(controller.transitionToRoute.calledWith('directory.search', {
    queryParams: {
      lat: 10,
      lng: 12,
      query: null,
      category_id: category.id
    }
  }), "Transition to Search Route with category_id, and not query");
});

test('setCategory action: no coords set', function(assert) {
  const controller = this.subject();
  controller.setProperties({
    coords: null,
    query: "test"
  });

  const category = controller.get('categories.firstObject');

  controller.send('setCategory', category);

  assert.equal(controller.get('query'), null);

  assert.notOk(controller.transitionToRoute.calledWith('directory.search'), "does not transition to Search Route");
});

test('setLocation action', function(assert) {
  const controller = this.subject();
  const location = {
    human: 'My location',
    coords: {
      lat: 1,
      lng: 2
    }
  };

  controller.set('query', 'test');

  controller.send('setLocation', location.human, location.coords);

  assert.equal(controller.get('location'), location.human);
  assert.equal(controller.get('coords'), location.coords);

  assert.ok(controller.transitionToRoute.calledWith('directory.search', {
    queryParams: {
      lat: location.coords.lat,
      lng: location.coords.lng,
      query: 'test',
      category_id: null
    }
  }), "Transition to Search Route with correct coords");
});

test('setLocation action; no query set; no category set;', function(assert) {
  const controller = this.subject();
  const location = {
    human: 'My location',
    coords: {
      lat: 1,
      lng: 2
    }
  };

  controller.set('query', null);
  controller.set('category', null);

  controller.send('setLocation', location.human, location.coords);

  assert.notOk(controller.transitionToRoute.calledWith('directory.search'), "Does not Transition to Search Route");
});
