/**
 * Adapted from: https://github.com/ember-cli/ember-ajax/blob/master/addon/errors.js
 */

import Ember from 'ember';

const { RSVP: {Promise}, Error: EmberError, isArray, merge } = Ember;

function isString(str) {
  return typeof str === 'string';
}

function isObject(object) {
  return typeof object === 'object';
}

/**
 * @class UnknownFetchError
 * @private
 */
export function UnknownFetchError(response, message = 'An unknown error occurred in the fetch request.') {
  EmberError.call(this, message);

  this.response = response;
  this.message = message;
}

RequestError.prototype = Object.create(EmberError.prototype);


/**
 * @class RequestError
 * @private
 */
export function RequestError(response, message = 'Ajax operation failed') {
  EmberError.call(this, message);

  this.message = message;
  this.response = response;
  this.errors = [
    {
      title: 'Ajax Error',
      detail: message
    }
  ];
}

RequestError.prototype = Object.create(EmberError.prototype);

/**
 * @class UnknownFetchError
 * @public
 * @extends RequestError
 */
export function UnknownFetchError(response) {
  RequestError.call(this, response, 'An unknown error occurred in the fetch request.');
}

UnknownFetchError.prototype = Object.create(RequestError.prototype);

/**
 * @class InvalidError
 * @public
 * @extends RequestError
 */
export function InvalidError(response) {
  RequestError.call(this, response, 'Request was rejected because it was invalid');
}

InvalidError.prototype = Object.create(RequestError.prototype);

/**
 * @class UnauthorizedError
 * @public
 * @extends RequestError
 */
export function UnauthorizedError(response) {
  RequestError.call(this, response, 'Ajax authorization failed');
}

UnauthorizedError.prototype = Object.create(RequestError.prototype);

/**
 * @class ForbiddenError
 * @public
 * @extends RequestError
 */
export function ForbiddenError(response) {
  RequestError.call(this, response,
    'Request was rejected because user is not permitted to perform this operation.');
}

ForbiddenError.prototype = Object.create(RequestError.prototype);

/**
 * @class BadRequestError
 * @public
 * @extends RequestError
 */
export function BadRequestError(response) {
  RequestError.call(this, response, 'Request was formatted incorrectly.');
}

BadRequestError.prototype = Object.create(RequestError.prototype);

/**
 * @class NotFoundError
 * @public
 * @extends RequestError
 */
export function NotFoundError(response) {
  RequestError.call(this, response, 'Resource was not found.');
}

NotFoundError.prototype = Object.create(RequestError.prototype);

/**
 * @class TimeoutError
 * @public
 * @extends RequestError
 */
export function TimeoutError() {
  RequestError.call(this, null, 'The ajax operation timed out');
}

TimeoutError.prototype = Object.create(RequestError.prototype);

/**
 * @class AbortError
 * @public
 * @extends RequestError
 */
export function AbortError() {
  RequestError.call(this, null, 'The ajax operation was aborted');
}

AbortError.prototype = Object.create(RequestError.prototype);

/**
 * @class ConflictError
 * @public
 * @extends RequestError
 */
export function ConflictError(response) {
  RequestError.call(this, response, 'The ajax operation failed due to a conflict');
}

ConflictError.prototype = Object.create(RequestError.prototype);

/**
 * @class ServerError
 * @public
 * @extends RequestError
 */
export function ServerError(response) {
  RequestError.call(this, response, 'Request was rejected due to server error');
}

ServerError.prototype = Object.create(RequestError.prototype);

/**
 * Checks if the given error is or inherits from RequestError
 *
 * @method isRequestError
 * @public
 * @param  {Error} error
 * @return {Boolean}
 */
export function isRequestError(error) {
  return error instanceof RequestError;
}

/**
 * Checks if the given error is not a RequestError
 *
 * @method isUnknownError
 * @public
 * @param  {Error} error
 * @return {Boolean}
 */
export function isUnknownError(error) {
  return !(error instanceof RequestError);
}

/**
 * Checks if the given status code or RequestError object represents an
 * unauthorized request error
 *
 * @method isUnauthorizedError
 * @public
 * @param  {Number | RequestError} error
 * @return {Boolean}
 */
export function isUnauthorizedError(error) {
  if (isRequestError(error)) {
    return error instanceof UnauthorizedError;
  } else {
    return error === 401;
  }
}

/**
 * Checks if the given status code or RequestError object represents a forbidden
 * request error
 *
 * @method isForbiddenError
 * @public
 * @param  {Number | RequestError} error
 * @return {Boolean}
 */
export function isForbiddenError(error) {
  if (isRequestError(error)) {
    return error instanceof ForbiddenError;
  } else {
    return error === 403;
  }
}

/**
 * Checks if the given status code or RequestError object represents an invalid
 * request error
 *
 * @method isInvalidError
 * @public
 * @param  {Number | RequestError} error
 * @return {Boolean}
 */
export function isInvalidError(error) {
  if (isRequestError(error)) {
    return error instanceof InvalidError;
  } else {
    return error === 422;
  }
}

