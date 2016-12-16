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

      return protocol;
    } else {
      return window.location.protocol;
    }
  },
  port() {
    if(this.isFastBoot()) {
      return "";
    } else {
      return window.location.protocol;
    }
  },
  hostWithProtocol() {
    return `${this.protocol()}//${this.host()}`;
  },
  origin() {
    const port = this.port();
    if(port.length) {
      return `${this.hostWithProtocol()}:${port}`;
    } else {
      return this.hostWithProtocol();
    }
  },
  href() {
    if(this.isFastBoot()) {
      const request = get(this, 'fastboot.request');
      const host = get(request, 'host');
      const protocol = get(request, 'protocol');
      const path = get(request, 'path');

      return [protocol, host, path].join();

    } else {
      return window.location.href;
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
