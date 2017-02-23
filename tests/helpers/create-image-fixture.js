import Ember from 'ember';

const { RSVP: {Promise} } = Ember;

export default function createImageFixture(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg');
  });
}
