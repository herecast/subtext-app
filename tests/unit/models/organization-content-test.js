import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

const {get} = Ember;

moduleForModel('organization-content', 'Unit | Model | organization content', {
  // Specify the other units that are required for this test.
  needs: ['model:business-profile']
});

test('Should show view status public when public property is null', function(assert) {
  let model = this.subject({
    publishedAt: '2017-05-25T14:23:42-04:00',
    bizFeedPublic: null
  });

  assert.equal(get(model, 'viewStatus'), 'public');
});

test('Should show view status private when public property is false', function(assert) {
  let model = this.subject({
    publishedAt: '2017-05-25T14:23:42-04:00',
    bizFeedPublic: false
  });

  assert.equal(get(model, 'viewStatus'), 'private');
});

test('Should show view status draft when publishedAt property is null', function(assert) {
  let model = this.subject({
    publishedAt: null,
    bizFeedPublic: true
  });

  assert.equal(get(model, 'viewStatus'), 'draft');
});
