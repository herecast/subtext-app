// Silencing deprecations coming from addons that we have no control over
window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchId: "ember-application.injected-container" },
    { handler: "silence", matchId: "ember-legacy-views" },
    { handler: "silence", matchId: "ember-legacy-controllers" },
    { handler: "silence", matchId: "ember-metal.ember.keys" }
  ]
};
