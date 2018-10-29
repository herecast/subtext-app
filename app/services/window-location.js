import Service, { inject as service } from '@ember/service';
import { set, get } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Service.extend({
  fastboot: service(),
  isFastBoot() {
    return get(this, 'fastboot.isFastBoot');
  },
  redirectTo(href) {
    if(this.isFastBoot()) {
      const fastboot = get(this, 'fastboot');
      set(fastboot, 'response.statusCode', 307);
      set(fastboot, 'response.headers.Location', href);
    } else {
      return window.location.href = href;
    }
  },
  replace(href) {
    // not sure how this is different than above?
    //return window.location.replace(href);
    this.redirectTo(href);
  },
  reload() {
    if(this.isFastBoot()) {
      const fastboot = get(this, 'fastboot');
      set(fastboot, 'response.headers.Refresh', 0);
    } else {
      return window.location.reload();
    }
  },
  host() {
    if(this.isFastBoot()) {
      const fastboot = get(this, 'fastboot');
      return get(fastboot, 'request.host');
    } else {
      return window.location.host;
    }
  },
  protocol() {
    if(this.isFastBoot()) {
      const fastboot = get(this, 'fastboot');
      const headers = get(fastboot, 'request.headers');
      const xForwardedProto = headers.get('X-Forwarded-Proto');

      // Use AWS X-Forwarded-Proto header if available, else use what fastboot has
      const protocol = isPresent(xForwardedProto) ? xForwardedProto
                                                  : get(fastboot, 'request.protocol');
      // Match protocol response from the browser
      return protocol.endsWith(':') ? protocol : `${protocol}:`;
    } else {
      return window.location.protocol;
    }
  },
  port() {
    if(this.isFastBoot()) {
      return "";
    } else {
      return window.location.port;
    }
  },
  hostWithProtocol() {
    return `${this.protocol()}//${this.host()}`;
  },
  origin() {
    return this.hostWithProtocol();
  },
  href() {
    if(this.isFastBoot()) {
      const hostWithProtocol = this.hostWithProtocol();
      const fastboot = get(this, 'fastboot');
      const path = get(fastboot, 'request.path');

      // Build the url. Note that path starts with a / already
      return hostWithProtocol + path;

    } else {
      return window.location.href;
    }
  },
  pathname() {
    if(this.isFastBoot()) {
      const fastboot = get(this, 'fastboot');
      const request = get(fastboot, 'request');
      const path = get(request, 'path');

      return path.split('?')[0];

    } else {
      return window.location.pathname;
    }
  },
  search() {
    if(this.isFastBoot()) {
      const fastboot = get(this, 'fastboot');
      const request = get(fastboot, 'request');
      const path = get(request, 'path');
      const search = path.split('?')[1];

      if(search) {
        return `?${search}`;
      } else {
        return "";
      }
    } else {
      return window.location.search;
    }
  },
  referrer() {
    if(this.isFastBoot()) {
      const fastboot = get(this, 'fastboot');
      const headers = get(fastboot, 'request.headers');

      return headers.get('Referer');
    } else {
      return window.location.referrer;
    }
  }
});
