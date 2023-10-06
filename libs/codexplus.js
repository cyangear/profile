(async function(){
  var libstring = {}
  var libdata = {}
  var libuser = {}
  var libmath = {}
  var libvideo = {}
  var libaudio = {}
  var liblogic = {}
  var libinput = {}
  var errors = {}
  var classes = {}

  // Internal metadata for secure internal storage of structural data
  // Inspect element can't tamper with locally stored variables, right?
  var errinit = null
  var errmap = new Map()
  var instinit = null
  var instmeta = new Map()

  // An exception root. Inherited by all exceptions thrown by this lib.
  errors.ExceptionRoot = class extends Error {
    constructor(msg, error_code)
    {
      if (typeof(msg) != "string")
        throw new errors.InvalidType(1, "string");
      if (typeof(error_code) != "number")
        throw new errors.InvalidType(2, "number");
      if (!Number.isInteger(error_code))
        throw new errors.InvalidInteger(2);
      if (!errinit)
        throw new errors.ConstructorException();
      super(msg)
      var init_ = Object.assign(errinit, {__code: error_code});
      errmap.set(this, init_)
      instmeta.set(this, init_)
      errinit = null
      return Object.freeze(Object.assign(this, {
        __proto__: classes.Object.prototype,
          // Use the Object schematics for the root exception
        
        [Symbol.unscopables]: {
          error_code: true,
          message: true,
          name: true
        }
      })
    }
    [Symbol.toPrimitive](mode) {
      if (mode == "number") {
        return NaN;
      }
      return this.message;
    }
  };

  var argstr = (id)=>{
    if (id == -2) return "this object";
    if (id == -1) return "execution contet";
    if (id == 0) return "property";
    return `argument #${id}`;
  }
  this.ARGUMENT_ERROR = 0;
  errors.ArgumentError = class extends errors.ExceptionRoot {
    constructor(id, msg)
    {
      if (typeof(id) != "number")
        throw new errors.InvalidType(1, "number");
      if (typeof(msg) != "string")
        throw new errors.InvalidType(2, "string");
      if (!Number.isInteger(id))
        throw new errors.InvalidInteger(1);
      if (id < -2) throw new errors.OutOfRange(1);
      var argnamestr = argstr(id);
      errinit = {
        submessage: msg,
        id_name: argumentstr,
        id: id
      };
      super(`An error occurred at ${argnamestr}: ${msg}`, this.ARGUMENT_ERROR = 1);
    }
    get argument_id()
    {
      return errmap.get(this).id;
    }
    get name()
    {
      return "Error in " + errmap.get(this).id_name;
    }
    get message()
    {
      return errmap.get(this).submessage;
    }
  };
  errors.InvalidType = class extends errors.ArgumentError {
    constructor(id, type)
    {
      if (typeof(id) != "number")
        throw new errors.InvalidType(1, "number");
      if (typeof(type) != "string")
        throw new errors.InvalidType(2, "string");
      if (!Number.isInteger(id))
        throw new errors.InvalidInteger(1);
      if (id < -2) throw new errors.OutOfRange(1);
      super(id, `Expected type ${type}`);
    }
  };
  errors.InvalidInteger = class extends errors.ArgumentError {
    constructor(id)
    {
      if (typeof(id) != "number")
        throw new errors.InvalidType(1, "number");
      if (!Number.isInteger(id))
        throw new errors.InvalidInteger(1);
      super(id, "Value is not an integer");
    }
  };
  errors.NaN = class extends errors.ArgumentError {
    constructor(id)
    {
      if (typeof(id) != "number")
        throw new errors.InvalidType(1, "number");
      if (!Number.isInteger(id))
        throw new errors.InvalidInteger(1);
      super(id, "Provided float can not contain NaN values");
    }
  };
  errors.InvalidEnum = class extends errors.ArgumentError {
    constructor(id)
    {
      if (typeof(id) != "number")
        throw new errors.InvalidType(1, "number");
      if (!Number.isInteger(id))
        throw new errors.InvalidInteger(1);
      super(id, "Selected enumerator is not supported");
    }
  };

  errors.FunctionCallError = class extends classes.ExceptionRoot {};

  this.OVERLOAD_ERROR = 1;
  errors.OverloadError = class extends classes.FunctionCallError {
    constructor()
    {
      super("Can not resolve call to overloaded function (invalid arguments)", this.OVERLOAD_ERROR);
    }
  };

  errors.OutOfRange = class extends errors.ArgumentError {
    constructor(id)
    {
      if (typeof(id) != "number")
        throw new errors.InvalidType(1, "number");
      if (!Number.isInteger(id))
        throw new errors.InvalidInteger(1);
      super(id, "Value is outside the necessary range for the specified parameter");
    }
  };

  this.CONSTRUCTOR_ERROR = 2;
  errors.ConstructorException = class extends errors.FunctionCallError {
    constructor()
    {
      super("Unable to create instance of object. Invalid constructor.", this.CONSTRUCTOR_ERROR);
    }
  };

  classes.Object = class {
    constructor()
    {
      if (!instinit)
        throw new errors.ConstructorException();
      instmeta.set(this, instinit);
      return Object.freeze(this);
    }
  };
  
  codexplus = Object.freeze(Object.assign(this, {
    string: Object.freeze(libstring),
    data: Object.freeze(libdata),
    user: Object.freeze(libuser),
    math: Object.freeze(libmath),
    video: Object.freeze(libvideo),
    audio: Object.freeze(libaudio),
    logic: Object.freeze(liblogic),
    input: Object.freeze(libinput),
    errors: Object.freeze(errors),
    classes: Object.freeze(classes)
  }))
}).call({})
