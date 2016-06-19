# purgeable-listener

not in npm.

## sample

```
var PurgeableListener = require('purgeable-listener');

var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

for(var i = 0; i < 100; ++i){
    new Promise(function(resolve, reject){
        var purger = new PurgeableListener({autoPurge: true});
        function onData(data){}
        function onError(err){}
        function onFoo(err){}

        ee.on('error', purger.enpurgeable(onError, ee.removeListener.bind(ee, 'error')));
        ee.on('done', purger.enpurgeable(onData, ee.removeListener.bind(ee, 'done')));
        ee.on('foo', purger.enpurgeable(onData, ee.removeListener.bind(ee, 'foo')));
    });

    ee.emit(i%2 ? 'error' : 'done');
    // uncalled listeners are removed automatically!!
}
```

## API

### constructor(options)
#### member of `options`

- autoPurge: boolean
    - *Optional*.
    - When one of purgeabled listeners called, `PurgeableListener#purge` is called automatically.
- defaultRemover: Function
    - *Optional*.
    - If `defaultRemover` is given, you can omit `PurgeableListener#enpurgeable`'s second argument.

### enpurgeable(listener, remover?)

- `listener` is a base listener.
- `remover` is called when `PurgeableListener#purge` is called. 1st argument is `listener` object.
    - Omittable when `defaultRemover` is given.

### purge()

Purge listeners manually.

