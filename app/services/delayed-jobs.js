import Ember from 'ember';

const { get, run } = Ember;

export default Ember.Service.extend({
  //Service for maintaining singular Ember runLoops
  jobQueue: Ember.Object.create(),

  destroyJob: function(jobName) {
    let jobQueue = get(this, 'jobQueue');
    let job = jobQueue.get(jobName);

    run.cancel(job);
  },

  queueJob: function(jobName, job) {
    let jobQueue = get(this, 'jobQueue');

    if (jobQueue.get(jobName)) {
      this.destroyJob(jobName);
    }

    jobQueue.set(jobName, job);
  }
});
