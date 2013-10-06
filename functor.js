;(function (window, global_module, global_exports, undefined) {
  var functor = {}

  //+ xmod :: Module
    , xmod = global_exports ? require('./support/xmod') : window.xmod

    , Functor = function(type, defs) {
        type.prototype.fmap = defs.fmap;
      }

    , fmap = function(f, obj) {
        return obj.fmap(f);
      }.autoCurry()
    ;

  functor.fmap = fmap;
  functor.Functor = Functor;

  Functor.generic = function(type) {
    Functor(type, {
      fmap: function(f) {
        return type(f(this.val));
      }
    });
  }

Functor(Either, {
  fmap: function(f) {
    if(falsy(this.right)) return this;
    return Either(this.left, f(this.right));
  }
});

  // Attach references to helper functions and then export the module
  functor.expose = function(){ xmod.expose(window, functor) };
  xmod.exportModule('functor', functor, global_module, global_exports);

}(this, (typeof module == 'object' && module), (typeof exports == 'object' && exports)));
