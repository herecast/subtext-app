import { Promise } from 'rsvp';

export default function createImageFixture(options) {
  const {
    width,
    height,
    name,
    type
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      blob.lastModifiedDate = new Date();
      blob.name = name;
      resolve(blob);
    }, type);
  });
}
