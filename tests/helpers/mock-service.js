// tests/helpers/override-service.js
// Override a service with a mock/stub service.
// Based on https://github.com/ember-weekend/ember-weekend/blob/fb4a02353fbb033daefd258bbc032daf070d17bf/tests/helpers/module-for-acceptance.js#L14
// e.g. used at https://github.com/ember-weekend/ember-weekend/blob/fb4a02/tests/acceptance/keyboard-shortcuts-test.js#L13
//
// Parameters:
// - newService is the mock object / service stub that will be injected
// - serviceName is the object property being replaced,
//     e.g. if you set 'redirector' on a controller you would access it with
//     this.get('redirector')
export default function(app, serviceName, newService) {
  const instance = app.__deprecatedInstance__;
  const registry = instance.register ? instance : instance.registry;
  return registry.register(`service:${serviceName}`, newService);
}
