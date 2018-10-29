import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import ObjectProxy from '@ember/object/proxy';

export default ObjectProxy.extend(PromiseProxyMixin);
