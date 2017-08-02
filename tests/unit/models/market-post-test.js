import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('market-post', 'Unit | Model | market post', {
  // Specify the other units that are required for this test.
  needs: ['model:image', 'model:content-location', 'model:organization']
});

test('coverImageUrl should update as images change', function(assert) {
  const marketPost = this.subject();

  Ember.run(() => {
    const img1 = this.store().createRecord('image', {primary: 1, imageUrl: '1.jpg'});
    const img2 = this.store().createRecord('image', {primary: 0, imageUrl: '2.jpg'});
    const img3 = this.store().createRecord('image', {primary: 0, imageUrl: '3.jpg'});
    const img4 = this.store().createRecord('image', {primary: 0, imageUrl: '4.jpg'});

    marketPost.set('images', [img1, img2, img3, img4]);
  });

  assert.equal(marketPost.get('coverImageUrl'), '1.jpg');

  // Set a different primary image
  Ember.run(() => {
    marketPost.get('images').setEach('primary', 0);
    marketPost.get('images.lastObject').set('primary', 1);
  });

  assert.equal(marketPost.get('coverImageUrl'), '4.jpg');

  // Image URL is removed from image by image-upload component
  Ember.run(() => {
    marketPost.get('images.lastObject').set('imageUrl', null);
  });

  assert.equal(marketPost.get('coverImageUrl'), '1.jpg');

  // Image URL is removed from default image by image-upload component
  Ember.run(() => {
    marketPost.get('images.firstObject').set('imageUrl', null);
  });

  assert.equal(marketPost.get('coverImageUrl'), '2.jpg');
});
