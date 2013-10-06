require("../support/functional");
require("../support/prelude");
require('../support/types');
require('../functor').expose();
require('../applicative');
require('../monad');


runIO = function(io) {
	log2("Run io!!!", io)
	var result = io.runIO();
	return (result && result.runIO) ? runIO(result) : result;
}

IO = Constructor(function(val, sideEffect) {
	self = this;
	self.val = val;
	self.sideEffect = sideEffect;
	self.runIO = function() {
		return sideEffect(self.val);
	}
});

Functor(IO, {
	fmap: function(f) {
		return IO(this.val, compose(f, this.sideEffect))
	}
})


var openWin = function(w) {
	console.log("openWin", w);
	var se = function(x){ console.log('opening win with', x); return "OPENED!"; }
	return IO(w, se);
}

var readFile = function(filename) {
	console.log("read file called", filename);
	var se = function(x){ console.log('reading file with', x); return "file_contents"; }
	return IO(filename, se);
}

var app = compose(fmap(compose(openWin, reverse)), readFile);
prog = app("myFile.txt");
// { val: 'myFile.txt', sideEffect: [Function], runIO: [Function] }
console.log("prog", prog);
var result = runIO(prog);
console.log("result", result);

