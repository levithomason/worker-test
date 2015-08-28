function test() {
  var times = 1000;

  var resultsElm = $('#results');
  var print = function(string) {
    resultsElm.append('<div>' + _(arguments).join(' ') + '</div>')
  };
  resultsElm.text('');

  print('Testing', times, 'neurons:');


//
// Series
//
  var neurons = _.times(times, function() {
    return new Neuron();
  });

  var neuronStart = Date.now();

  _.each(neurons, function(neuron, i) {
    neuron.activate(_.random(-1, 1, true));
  });

  print('DONE Neuron()', Date.now() - neuronStart + 'ms');


//
// Parallel
//
  var workers = _.times(times, function() {
    return new SharedWorker('WorkerNeuron.js')
  });

  var workerStart = Date.now();

  _.each(workers, function(worker, i) {
    var message = [{
      method: 'activate',
      arguments: [_.random(-1, 1, true)]
    }];

    // print('POST', message);
    worker.port.postMessage(message);

    // only add time log on last worker
    if (i === workers.length - 1) {
      worker.port.onmessage = function(e) {
        print('DONE WorkerNeuron()', Date.now() - workerStart + 'ms');
        print('-----------------------------');
      };
    }
  });
}

test();
