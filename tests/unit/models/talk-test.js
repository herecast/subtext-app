import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('talk', 'Unit | Model | talk', {
  // Specify the other units that are required for this test.
  needs: ['model:organization']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});

test('parentContentRoute', function(assert) {
  let model = this.subject();

  Ember.run(() => model.set('parentContentType', 'market-post'));
  assert.equal(model.get('parentContentRoute'), 'market.show',
    "when parentContentType is market-post: market.show"
  );

  Ember.run(() => model.set('parentContentType', 'event'));
  assert.equal(model.get('parentContentRoute'), 'events.show',
    "when parentContentType is event: events.show"
  );

  Ember.run(() => model.set('parentContentType', 'event-instance'));
  assert.equal(model.get('parentContentRoute'), 'events.show',
    "when parentContentType is event-instance: events.show"
  );

  Ember.run(() => model.set('parentContentType', 'talk_of_the_town'));
  assert.equal(model.get('parentContentRoute'), 'talk.show',
    "when parentContentType is talk_of_the_town: talk.show"
  );
});
