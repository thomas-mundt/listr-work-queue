const _ = require('lodash')
const Listr = require('listr')
const ListrWorkQueue = require('../lib/index')

const WORKER_COUNT = 5
const JOB_COUNT = 15
const JOB_MAX_DURATION = 1500

const jobs = _.times(JOB_COUNT, i => {
  const title = `0000${i}`.slice(-3)
  const delay = Math.ceil((Math.random() * JOB_MAX_DURATION) % JOB_MAX_DURATION)
  return {
    title: `Job ${title}`,
    task: () => new Promise(resolve => setTimeout(resolve, delay))
  }
})

const tasks = new Listr([{
  title: 'Running jobs',
  task: (ctx, task) => new ListrWorkQueue(jobs, {
    concurrent: WORKER_COUNT,
    exitOnError: false,
    update: (done, total) => {
      const progress = done === total ? '' : `(${done}/${total})`
      task.title = `Running jobs ${progress}`
    }
  })
}])

describe('Listr work queue', () => {
  it(`can process ${JOB_COUNT} jobs in parallel`, (done) => {
    tasks.run()
         .then(() => done())
         .catch(err => done(err))
  })
})
