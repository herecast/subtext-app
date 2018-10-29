import RSVP from 'rsvp';

/**
 * Generate and immediately reject a Promise with the signature expected by our error handlers
 *
 * @param status {Number} - The HTTP status to return from Fastboot
 * @returns {Promise}
 */
export default function rejectWithHttpStatus(status) {
  return new RSVP.Promise((resolve, reject) => {
    reject({
      errors:[{status}]
    });
  });
}
