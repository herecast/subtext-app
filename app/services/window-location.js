import Ember from 'ember';

const { get, set, inject } = Ember;

export default Ember.Service.extend({
  fastboot: inject.service(),
  isFastBoot() {
    return get(this, 'fastboot.isFastBoot');
  },
  redirectTo(href) {
    if(this.isFastBoot()) {
      set(this, 'fastboot.response.statusCode', 307);
      set(this, 'fastboot.response.headers.Location', href);
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
      set(this, 'fastboot.response.headers.Refresh', 0);
    } else {
      return window.location.reload();
    }
  },
  host() {
    if(this.isFastBoot()) {
      const request = get(this, 'fastboot.request');
      const host = get(request, 'host');

      return host;
    } else {
      return window.location.host;
    }
  },
  protocol() {
    if(this.isFastBoot()) {
      const request = get(this, 'fastboot.request');
      const protocol = get(request, 'protocol');

      // Match protocol response from the browser
      return `${protocol}:`;
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
      const request = get(this, 'fastboot.request');
      const host = get(request, 'host');
      const protocol = get(request, 'protocol');
      const path = get(request, 'path');

      // Build the url. Note that path starts with a / already
      return `${protocol}://${host}${path}`;

    } else {
      return window.location.href;
    }
  },
  pathname() {
    if(this.isFastBoot()) {
      const request = get(this, 'fastboot.request');
      const path = get(request, 'path');

      return path.split('?')[0];

    } else {
      return window.location.pathname;
    }
  },
  search() {
    if(this.isFastBoot()) {
      const request = get(this, 'fastboot.request');
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
      const headers = get(this, 'fastboot.request.headers');

      return get(headers, 'Referer');
    } else {
      return window.location.referrer;
    }
  }
});
