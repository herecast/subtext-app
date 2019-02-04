import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

const customEvents = {
  onpaste: 'onPaste',
  paste: 'paste'
};

const App = Application.extend({
  name: 'subtext-ui',
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,
  customEvents
});

loadInitializers(App, config.modulePrefix);

export default App;
