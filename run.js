
/**
 * Limit the number of queries per second by spawning an async runner for each query.
 * 
 * defaults to  5 calls per second, or 300 calls/minute, 1 call every 200ms
 * @param {array} queries 
 * @param {function} func
 * @returns waits for all runners to settle then returns an `array` of results 
 * @todo could make it faster by removing allSettled and return results as promises are resolved
 */
 function run(queries, func) {
    const timeout = 200
    let current_timeout = 0
    let settled = Promise.allSettled(queries.map(query => {
        let new_timeout = current_timeout + timeout
        let runner = new Promise(resolve => setTimeout(async () => resolve(await func(query)), new_timeout))
        current_timeout = new_timeout
        return runner
    }))
    return settled.then(dones => dones.map(done => done.value))
}


// run([1, 2, 3, 4, 5], query => new Promise(resolve => { console.log(query); resolve(query) })).then(console.log)
module.exports = { run }