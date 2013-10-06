Profunctor = function(type, defs) {
	type.prototype.dimap = defs.dimap;
}

dimap = function(a, b, functor) {
	return functor.dimap(a, b);
}.autoCurry();

// Some default instances:
Profunctor(Function, {
  dimap: function(g, h){
  	return compose(h, this, g);
  }
});
