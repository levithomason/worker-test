onconnect = function(e) {
  var activationFn = function tanh(x) {
    var negExp = Math.exp(-x);
    var posExp = Math.exp(x);
    return (posExp - negExp) / (posExp + negExp);
  };

  var activate = function activate(input) {
    if (this.isBias) {
      this.output = 1;
      return this.output;
    }

    // set the input
    if (!typeof input === 'undefined') {
      this.input = input;
    } else {
      var connection;
      this.input = 0;
      for (var i = 0; i < this.incoming.length; i += 1) {
        connection = this.incoming[i];
        // we don't need to add the bias neuron manually here.
        // since the bias Neuron is connected like all other Neurons and it's
        // output is always 1, the weight will be added by bias.output * weight.
        this.input += connection.source.output * connection.weight;
      }
    }

    // set the output
    // do not squash input Neurons values, pass them straight through
    this.output = isInput() ? this.input : activationFn(this.input);

    return this.output;
  };

  /**
   * Determine if this Neuron is an input Neuron.
   * @returns {boolean}
   */
  var isInput = function() {
    return !this.isBias && this.incoming.length === 0;
  };

  //
  // Worker Setup
  //
  var port = e.ports[0];

  port.onmessage = function(e) {
    var message = e.data[0];
    var result = activate.apply(neuron, message.arguments);
    port.postMessage({
      result: result
    });
  }

};
