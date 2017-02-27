import config from 'subtext-ui/config/environment';

// Given a URL for a full-sized image, e.g. https://d3ctw1a5413a3o.cloudfront.net/content/885932/ec601f5d7fe3abe3-blob.jpeg,
// return a new URL for a version of the image that is optimized to fit in the given rectangle dimensions.
//
// If doCrop is true, the full-sized image will be resized and smart-cropped, via content-aware cropping, to exactly fit
// the given rectangle, with the rectangle's aspect ratio.
// Otherwise, the full-sized image will be resized to fit inside the given rectangle, but will
// retain its aspect ratio.
export default function makeOptimizedImageUrl(url, width, height, doCrop) {
  let result = url;

  if (url && /^http/i.test(url) && width && height) {
    const urlNoProtocol = url.replace(/^https?:\/\//, '');
    const quality = `filters:quality(${config['OPTIMIZED_IMAGE_QUALITY']})`;

    if (doCrop) {
      result = [config['OPTIMIZED_IMAGE_URI'], 'unsafe', `${width}x${height}`, 'smart', quality, urlNoProtocol].join('/');
    } else {
      result = [config['OPTIMIZED_IMAGE_URI'], 'unsafe', 'fit-in', `${width}x${height}`, quality, urlNoProtocol].join('/');
    }
  }

  return result;
}
