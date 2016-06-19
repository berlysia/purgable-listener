'use strict';

function isFunction(arg) {
    return typeof arg === 'function';
}

function assert(cond, msg) {
    if(!cond) {
        throw new Error(msg);
    }
}

function wrapListener(_this, listener) {
    return function autoPurgeWrapped() {
        _this.purge();
        return listener.apply(null, arguments);
    }
}

function PurgeableListener(ctorOptions) {
    ctorOptions = ctorOptions || {};
    this.autoPurge = !!ctorOptions.autoPurge;
    this.defaultRemover = ctorOptions.defaultRemover || null;

    // paired by index
    this.listeners = [];
    this.removers = [];
}

PurgeableListener.prototype.enpurgeable = function enpurgeable(listener, remover) {
    assert(isFunction(listener), '1nd argument must be a function as listener');
    assert((remover == null && isFunction(this.defaultRemover)) || isFunction(remover), '2nd argument must be a function as remover');
    this.removers.push(remover);

    if(this.autoPurge) {
        listener = wrapListener(this, listener);
    }

    this.listeners.push(listener);

    return listener;
};

PurgeableListener.prototype.purge = function purge() {
    for(var i = this.listeners.length - 1; 0 <= i; --i) {
        if(isFunction(this.removers[i])) {
            this.removers[i].call(null, this.listeners[i]);
        }
    }

    this.removers = [];
    this.listeners = [];
}
