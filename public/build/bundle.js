
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const ToDoItems = writable([]);

    const ActiveItems = writable([]);

    const CompletedItems = writable([]);

    class Helper {
        updateActive = (todo) => {
            ActiveItems.update(_currentItem => {
                let allActive = todo.filter(item => item.completed === false);
                return allActive
            });
        }
        
        clearCompleted = (completed) => {
            let ids = [];
            completed.forEach(item => {
                ids.push(item.id);
            });

            ids.forEach(id=> {
                ToDoItems.update((currentItem)=> {
                    return currentItem.filter(item => item.id != id)
                });
                CompletedItems.update((currentItem)=> {
                    return currentItem.filter(item => item.id != id)
                });
            });

        }
    }

    /* src/components/Header.svelte generated by Svelte v3.49.0 */
    const file$4 = "src/components/Header.svelte";

    function create_fragment$4(ctx) {
    	let header;
    	let div3;
    	let div0;
    	let h1;
    	let t1;
    	let button;
    	let t2;
    	let div2;
    	let form;
    	let div1;
    	let t3;
    	let input;
    	let header_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div3 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "T O D O";
    			t1 = space();
    			button = element("button");
    			t2 = space();
    			div2 = element("div");
    			form = element("form");
    			div1 = element("div");
    			t3 = space();
    			input = element("input");
    			add_location(h1, file$4, 40, 12, 1136);

    			set_style(button, "background", /*isLightMode*/ ctx[1]
    			? "url('/assets/images/icon-moon.svg')"
    			: "url('/assets/images/icon-sun.svg')");

    			attr_dev(button, "id", "switchBtn");
    			add_location(button, file$4, 42, 12, 1178);
    			attr_dev(div0, "class", "title-and-switch svelte-15s8c1e");
    			add_location(div0, file$4, 39, 8, 1093);
    			attr_dev(div1, "class", "circle");
    			add_location(div1, file$4, 50, 16, 1587);
    			set_style(input, "color", /*isLightMode*/ ctx[1] ? "rgba(0,0,0,0.7)" : "#fff");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "");
    			attr_dev(input, "placeholder", "Create a new todo...");
    			attr_dev(input, "class", "svelte-15s8c1e");
    			add_location(input, file$4, 51, 16, 1630);
    			attr_dev(form, "id", "form");
    			add_location(form, file$4, 49, 12, 1522);
    			set_style(div2, "background", /*isLightMode*/ ctx[1] ? "#fff" : "#25273C");
    			attr_dev(div2, "class", "todoinput svelte-15s8c1e");
    			add_location(div2, file$4, 48, 8, 1434);
    			attr_dev(div3, "class", "toolbar svelte-15s8c1e");
    			add_location(div3, file$4, 37, 4, 1062);
    			attr_dev(header, "class", header_class_value = "" + (null_to_empty(/*isLightMode*/ ctx[1] ? "lightmode" : "dark") + " svelte-15s8c1e"));
    			add_location(header, file$4, 35, 0, 1005);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, button);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, form);
    			append_dev(form, div1);
    			append_dev(form, t3);
    			append_dev(form, input);
    			set_input_value(input, /*todo*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(form, "submit", prevent_default(/*call*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isLightMode*/ 2) {
    				set_style(button, "background", /*isLightMode*/ ctx[1]
    				? "url('/assets/images/icon-moon.svg')"
    				: "url('/assets/images/icon-sun.svg')");
    			}

    			if (dirty & /*isLightMode*/ 2) {
    				set_style(input, "color", /*isLightMode*/ ctx[1] ? "rgba(0,0,0,0.7)" : "#fff");
    			}

    			if (dirty & /*todo*/ 1 && input.value !== /*todo*/ ctx[0]) {
    				set_input_value(input, /*todo*/ ctx[0]);
    			}

    			if (dirty & /*isLightMode*/ 2) {
    				set_style(div2, "background", /*isLightMode*/ ctx[1] ? "#fff" : "#25273C");
    			}

    			if (dirty & /*isLightMode*/ 2 && header_class_value !== (header_class_value = "" + (null_to_empty(/*isLightMode*/ ctx[1] ? "lightmode" : "dark") + " svelte-15s8c1e"))) {
    				attr_dev(header, "class", header_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $ToDoItems;
    	validate_store(ToDoItems, 'ToDoItems');
    	component_subscribe($$self, ToDoItems, $$value => $$invalidate(6, $ToDoItems = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let helper = new Helper();
    	let todo = "";
    	let isLightMode = false;
    	const dispatch = createEventDispatcher();

    	const toggleLightMode = () => {
    		$$invalidate(1, isLightMode = !isLightMode);
    		localStorage.setItem("lightmode", isLightMode ? "light" : null);
    		document.body.style.background = isLightMode ? "#fff" : "#151521";
    		dispatch('switch-LightMode', isLightMode);
    	};

    	const call = () => {
    		ToDoItems.update(currentItem => {
    			return [
    				{
    					id: $ToDoItems.length + 1,
    					date: new Date(),
    					text: todo,
    					completed: false
    				},
    				...currentItem
    			];
    		});

    		helper.updateActive($ToDoItems);
    		$$invalidate(0, todo = "");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => toggleLightMode();

    	function input_input_handler() {
    		todo = this.value;
    		$$invalidate(0, todo);
    	}

    	$$self.$capture_state = () => ({
    		ToDoItems,
    		createEventDispatcher,
    		Helper,
    		helper,
    		todo,
    		isLightMode,
    		dispatch,
    		toggleLightMode,
    		call,
    		$ToDoItems
    	});

    	$$self.$inject_state = $$props => {
    		if ('helper' in $$props) helper = $$props.helper;
    		if ('todo' in $$props) $$invalidate(0, todo = $$props.todo);
    		if ('isLightMode' in $$props) $$invalidate(1, isLightMode = $$props.isLightMode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [todo, isLightMode, toggleLightMode, call, click_handler, input_input_handler];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/maincontent.svelte generated by Svelte v3.49.0 */

    const file$3 = "src/components/maincontent.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "main-content svelte-18j6gaj");
    			attr_dev(div, "id", "main-content");
    			add_location(div, file$3, 4, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Maincontent', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Maincontent> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Maincontent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Maincontent",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /* src/components/listitem.svelte generated by Svelte v3.49.0 */
    const file$2 = "src/components/listitem.svelte";

    function create_fragment$2(ctx) {
    	let li;
    	let div0;
    	let div0_class_value;
    	let t0;
    	let input_1;
    	let input_1_class_value;
    	let t1;
    	let div1;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div0 = element("div");
    			t0 = space();
    			input_1 = element("input");
    			t1 = space();
    			div1 = element("div");
    			img = element("img");
    			attr_dev(div0, "class", div0_class_value = "circle " + (/*comp*/ ctx[0] ? "checked" : null) + " svelte-1qd3x1j");
    			add_location(div0, file$2, 81, 8, 2399);
    			set_style(input_1, "color", /*setlight*/ ctx[2] ? "rgba(0,0,0,0.7)" : "#fff");
    			attr_dev(input_1, "class", input_1_class_value = "" + (/*comp*/ ctx[0] ? "strike" : null) + " svelte-1qd3x1j");
    			input_1.readOnly = true;
    			input_1.value = /*text*/ ctx[1];
    			add_location(input_1, file$2, 82, 8, 2508);
    			if (!src_url_equal(img.src, img_src_value = "assets/images/icon-cross.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$2, 83, 13, 2654);
    			add_location(div1, file$2, 83, 8, 2649);
    			attr_dev(li, "class", "todo-item");
    			attr_dev(li, "data-ischecked", /*isChecked*/ ctx[6]);
    			attr_dev(li, "draggable", "true");
    			add_location(li, file$2, 80, 4, 2307);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div0);
    			/*div0_binding*/ ctx[11](div0);
    			append_dev(li, t0);
    			append_dev(li, input_1);
    			/*input_1_binding*/ ctx[13](input_1);
    			append_dev(li, t1);
    			append_dev(li, div1);
    			append_dev(div1, img);
    			/*li_binding*/ ctx[15](li);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(img, "click", /*click_handler_1*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*comp*/ 1 && div0_class_value !== (div0_class_value = "circle " + (/*comp*/ ctx[0] ? "checked" : null) + " svelte-1qd3x1j")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*setlight*/ 4) {
    				set_style(input_1, "color", /*setlight*/ ctx[2] ? "rgba(0,0,0,0.7)" : "#fff");
    			}

    			if (dirty & /*comp*/ 1 && input_1_class_value !== (input_1_class_value = "" + (/*comp*/ ctx[0] ? "strike" : null) + " svelte-1qd3x1j")) {
    				attr_dev(input_1, "class", input_1_class_value);
    			}

    			if (dirty & /*text*/ 2 && input_1.value !== /*text*/ ctx[1]) {
    				prop_dev(input_1, "value", /*text*/ ctx[1]);
    			}

    			if (dirty & /*isChecked*/ 64) {
    				attr_dev(li, "data-ischecked", /*isChecked*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			/*div0_binding*/ ctx[11](null);
    			/*input_1_binding*/ ctx[13](null);
    			/*li_binding*/ ctx[15](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let isChecked;
    	let $ToDoItems;
    	validate_store(ToDoItems, 'ToDoItems');
    	component_subscribe($$self, ToDoItems, $$value => $$invalidate(16, $ToDoItems = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Listitem', slots, []);
    	let { text } = $$props;
    	let { itemID } = $$props;
    	let { comp = false } = $$props;
    	let currToDo = $ToDoItems.filter(item => item.id === itemID);
    	let circle;
    	let list;
    	let input;
    	let helper = new Helper();

    	const markComplete = () => {
    		$$invalidate(6, isChecked = !isChecked);

    		if (isChecked) {
    			circle.classList.add("checked");
    			input.classList.add('strike');
    			$$invalidate(0, comp = true);
    			$$invalidate(10, currToDo[0].completed = true, currToDo);

    			ToDoItems.update(currentItem => {
    				let updatedItems = currentItem;
    				return updatedItems;
    			});

    			CompletedItems.update(currentItem => {
    				return [
    					{
    						id: itemID,
    						item: list,
    						text,
    						completed: false
    					},
    					...currentItem
    				];
    			});

    			ActiveItems.update(_currentItem => {
    				let allActive = $ToDoItems.filter(item => item.completed === false);
    				return allActive;
    			});

    			helper.updateActive($ToDoItems);
    		} else {
    			circle.classList.remove("checked");
    			input.classList.remove('strike');
    			$$invalidate(0, comp = false);

    			CompletedItems.update(currentItem => {
    				return currentItem.filter(item => item.id != itemID);
    			});

    			$$invalidate(10, currToDo[0].completed = false, currToDo);

    			ActiveItems.update(currentItem => {
    				return [
    					{
    						id: itemID,
    						date: new Date(),
    						text,
    						completed: false
    					},
    					...currentItem
    				];
    			});
    		}
    	};

    	const deleteItem = () => {
    		ToDoItems.update(currentItem => {
    			return currentItem.filter(item => item.id != itemID);
    		});
    	};

    	let { setlight } = $$props;
    	const writable_props = ['text', 'itemID', 'comp', 'setlight'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Listitem> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			circle = $$value;
    			$$invalidate(3, circle);
    		});
    	}

    	const click_handler = () => markComplete();

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(5, input);
    		});
    	}

    	const click_handler_1 = () => deleteItem();

    	function li_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			list = $$value;
    			$$invalidate(4, list);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('itemID' in $$props) $$invalidate(9, itemID = $$props.itemID);
    		if ('comp' in $$props) $$invalidate(0, comp = $$props.comp);
    		if ('setlight' in $$props) $$invalidate(2, setlight = $$props.setlight);
    	};

    	$$self.$capture_state = () => ({
    		ToDoItems,
    		CompletedItems,
    		ActiveItems,
    		Helper,
    		text,
    		itemID,
    		comp,
    		currToDo,
    		circle,
    		list,
    		input,
    		helper,
    		markComplete,
    		deleteItem,
    		setlight,
    		isChecked,
    		$ToDoItems
    	});

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('itemID' in $$props) $$invalidate(9, itemID = $$props.itemID);
    		if ('comp' in $$props) $$invalidate(0, comp = $$props.comp);
    		if ('currToDo' in $$props) $$invalidate(10, currToDo = $$props.currToDo);
    		if ('circle' in $$props) $$invalidate(3, circle = $$props.circle);
    		if ('list' in $$props) $$invalidate(4, list = $$props.list);
    		if ('input' in $$props) $$invalidate(5, input = $$props.input);
    		if ('helper' in $$props) helper = $$props.helper;
    		if ('setlight' in $$props) $$invalidate(2, setlight = $$props.setlight);
    		if ('isChecked' in $$props) $$invalidate(6, isChecked = $$props.isChecked);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*currToDo*/ 1024) {
    			$$invalidate(6, isChecked = currToDo[0]?.completed ?? false);
    		}
    	};

    	return [
    		comp,
    		text,
    		setlight,
    		circle,
    		list,
    		input,
    		isChecked,
    		markComplete,
    		deleteItem,
    		itemID,
    		currToDo,
    		div0_binding,
    		click_handler,
    		input_1_binding,
    		click_handler_1,
    		li_binding
    	];
    }

    class Listitem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { text: 1, itemID: 9, comp: 0, setlight: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Listitem",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[1] === undefined && !('text' in props)) {
    			console.warn("<Listitem> was created without expected prop 'text'");
    		}

    		if (/*itemID*/ ctx[9] === undefined && !('itemID' in props)) {
    			console.warn("<Listitem> was created without expected prop 'itemID'");
    		}

    		if (/*setlight*/ ctx[2] === undefined && !('setlight' in props)) {
    			console.warn("<Listitem> was created without expected prop 'setlight'");
    		}
    	}

    	get text() {
    		throw new Error("<Listitem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Listitem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemID() {
    		throw new Error("<Listitem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemID(value) {
    		throw new Error("<Listitem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get comp() {
    		throw new Error("<Listitem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set comp(value) {
    		throw new Error("<Listitem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setlight() {
    		throw new Error("<Listitem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setlight(value) {
    		throw new Error("<Listitem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Todocontainer.svelte generated by Svelte v3.49.0 */
    const file$1 = "src/components/Todocontainer.svelte";

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    // (48:68) 
    function create_if_block_5(ctx) {
    	let div;
    	let center;
    	let t;
    	let center_class_value;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			center = element("center");
    			t = text("You have no completed to-dos");
    			attr_dev(center, "class", center_class_value = "" + (null_to_empty(/*setlight*/ ctx[0] ? "light" : null) + " svelte-hvxbv9"));
    			add_location(center, file$1, 49, 16, 1667);
    			add_location(div, file$1, 48, 12, 1637);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, center);
    			append_dev(center, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*setlight*/ 1 && center_class_value !== (center_class_value = "" + (null_to_empty(/*setlight*/ ctx[0] ? "light" : null) + " svelte-hvxbv9"))) {
    				attr_dev(center, "class", center_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, {});
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(48:68) ",
    		ctx
    	});

    	return block;
    }

    // (44:62) 
    function create_if_block_4(ctx) {
    	let div;
    	let center;
    	let t;
    	let center_class_value;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			center = element("center");
    			t = text("You have no active items in your to-do");
    			attr_dev(center, "class", center_class_value = "" + (null_to_empty(/*setlight*/ ctx[0] ? "light" : null) + " svelte-hvxbv9"));
    			add_location(center, file$1, 45, 16, 1446);
    			add_location(div, file$1, 44, 12, 1416);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, center);
    			append_dev(center, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*setlight*/ 1 && center_class_value !== (center_class_value = "" + (null_to_empty(/*setlight*/ ctx[0] ? "light" : null) + " svelte-hvxbv9"))) {
    				attr_dev(center, "class", center_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, {});
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(44:62) ",
    		ctx
    	});

    	return block;
    }

    // (40:8) {#if $ToDoItems.length===0 && didGetAll}
    function create_if_block_3(ctx) {
    	let div;
    	let center;
    	let t;
    	let center_class_value;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			center = element("center");
    			t = text("You have no items in your to-do");
    			attr_dev(center, "class", center_class_value = "" + (null_to_empty(/*setlight*/ ctx[0] ? "light" : null) + " svelte-hvxbv9"));
    			add_location(center, file$1, 41, 16, 1238);
    			add_location(div, file$1, 40, 12, 1208);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, center);
    			append_dev(center, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*setlight*/ 1 && center_class_value !== (center_class_value = "" + (null_to_empty(/*setlight*/ ctx[0] ? "light" : null) + " svelte-hvxbv9"))) {
    				attr_dev(center, "class", center_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, {});
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(40:8) {#if $ToDoItems.length===0 && didGetAll}",
    		ctx
    	});

    	return block;
    }

    // (69:34) 
    function create_if_block_2(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value_2 = /*$CompletedItems*/ ctx[6];
    	validate_each_argument(each_value_2);
    	const get_key = ctx => /*comp*/ ctx[26].id;
    	validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*setlight, $CompletedItems*/ 65) {
    				each_value_2 = /*$CompletedItems*/ ctx[6];
    				validate_each_argument(each_value_2);
    				group_outros();
    				validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block_2, each_1_anchor, get_each_context_2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(69:34) ",
    		ctx
    	});

    	return block;
    }

    // (62:31) 
    function create_if_block_1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*$ActiveItems*/ ctx[1];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*active*/ ctx[23].id;
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*setlight, $ActiveItems*/ 3) {
    				each_value_1 = /*$ActiveItems*/ ctx[1];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block_1, each_1_anchor, get_each_context_1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(62:31) ",
    		ctx
    	});

    	return block;
    }

    // (55:8) {#if didGetAll}
    function create_if_block(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*$ToDoItems*/ ctx[7];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*todo*/ ctx[20].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*setlight, $ToDoItems*/ 129) {
    				each_value = /*$ToDoItems*/ ctx[7];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(55:8) {#if didGetAll}",
    		ctx
    	});

    	return block;
    }

    // (70:12) {#each $CompletedItems as comp (comp.id)}
    function create_each_block_2(key_1, ctx) {
    	let div;
    	let listitem;
    	let t;
    	let div_intro;
    	let div_outro;
    	let current;

    	listitem = new Listitem({
    			props: {
    				setlight: /*setlight*/ ctx[0],
    				comp: true,
    				itemID: /*comp*/ ctx[26].id,
    				text: /*comp*/ ctx[26].text
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(listitem.$$.fragment);
    			t = space();
    			add_location(div, file$1, 70, 16, 2420);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(listitem, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const listitem_changes = {};
    			if (dirty & /*setlight*/ 1) listitem_changes.setlight = /*setlight*/ ctx[0];
    			if (dirty & /*$CompletedItems*/ 64) listitem_changes.itemID = /*comp*/ ctx[26].id;
    			if (dirty & /*$CompletedItems*/ 64) listitem_changes.text = /*comp*/ ctx[26].text;
    			listitem.$set(listitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listitem.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, scale, {});
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listitem.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, slide, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(listitem);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(70:12) {#each $CompletedItems as comp (comp.id)}",
    		ctx
    	});

    	return block;
    }

    // (63:12) {#each ($ActiveItems) as active (active.id)}
    function create_each_block_1(key_1, ctx) {
    	let div;
    	let listitem;
    	let t;
    	let div_intro;
    	let div_outro;
    	let current;

    	listitem = new Listitem({
    			props: {
    				setlight: /*setlight*/ ctx[0],
    				comp: false,
    				itemID: /*active*/ ctx[23].id,
    				text: /*active*/ ctx[23].text
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(listitem.$$.fragment);
    			t = space();
    			add_location(div, file$1, 63, 16, 2150);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(listitem, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const listitem_changes = {};
    			if (dirty & /*setlight*/ 1) listitem_changes.setlight = /*setlight*/ ctx[0];
    			if (dirty & /*$ActiveItems*/ 2) listitem_changes.itemID = /*active*/ ctx[23].id;
    			if (dirty & /*$ActiveItems*/ 2) listitem_changes.text = /*active*/ ctx[23].text;
    			listitem.$set(listitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listitem.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, scale, {});
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listitem.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, slide, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(listitem);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(63:12) {#each ($ActiveItems) as active (active.id)}",
    		ctx
    	});

    	return block;
    }

    // (56:12) {#each $ToDoItems as todo (todo.id)}
    function create_each_block(key_1, ctx) {
    	let div;
    	let listitem;
    	let t;
    	let div_intro;
    	let div_outro;
    	let current;

    	listitem = new Listitem({
    			props: {
    				setlight: /*setlight*/ ctx[0],
    				comp: /*todo*/ ctx[20].completed,
    				itemID: /*todo*/ ctx[20].id,
    				text: /*todo*/ ctx[20].text
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(listitem.$$.fragment);
    			t = space();
    			add_location(div, file$1, 56, 16, 1872);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(listitem, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const listitem_changes = {};
    			if (dirty & /*setlight*/ 1) listitem_changes.setlight = /*setlight*/ ctx[0];
    			if (dirty & /*$ToDoItems*/ 128) listitem_changes.comp = /*todo*/ ctx[20].completed;
    			if (dirty & /*$ToDoItems*/ 128) listitem_changes.itemID = /*todo*/ ctx[20].id;
    			if (dirty & /*$ToDoItems*/ 128) listitem_changes.text = /*todo*/ ctx[20].text;
    			listitem.$set(listitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listitem.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, scale, {});
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listitem.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, slide, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(listitem);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(56:12) {#each $ToDoItems as todo (todo.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let ul;
    	let t0;
    	let current_block_type_index;
    	let if_block1;
    	let t1;
    	let div1;
    	let span1;
    	let span0;
    	let t2;
    	let t3;
    	let div0;
    	let button0;
    	let t4;
    	let button0_class_value;
    	let t5;
    	let button1;
    	let t6;
    	let button1_class_value;
    	let t7;
    	let button2;
    	let t8;
    	let button2_class_value;
    	let t9;
    	let button3;
    	let t11;
    	let div3;
    	let div2;
    	let button4;
    	let t12;
    	let button4_class_value;
    	let t13;
    	let button5;
    	let t14;
    	let button5_class_value;
    	let t15;
    	let button6;
    	let t16;
    	let button6_class_value;
    	let t17;
    	let br0;
    	let br1;
    	let br2;
    	let t18;
    	let h4;
    	let t19;
    	let h4_class_value;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*$ToDoItems*/ ctx[7].length === 0 && /*didGetAll*/ ctx[3]) return create_if_block_3;
    		if (/*didGetActive*/ ctx[2] && /*$ActiveItems*/ ctx[1].length === 0) return create_if_block_4;
    		if (/*didGetCompleted*/ ctx[4] && /*$CompletedItems*/ ctx[6].length === 0) return create_if_block_5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type && current_block_type(ctx);
    	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*didGetAll*/ ctx[3]) return 0;
    		if (/*didGetActive*/ ctx[2]) return 1;
    		if (/*didGetCompleted*/ ctx[4]) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx))) {
    		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div1 = element("div");
    			span1 = element("span");
    			span0 = element("span");
    			t2 = text(/*currItems*/ ctx[5]);
    			t3 = space();
    			div0 = element("div");
    			button0 = element("button");
    			t4 = text("All");
    			t5 = space();
    			button1 = element("button");
    			t6 = text("Active");
    			t7 = space();
    			button2 = element("button");
    			t8 = text("Completed");
    			t9 = space();
    			button3 = element("button");
    			button3.textContent = "Clear Completed";
    			t11 = space();
    			div3 = element("div");
    			div2 = element("div");
    			button4 = element("button");
    			t12 = text("All");
    			t13 = space();
    			button5 = element("button");
    			t14 = text("Active");
    			t15 = space();
    			button6 = element("button");
    			t16 = text("Completed");
    			t17 = space();
    			br0 = element("br");
    			br1 = element("br");
    			br2 = element("br");
    			t18 = space();
    			h4 = element("h4");
    			t19 = text("Drag and drop to reorder list");
    			attr_dev(span0, "id", "itemCount");
    			add_location(span0, file$1, 78, 18, 2666);
    			add_location(span1, file$1, 78, 12, 2660);
    			attr_dev(button0, "class", button0_class_value = "toggle " + (/*didGetAll*/ ctx[3] ? "active" : null));
    			attr_dev(button0, "data-id", "todo-all");
    			attr_dev(button0, "data-istoggled", "true");
    			add_location(button0, file$1, 80, 16, 2769);
    			attr_dev(button1, "class", button1_class_value = "toggle " + (/*didGetActive*/ ctx[2] ? "active" : null));
    			attr_dev(button1, "data-id", "todo-active");
    			attr_dev(button1, "data-istoggled", "false");
    			add_location(button1, file$1, 81, 16, 2913);
    			attr_dev(button2, "class", button2_class_value = "toggle " + (/*didGetCompleted*/ ctx[4] ? "active" : null));
    			attr_dev(button2, "data-id", "todo-completed");
    			attr_dev(button2, "data-istoggled", "false");
    			add_location(button2, file$1, 82, 16, 3071);
    			attr_dev(div0, "id", "toggleBtns-large");
    			add_location(div0, file$1, 79, 12, 2725);
    			add_location(button3, file$1, 84, 12, 3255);
    			attr_dev(div1, "id", "todo-actions");
    			attr_dev(div1, "class", "todo-actions");
    			add_location(div1, file$1, 77, 8, 2603);
    			attr_dev(ul, "id", "todo-all");
    			set_style(ul, "background", /*setlight*/ ctx[0] === false ? "#25273C" : "white");
    			attr_dev(ul, "class", "svelte-hvxbv9");
    			add_location(ul, file$1, 38, 1, 1069);
    			attr_dev(button4, "class", button4_class_value = "toggle " + (/*didGetAll*/ ctx[3] ? "active" : null));
    			attr_dev(button4, "data-id", "todo-all");
    			attr_dev(button4, "data-istoggled", "true");
    			add_location(button4, file$1, 90, 16, 3537);
    			attr_dev(button5, "class", button5_class_value = "toggle " + (/*didGetActive*/ ctx[2] ? "active" : null));
    			attr_dev(button5, "data-id", "todo-active");
    			attr_dev(button5, "data-istoggled", "false");
    			add_location(button5, file$1, 91, 16, 3681);
    			attr_dev(button6, "class", button6_class_value = "toggle " + (/*didGetCompleted*/ ctx[4] ? "active" : null));
    			attr_dev(button6, "data-id", "todo-completed");
    			attr_dev(button6, "data-istoggled", "false");
    			add_location(button6, file$1, 92, 16, 3839);
    			attr_dev(div2, "class", "toggleWrapper");
    			attr_dev(div2, "id", "toggleWrapper");
    			set_style(div2, "background", /*setlight*/ ctx[0] === false ? "#25273C" : "white");
    			add_location(div2, file$1, 89, 12, 3415);
    			add_location(br0, file$1, 95, 12, 4024);
    			add_location(br1, file$1, 95, 16, 4028);
    			add_location(br2, file$1, 95, 20, 4032);
    			attr_dev(h4, "class", h4_class_value = "" + (null_to_empty(/*setlight*/ ctx[0] ? "light" : null) + " svelte-hvxbv9"));
    			add_location(h4, file$1, 96, 12, 4049);
    			attr_dev(div3, "class", "toggle-buttons");
    			attr_dev(div3, "id", "toggle-buttons");
    			add_location(div3, file$1, 88, 8, 3354);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			if (if_block0) if_block0.m(ul, null);
    			append_dev(ul, t0);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(ul, null);
    			}

    			append_dev(ul, t1);
    			append_dev(ul, div1);
    			append_dev(div1, span1);
    			append_dev(span1, span0);
    			append_dev(span0, t2);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, t4);
    			append_dev(div0, t5);
    			append_dev(div0, button1);
    			append_dev(button1, t6);
    			append_dev(div0, t7);
    			append_dev(div0, button2);
    			append_dev(button2, t8);
    			append_dev(div1, t9);
    			append_dev(div1, button3);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, button4);
    			append_dev(button4, t12);
    			append_dev(div2, t13);
    			append_dev(div2, button5);
    			append_dev(button5, t14);
    			append_dev(div2, t15);
    			append_dev(div2, button6);
    			append_dev(button6, t16);
    			append_dev(div3, t17);
    			append_dev(div3, br0);
    			append_dev(div3, br1);
    			append_dev(div3, br2);
    			append_dev(div3, t18);
    			append_dev(div3, h4);
    			append_dev(h4, t19);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[13], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[14], false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[15], false, false, false),
    					listen_dev(button4, "click", /*click_handler_4*/ ctx[16], false, false, false),
    					listen_dev(button5, "click", /*click_handler_5*/ ctx[17], false, false, false),
    					listen_dev(button6, "click", /*click_handler_6*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if (if_block0) if_block0.d(1);
    				if_block0 = current_block_type && current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(ul, t0);
    				}
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block1) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block1 = if_blocks[current_block_type_index];

    					if (!if_block1) {
    						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block1.c();
    					} else {
    						if_block1.p(ctx, dirty);
    					}

    					transition_in(if_block1, 1);
    					if_block1.m(ul, t1);
    				} else {
    					if_block1 = null;
    				}
    			}

    			if (!current || dirty & /*currItems*/ 32) set_data_dev(t2, /*currItems*/ ctx[5]);

    			if (!current || dirty & /*didGetAll*/ 8 && button0_class_value !== (button0_class_value = "toggle " + (/*didGetAll*/ ctx[3] ? "active" : null))) {
    				attr_dev(button0, "class", button0_class_value);
    			}

    			if (!current || dirty & /*didGetActive*/ 4 && button1_class_value !== (button1_class_value = "toggle " + (/*didGetActive*/ ctx[2] ? "active" : null))) {
    				attr_dev(button1, "class", button1_class_value);
    			}

    			if (!current || dirty & /*didGetCompleted*/ 16 && button2_class_value !== (button2_class_value = "toggle " + (/*didGetCompleted*/ ctx[4] ? "active" : null))) {
    				attr_dev(button2, "class", button2_class_value);
    			}

    			if (!current || dirty & /*setlight*/ 1) {
    				set_style(ul, "background", /*setlight*/ ctx[0] === false ? "#25273C" : "white");
    			}

    			if (!current || dirty & /*didGetAll*/ 8 && button4_class_value !== (button4_class_value = "toggle " + (/*didGetAll*/ ctx[3] ? "active" : null))) {
    				attr_dev(button4, "class", button4_class_value);
    			}

    			if (!current || dirty & /*didGetActive*/ 4 && button5_class_value !== (button5_class_value = "toggle " + (/*didGetActive*/ ctx[2] ? "active" : null))) {
    				attr_dev(button5, "class", button5_class_value);
    			}

    			if (!current || dirty & /*didGetCompleted*/ 16 && button6_class_value !== (button6_class_value = "toggle " + (/*didGetCompleted*/ ctx[4] ? "active" : null))) {
    				attr_dev(button6, "class", button6_class_value);
    			}

    			if (!current || dirty & /*setlight*/ 1) {
    				set_style(div2, "background", /*setlight*/ ctx[0] === false ? "#25273C" : "white");
    			}

    			if (!current || dirty & /*setlight*/ 1 && h4_class_value !== (h4_class_value = "" + (null_to_empty(/*setlight*/ ctx[0] ? "light" : null) + " svelte-hvxbv9"))) {
    				attr_dev(h4, "class", h4_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);

    			if (if_block0) {
    				if_block0.d();
    			}

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let currItems;
    	let $CompletedItems;
    	let $ActiveItems;
    	let $ToDoItems;
    	validate_store(CompletedItems, 'CompletedItems');
    	component_subscribe($$self, CompletedItems, $$value => $$invalidate(6, $CompletedItems = $$value));
    	validate_store(ActiveItems, 'ActiveItems');
    	component_subscribe($$self, ActiveItems, $$value => $$invalidate(1, $ActiveItems = $$value));
    	validate_store(ToDoItems, 'ToDoItems');
    	component_subscribe($$self, ToDoItems, $$value => $$invalidate(7, $ToDoItems = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Todocontainer', slots, []);
    	let didGetActive = false;
    	let didGetAll = true;
    	let didGetCompleted = false;
    	let helper = new Helper();

    	const clearCompleted = () => {
    		helper.clearCompleted($CompletedItems);
    	};

    	const getAll = () => {
    		$$invalidate(3, didGetAll = true);
    		$$invalidate(2, didGetActive = false);
    		$$invalidate(4, didGetCompleted = false);
    	};

    	const getActive = () => {
    		$$invalidate(3, didGetAll = false);
    		$$invalidate(2, didGetActive = true);
    		$$invalidate(4, didGetCompleted = false);
    	};

    	const getCompleted = () => {
    		$$invalidate(3, didGetAll = false);
    		$$invalidate(2, didGetActive = false);
    		$$invalidate(4, didGetCompleted = true);
    	};

    	let { setlight = false } = $$props;
    	const writable_props = ['setlight'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Todocontainer> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => getAll();
    	const click_handler_1 = () => getActive();
    	const click_handler_2 = () => getCompleted();
    	const click_handler_3 = () => clearCompleted();
    	const click_handler_4 = () => getAll();
    	const click_handler_5 = () => getActive();
    	const click_handler_6 = () => getCompleted();

    	$$self.$$set = $$props => {
    		if ('setlight' in $$props) $$invalidate(0, setlight = $$props.setlight);
    	};

    	$$self.$capture_state = () => ({
    		ToDoItems,
    		ActiveItems,
    		CompletedItems,
    		fade,
    		scale,
    		slide,
    		Listitem,
    		Helper,
    		didGetActive,
    		didGetAll,
    		didGetCompleted,
    		helper,
    		clearCompleted,
    		getAll,
    		getActive,
    		getCompleted,
    		setlight,
    		currItems,
    		$CompletedItems,
    		$ActiveItems,
    		$ToDoItems
    	});

    	$$self.$inject_state = $$props => {
    		if ('didGetActive' in $$props) $$invalidate(2, didGetActive = $$props.didGetActive);
    		if ('didGetAll' in $$props) $$invalidate(3, didGetAll = $$props.didGetAll);
    		if ('didGetCompleted' in $$props) $$invalidate(4, didGetCompleted = $$props.didGetCompleted);
    		if ('helper' in $$props) helper = $$props.helper;
    		if ('setlight' in $$props) $$invalidate(0, setlight = $$props.setlight);
    		if ('currItems' in $$props) $$invalidate(5, currItems = $$props.currItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$ActiveItems*/ 2) {
    			$$invalidate(5, currItems = $ActiveItems.length === 0
    			? "No items"
    			: $ActiveItems.length === 1
    				? "1 item left"
    				: `${$ActiveItems.length} items left`);
    		}
    	};

    	return [
    		setlight,
    		$ActiveItems,
    		didGetActive,
    		didGetAll,
    		didGetCompleted,
    		currItems,
    		$CompletedItems,
    		$ToDoItems,
    		clearCompleted,
    		getAll,
    		getActive,
    		getCompleted,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6
    	];
    }

    class Todocontainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { setlight: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Todocontainer",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get setlight() {
    		throw new Error("<Todocontainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setlight(value) {
    		throw new Error("<Todocontainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.49.0 */
    const file = "src/App.svelte";

    // (47:1) <Maincontent>
    function create_default_slot(ctx) {
    	let todocontainer;
    	let current;

    	todocontainer = new Todocontainer({
    			props: { setlight: /*setlight*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(todocontainer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(todocontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const todocontainer_changes = {};
    			if (dirty & /*setlight*/ 1) todocontainer_changes.setlight = /*setlight*/ ctx[0];
    			todocontainer.$set(todocontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(todocontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(todocontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(todocontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(47:1) <Maincontent>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let t;
    	let maincontent;
    	let current;
    	header = new Header({ $$inline: true });
    	header.$on("switch-LightMode", /*handleLightMode*/ ctx[1]);

    	maincontent = new Maincontent({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t = space();
    			create_component(maincontent.$$.fragment);
    			attr_dev(main, "id", "mainwrapper");
    			attr_dev(main, "class", "svelte-3ugqdj");
    			add_location(main, file, 44, 0, 1160);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t);
    			mount_component(maincontent, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const maincontent_changes = {};

    			if (dirty & /*$$scope, setlight*/ 65) {
    				maincontent_changes.$$scope = { dirty, ctx };
    			}

    			maincontent.$set(maincontent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(maincontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(maincontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(maincontent);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $ActiveItems;
    	let $CompletedItems;
    	let $ToDoItems;
    	validate_store(ActiveItems, 'ActiveItems');
    	component_subscribe($$self, ActiveItems, $$value => $$invalidate(3, $ActiveItems = $$value));
    	validate_store(CompletedItems, 'CompletedItems');
    	component_subscribe($$self, CompletedItems, $$value => $$invalidate(4, $CompletedItems = $$value));
    	validate_store(ToDoItems, 'ToDoItems');
    	component_subscribe($$self, ToDoItems, $$value => $$invalidate(5, $ToDoItems = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	sessionStorage.clear();
    	let savestore = false;

    	onMount(async () => {
    		let ses = window.sessionStorage.getItem("store");
    		let comp = window.sessionStorage.getItem("completed");
    		let active = window.sessionStorage.getItem("active");

    		if (ses) {
    			set_store_value(ToDoItems, $ToDoItems = JSON.parse(ses), $ToDoItems);
    		}

    		if (comp) {
    			set_store_value(CompletedItems, $CompletedItems = JSON.parse(comp), $CompletedItems);
    		}

    		if (active) {
    			set_store_value(ActiveItems, $ActiveItems = JSON.parse(active), $ActiveItems);
    		}

    		$$invalidate(2, savestore = true);
    	});

    	let setlight = false;

    	const handleLightMode = e => {
    		$$invalidate(0, setlight = e.detail);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Maincontent,
    		Todocontainer,
    		onMount,
    		ToDoItems,
    		CompletedItems,
    		ActiveItems,
    		savestore,
    		setlight,
    		handleLightMode,
    		$ActiveItems,
    		$CompletedItems,
    		$ToDoItems
    	});

    	$$self.$inject_state = $$props => {
    		if ('savestore' in $$props) $$invalidate(2, savestore = $$props.savestore);
    		if ('setlight' in $$props) $$invalidate(0, setlight = $$props.setlight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*savestore, $ToDoItems, $CompletedItems, $ActiveItems*/ 60) {
    			if (savestore && $ToDoItems && $CompletedItems && $ActiveItems) {
    				window.sessionStorage.setItem("store", JSON.stringify($ToDoItems));
    				window.sessionStorage.setItem("completed", JSON.stringify($CompletedItems));
    				window.sessionStorage.setItem("active", JSON.stringify($ActiveItems));
    			}
    		}
    	};

    	return [
    		setlight,
    		handleLightMode,
    		savestore,
    		$ActiveItems,
    		$CompletedItems,
    		$ToDoItems
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	// props: {
    	// 	name: 'world'
    	// }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
