// require("./prelude");

_getGlobal = function() {
  return (typeof global == 'object') ? global : this;
}

_superInspect = function(name) {
  return function(){
    var copy = {};
    for(v in this) {
      if(this.hasOwnProperty(v)) {
        copy[v] = (this[v].inspect ? this[v].inspect() : this[v]);        
      }
    }
    return name+"(" + JSON.stringify(copy.val) + ")";
  }
}

Constructor = function(f) {
  var x = function(val){
    if(!(this instanceof x)){
      var inst = new x();
      f.apply(inst, arguments);
      return inst;
    }
    f.apply(this, arguments);
  };
  return x;
}

makeType = function(name, options) {
  f = function(v){ this.val = v; }
  var type = Constructor(f);
  if(options && options.deriving) {
    options.deriving.map(function(typeclass){
      typeclass.generic(type)
    });
  }
  
  type.prototype.inspect = _superInspect(name);
  return type;
}


newType = function(superclass, name, options) {
  var constructr = superclass;
  var x = makeType();

  x.prototype = new constructr();
  x.prototype.constructor=constructr; 
  x.prototype.valueOf = function() { return this.val; }
  x.prototype.toString = function() { return this.val.toString(); }
  x.prototype.inspect = _superInspect(name);

  if(options && options.deriving) {
    options.deriving.map(function(typeclass){
      typeclass.generic(x)
    });
  }

  var globl = _getGlobal();
  globl[name] = x;
  return x;
}