/**
 * Checks if the given status code or RequestError object represents a bad request
 * error
 *
 * @method isBadRequestError
 * @public
 * @param  {Number | RequestError} error
 * @return {Boolean}
 */
export function isBadRequestError(error) {
  if (isRequestError(error)) {
    return error instanceof BadRequestError;
  } else {
    return error === 400;
  }
}

/**
 * Checks if the given status code or RequestError object represents a
 * "not found" error
 *
 * @method isNotFoundError
 * @public
 * @param  {Number | RequestError} error
 * @return {Boolean}
 */
export function isNotFoundError(error) {
  if (isRequestError(error)) {
    return error instanceof NotFoundError;
  } else {
    return error === 404;
  }
}

/**
 * Checks if the given status code or RequestError object represents a
 * "timeout" error
 *
 * @method isTimeoutError
 * @public
 * @param  {RequestError} error
 * @return {Boolean}
 */
export function isTimeoutError(error) {
  return error instanceof TimeoutError;
}

/**
 * Checks if the given status code or RequestError object represents an
 * "abort" error
 *
 * @method isAbortError
 * @public
 * @param  {RequestError} error
 * @return {Boolean}
 */
export function isAbortError(error) {
  return error instanceof AbortError;
}

/**
 * Checks if the given status code or RequestError object represents a
 * conflict error
 *
 * @method isConflictError
 * @public
 * @param  {Number | RequestError} error
 * @return {Boolean}
 */
export function isConflictError(error) {
  if (isRequestError(error)) {
    return error instanceof ConflictError;
  } else {
    return error === 409;
  }
}

/**
 * Checks if the given status code or RequestError object represents a server error
 *
 * @method isServerError
 * @public
 * @param  {Number | RequestError} error
 * @return {Boolean}
 */
export function isServerError(error) {
  if (isRequestError(error)) {
    return error instanceof ServerError;
  } else {
    return error >= 500 && error < 600;
  }
}

/**
 * Checks if the given status code represents a successful request
 *
 * @method isSuccess
 * @public
 * @param  {Number} status
 * @return {Boolean}
 */
export function isSuccess(status) {
  let s = parseInt(status, 10);
  return s >= 200 && s < 300 || s === 304;
}

export function detectResponseStatus(response) {
  const status = response.status;

  if(isSuccess(status)) {
    return Promise.resolve(response);
  } else if (isUnauthorizedError(status)) {
    return Promise.reject(new UnauthorizedError(response));
  } else if (isForbiddenError(status)) {
    return Promise.reject(new ForbiddenError(response));
  } else if (isInvalidError(status)) {
    return Promise.reject(new InvalidError(response));
  } else if (isBadRequestError(status)) {
    return Promise.reject(new BadRequestError(response));
  } else if (isNotFoundError(status)) {
    return Promise.reject(new NotFoundError(response));
  } else if (isAbortError(status)) {
    return Promise.reject(new AbortError(response));
  } else if (isConflictError(status)) {
    return Promise.reject(new ConflictError(response));
  } else if (isServerError(status)) {
    return Promise.reject(new ServerError(response));
  } else {
    return Promise.reject(new UnknownFetchError(response));
  }
}


/**
 * Normalize the error from the server into the same format
 *
 * The format we normalize to is based on the JSON API specification.  The
 * return value should be an array of objects that match the format they
 * describe. More details about the object format can be found
 * [here](http://jsonapi.org/format/#error-objects)
 *
 * The basics of the format are as follows:
 *
 * ```javascript
 * [
 *   {
 *     status: 'The status code for the error',
 *     title: 'The human-readable title of the error'
 *     detail: 'The human-readable details of the error'
 *   }
 * ]
 * ```
 *
 * In cases where the server returns an array, then there should be one item
 * in the array for each of the payload.  If your server returns a JSON API
 * formatted payload already, it will just be returned directly.
 *
 * If your server returns something other than a JSON API format, it's
 * suggested that you override this method to convert your own errors into the
 * one described above.
 *
 * @method normalizeErrorResponse
 * @private
 * @param  {Number} status
 * @param  {Object} headers
 * @param  {Object} payload
 * @return {Array} An array of JSON API-formatted error objects
 */
export function normalizeErrorResponse(status, headers, payload) {
  if (isArray(payload.errors)) {
    return payload.errors.map(function(error) {
      if (isObject(error)) {
        let ret = merge({}, error);
        ret.status = `${error.status}`;
        return ret;
      } else {
        return {
          status: `${status}`,
          title: error
        };
      }
    });
  } else if (isArray(payload)) {
    return payload.map(function(error) {
      if (isObject(error)) {
        return {
          status: `${status}`,
          title: error.title || 'The backend responded with an error',
          detail: error
        };
      } else {
        return {
          status: `${status}`,
          title: `${error}`
        };
      }
    });
  } else {
    if (isString(payload)) {
      return [
        {
          status: `${status}`,
          title: payload
        }
      ];
    } else {
      return payload.errors;
    }
  }
}
