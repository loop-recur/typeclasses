require("../support/functional");
require("../support/prelude");
require('../support/types');
require('../functor').expose();
require('../applicative');
require('../monad');
require('../support/built_ins')

runIO = function(io) {
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

UI = makeType('UI', {deriving: [Functor]});
ReadFile = newType(UI, 'ReadFile',{deriving: [Functor]}); 
OpenWin = newType(UI, 'OpenWin', {deriving: [Functor]});
RemoveView = newType(UI, 'RemoveView', {deriving: [Functor]});
AddView = newType(UI, 'AddView', {deriving: [Functor]});

IOTransformer = function(fn, type) {
	return function() {
		fn.apply(null, arguments); // side effect
		return type.apply(null, arguments);
	}.autoCurry(fn.arity)
}

Function.prototype.toIO = function(type) {
	return IOTransformer(this, type);
}


var openWin = function(name, w) {
	console.log('OPENED with', name, w);
}.autoCurry().toIO(OpenWin);

var readFile = function(filename) {
	console.log("READ FILE with", filename);
}.toIO(ReadFile);

var app = compose(fmap(compose(openWin('start'), reverse)), readFile);
prog = app("myFile.txt");
runIO(prog);
// var result = runIO(prog);
// console.log("result", result);

