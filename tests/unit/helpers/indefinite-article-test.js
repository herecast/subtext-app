
import { indefiniteArticle } from 'subtext-ui/helpers/indefinite-article';
import { module, test } from 'qunit';

module('Unit | Helper | indefinite article');

test('apple', function(assert) {
  let result = indefiniteArticle(['apple']);
  assert.equal(result, 'an');
});

test('Apple', function(assert) {
  let result = indefiniteArticle(['Apple']);
  assert.equal(result, 'an');
});

test('eggplant', function(assert) {
  let result = indefiniteArticle(['eggplant']);
  assert.equal(result, 'an');
});

test('ice plant', function(assert) {
  let result = indefiniteArticle(['ice plant']);
  assert.equal(result, 'an');
});

test('orange', function(assert) {
  let result = indefiniteArticle(['orange']);
  assert.equal(result, 'an');
});

test('upland cress', function(assert) {
  let result = indefiniteArticle(['upland cress']);
  assert.equal(result, 'an');
});

test('pineapple', function(assert) {
  let result = indefiniteArticle(['pineapple']);
  assert.equal(result, 'a');
});

test('bananna', function(assert) {
  let result = indefiniteArticle(['bananna']);
  assert.equal(result, 'a');
});


test('peach', function(assert) {
  let result = indefiniteArticle(['peach']);
  assert.equal(result, 'a');
});
