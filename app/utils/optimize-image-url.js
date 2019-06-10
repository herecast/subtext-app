import config from 'subtext-app/config/environment';

// Given a URL for a full-sized image, e.g. https://d3ctw1a5413a3o.cloudfront.net/content/885932/ec601f5d7fe3abe3-blob.jpeg,
// return a new URL for a version of the image that is optimized to fit in the given rectangle dimensions.
//
// If doCrop is true, the full-sized image will be resized and smart-cropped, via content-aware cropping, to exactly fit
// the given rectangle, with the rectangle's aspect ratio.
// Otherwise, the full-sized image will be resized to fit inside the given rectangle, but will
// retain its aspect ratio.
//
// This function should be functionally identical to the ImageUrlService.optimize_image_url method in
// https://github.com/subtextmedia/knotweed/blob/master/app/services/image_url_service.rb.
export default function makeOptimizedImageUrl(url, width, height, doCrop) {
  let result = url;

  if (config['ENABLE_IMAGE_OPTIMIZATION']) {
    // Cribbed from http://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript
    //eslint-disable-next-line no-useless-escape
    let match = `${url}`.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    let hostname = match && match[3];

    const hostnameIsAllowed = config['IMOPT_ALLOWED_HOSTNAMES'].includes(hostname);

    if (url && width && height && hostnameIsAllowed && /^http/i.test(url)) {
      const urlNoProtocol = url.replace(/^https?:\/\//, '');
      const quality = `filters:quality(${config['OPTIMIZED_IMAGE_QUALITY']})`;

      if (doCrop) {
        result = [config['OPTIMIZED_IMAGE_URI'], 'unsafe', `${width}x${height}`, 'smart', quality, urlNoProtocol].join('/');
      } else {
        result = [config['OPTIMIZED_IMAGE_URI'], 'unsafe', 'fit-in', `${width}x${height}`, quality, urlNoProtocol].join('/');
      }
    }
  }

  return result;
}
