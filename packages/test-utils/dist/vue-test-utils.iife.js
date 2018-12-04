var VueTestUtils = (function (Vue,validators,util,eventTypes,createInstance,mergeOptions) {
  'use strict';

  Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;
  eventTypes = eventTypes && eventTypes.hasOwnProperty('default') ? eventTypes['default'] : eventTypes;
  createInstance = createInstance && createInstance.hasOwnProperty('default') ? createInstance['default'] : createInstance;

  if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s);
        var i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1
      };
  }

  if (typeof Object.assign !== 'function') {
    (function () {
      Object.assign = function (target) {
        var arguments$1 = arguments;

        if (target === undefined || target === null) {
          throw new TypeError('Cannot convert undefined or null to object')
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var source = arguments$1[index];
          if (source !== undefined && source !== null) {
            for (var nextKey in source) {
              if (source.hasOwnProperty(nextKey)) {
                output[nextKey] = source[nextKey];
              }
            }
          }
        }
        return output
      };
    })();
  }

  var NAME_SELECTOR = 'NAME_SELECTOR';
  var COMPONENT_SELECTOR = 'COMPONENT_SELECTOR';
  var REF_SELECTOR = 'REF_SELECTOR';
  var DOM_SELECTOR = 'DOM_SELECTOR';
  var INVALID_SELECTOR = 'INVALID_SELECTOR';
  var VUE_VERSION = Number(
    ((Vue.version.split('.')[0]) + "." + (Vue.version.split('.')[1]))
  );
  var FUNCTIONAL_OPTIONS =
    VUE_VERSION >= 2.5 ? 'fnOptions' : 'functionalOptions';

  // 

  function getSelectorType (
    selector
  ) {
    if (validators.isDomSelector(selector)) { return DOM_SELECTOR }
    if (validators.isVueComponent(selector)) { return COMPONENT_SELECTOR }
    if (validators.isNameSelector(selector)) { return NAME_SELECTOR }
    if (validators.isRefSelector(selector)) { return REF_SELECTOR }

    return INVALID_SELECTOR
  }

  function getSelector (
    selector,
    methodName
  ) {
    var type = getSelectorType(selector);
    if (type === INVALID_SELECTOR) {
      util.throwError(
        "wrapper." + methodName + "() must be passed a valid CSS selector, Vue " +
        "constructor, or valid find option object"
      );
    }
    return {
      type: type,
      value: selector
    }
  }

  // 

  function getRealChild (vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
      return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
      return vnode
    }
  }

  function isSameChild (child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag
  }

  function getFirstComponentChild (children) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (c && (c.componentOptions || isAsyncPlaceholder(c))) {
          return c
        }
      }
    }
  }

  function isPrimitive (value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      // $FlowIgnore
      typeof value === 'symbol' ||
      typeof value === 'boolean'
    )
  }

  function isAsyncPlaceholder (node) {
    return node.isComment && node.asyncFactory
  }

  function hasParentTransition (vnode) {
    while ((vnode = vnode.parent)) {
      if (vnode.data.transition) {
        return true
      }
    }
  }

  var TransitionStub = {
    render: function render (h) {
      var children = this.$options._renderChildren;
      if (!children) {
        return
      }

      // filter out text nodes (possible whitespaces)
      children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
      /* istanbul ignore if */
      if (!children.length) {
        return
      }

      // warn multiple elements
      if (children.length > 1) {
        util.warn(
          "<transition> can only be used on a single element. " + "Use " +
           '<transition-group> for lists.'
        );
      }

      var mode = this.mode;

      // warn invalid mode
      if (mode && mode !== 'in-out' && mode !== 'out-in'
      ) {
        util.warn(
          'invalid <transition> mode: ' + mode
        );
      }

      var rawChild = children[0];

      // if this is a component root node and the component's
      // parent container node also has transition, skip.
      if (hasParentTransition(this.$vnode)) {
        return rawChild
      }

      // apply transition data to child
      // use getRealChild() to ignore abstract components e.g. keep-alive
      var child = getRealChild(rawChild);

      if (!child) {
        return rawChild
      }

      var id = "__transition-" + (this._uid) + "-";
      child.key = child.key == null
        ? child.isComment
          ? id + 'comment'
          : id + child.tag
        : isPrimitive(child.key)
          ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
          : child.key;

      var data = (child.data || (child.data = {}));
      var oldRawChild = this._vnode;
      var oldChild = getRealChild(oldRawChild);
      if (child.data.directives &&
        child.data.directives.some(function (d) { return d.name === 'show'; })) {
        child.data.show = true;
      }

      // mark v-show
      // so that the transition module can hand over the control
      // to the directive
      if (child.data.directives &&
        child.data.directives.some(function (d) { return d.name === 'show'; })) {
        child.data.show = true;
      }
      if (
        oldChild &&
           oldChild.data &&
           !isSameChild(child, oldChild) &&
           !isAsyncPlaceholder(oldChild) &&
           // #6687 component root is a comment node
           !(oldChild.componentInstance &&
            oldChild.componentInstance._vnode.isComment)
      ) {
        oldChild.data = Object.assign({}, data);
      }
      return rawChild
    }
  }

  // 

  var TransitionGroupStub = {
    render: function render (h) {
      var tag = this.tag || this.$vnode.data.tag || 'span';
      var children = this.$slots.default || [];

      return h(tag, null, children)
    }
  }

  var config = {
    stubs: {
      transition: TransitionStub,
      'transition-group': TransitionGroupStub
    },
    mocks: {},
    methods: {},
    provide: {},
    logModifiedComponents: true,
    silent: true
  }

  // 

  var WrapperArray = function WrapperArray (wrappers) {
    var length = wrappers.length;
    // $FlowIgnore
    Object.defineProperty(this, 'wrappers', {
      get: function () { return wrappers; },
      set: function () { return util.throwError('wrapperArray.wrappers is read-only'); }
    });
    // $FlowIgnore
    Object.defineProperty(this, 'length', {
      get: function () { return length; },
      set: function () { return util.throwError('wrapperArray.length is read-only'); }
    });
  };

  WrapperArray.prototype.at = function at (index) {
    if (index > this.length - 1) {
      util.throwError(("no item exists at " + index));
    }
    return this.wrappers[index]
  };

  WrapperArray.prototype.attributes = function attributes () {
    this.throwErrorIfWrappersIsEmpty('attributes');

    util.throwError(
      "attributes must be called on a single wrapper, use " +
        "at(i) to access a wrapper"
    );
  };

  WrapperArray.prototype.classes = function classes () {
    this.throwErrorIfWrappersIsEmpty('classes');

    util.throwError(
      "classes must be called on a single wrapper, use " +
        "at(i) to access a wrapper"
    );
  };

  WrapperArray.prototype.contains = function contains (selector) {
    this.throwErrorIfWrappersIsEmpty('contains');

    return this.wrappers.every(function (wrapper) { return wrapper.contains(selector); })
  };

  WrapperArray.prototype.exists = function exists () {
    return this.length > 0 && this.wrappers.every(function (wrapper) { return wrapper.exists(); })
  };

  WrapperArray.prototype.filter = function filter (predicate) {
    return new WrapperArray(this.wrappers.filter(predicate))
  };

  WrapperArray.prototype.visible = function visible () {
    this.throwErrorIfWrappersIsEmpty('visible');

    return this.length > 0 && this.wrappers.every(function (wrapper) { return wrapper.visible(); })
  };

  WrapperArray.prototype.emitted = function emitted () {
    this.throwErrorIfWrappersIsEmpty('emitted');

    util.throwError(
      "emitted must be called on a single wrapper, use " +
        "at(i) to access a wrapper"
    );
  };

  WrapperArray.prototype.emittedByOrder = function emittedByOrder () {
    this.throwErrorIfWrappersIsEmpty('emittedByOrder');

    util.throwError(
      "emittedByOrder must be called on a single wrapper, " +
        "use at(i) to access a wrapper"
    );
  };

  WrapperArray.prototype.hasAttribute = function hasAttribute (attribute, value) {
    this.throwErrorIfWrappersIsEmpty('hasAttribute');

    return this.wrappers.every(function (wrapper) { return wrapper.hasAttribute(attribute, value); }
    )
  };

  WrapperArray.prototype.hasClass = function hasClass (className) {
    this.throwErrorIfWrappersIsEmpty('hasClass');

    return this.wrappers.every(function (wrapper) { return wrapper.hasClass(className); })
  };

  WrapperArray.prototype.hasProp = function hasProp (prop, value) {
    this.throwErrorIfWrappersIsEmpty('hasProp');

    return this.wrappers.every(function (wrapper) { return wrapper.hasProp(prop, value); })
  };

  WrapperArray.prototype.hasStyle = function hasStyle (style, value) {
    this.throwErrorIfWrappersIsEmpty('hasStyle');

    return this.wrappers.every(function (wrapper) { return wrapper.hasStyle(style, value); })
  };

  WrapperArray.prototype.findAll = function findAll () {
    this.throwErrorIfWrappersIsEmpty('findAll');

    util.throwError(
      "findAll must be called on a single wrapper, use " +
        "at(i) to access a wrapper"
    );
  };

  WrapperArray.prototype.find = function find () {
    this.throwErrorIfWrappersIsEmpty('find');

    util.throwError(
      "find must be called on a single wrapper, use at(i) " +
        "to access a wrapper"
    );
  };

  WrapperArray.prototype.html = function html () {
    this.throwErrorIfWrappersIsEmpty('html');

    util.throwError(
      "html must be called on a single wrapper, use at(i) " +
        "to access a wrapper"
    );
  };

  WrapperArray.prototype.is = function is (selector) {
    this.throwErrorIfWrappersIsEmpty('is');

    return this.wrappers.every(function (wrapper) { return wrapper.is(selector); })
  };

  WrapperArray.prototype.isEmpty = function isEmpty () {
    this.throwErrorIfWrappersIsEmpty('isEmpty');

    return this.wrappers.every(function (wrapper) { return wrapper.isEmpty(); })
  };

  WrapperArray.prototype.isVisible = function isVisible () {
    this.throwErrorIfWrappersIsEmpty('isVisible');

    return this.wrappers.every(function (wrapper) { return wrapper.isVisible(); })
  };

  WrapperArray.prototype.isVueInstance = function isVueInstance () {
    this.throwErrorIfWrappersIsEmpty('isVueInstance');

    return this.wrappers.every(function (wrapper) { return wrapper.isVueInstance(); })
  };

  WrapperArray.prototype.name = function name () {
    this.throwErrorIfWrappersIsEmpty('name');

    util.throwError(
      "name must be called on a single wrapper, use at(i) " +
        "to access a wrapper"
    );
  };

  WrapperArray.prototype.props = function props () {
    this.throwErrorIfWrappersIsEmpty('props');

    util.throwError(
      "props must be called on a single wrapper, use " +
        "at(i) to access a wrapper"
    );
  };

  WrapperArray.prototype.text = function text () {
    this.throwErrorIfWrappersIsEmpty('text');

    util.throwError(
      "text must be called on a single wrapper, use at(i) " +
        "to access a wrapper"
    );
  };

  WrapperArray.prototype.throwErrorIfWrappersIsEmpty = function throwErrorIfWrappersIsEmpty (method) {
    if (this.wrappers.length === 0) {
      util.throwError((method + " cannot be called on 0 items"));
    }
  };

  WrapperArray.prototype.setComputed = function setComputed (computed) {
    this.throwErrorIfWrappersIsEmpty('setComputed');

    this.wrappers.forEach(function (wrapper) { return wrapper.setComputed(computed); });
  };

  WrapperArray.prototype.setData = function setData (data) {
    this.throwErrorIfWrappersIsEmpty('setData');

    this.wrappers.forEach(function (wrapper) { return wrapper.setData(data); });
  };

  WrapperArray.prototype.setMethods = function setMethods (props) {
    this.throwErrorIfWrappersIsEmpty('setMethods');

    this.wrappers.forEach(function (wrapper) { return wrapper.setMethods(props); });
  };

  WrapperArray.prototype.setProps = function setProps (props) {
    this.throwErrorIfWrappersIsEmpty('setProps');

    this.wrappers.forEach(function (wrapper) { return wrapper.setProps(props); });
  };

  WrapperArray.prototype.setValue = function setValue (value) {
    this.throwErrorIfWrappersIsEmpty('setValue');

    this.wrappers.forEach(function (wrapper) { return wrapper.setValue(value); });
  };

  WrapperArray.prototype.setChecked = function setChecked (checked) {
      if ( checked === void 0 ) checked = true;

    this.throwErrorIfWrappersIsEmpty('setChecked');

    this.wrappers.forEach(function (wrapper) { return wrapper.setChecked(checked); });
  };

  WrapperArray.prototype.setSelected = function setSelected () {
    this.throwErrorIfWrappersIsEmpty('setSelected');

    util.throwError(
      "setSelected must be called on a single wrapper, " +
        "use at(i) to access a wrapper"
    );
  };

  WrapperArray.prototype.trigger = function trigger (event, options) {
    this.throwErrorIfWrappersIsEmpty('trigger');

    this.wrappers.forEach(function (wrapper) { return wrapper.trigger(event, options); });
  };

  WrapperArray.prototype.update = function update () {
    this.throwErrorIfWrappersIsEmpty('update');
    util.warn(
      "update has been removed. All changes are now " +
        "synchrnous without calling update"
    );
  };

  WrapperArray.prototype.destroy = function destroy () {
    this.throwErrorIfWrappersIsEmpty('destroy');

    this.wrappers.forEach(function (wrapper) { return wrapper.destroy(); });
  };

  // 

  var ErrorWrapper = function ErrorWrapper (selector) {
    this.selector = selector;
  };

  ErrorWrapper.prototype.at = function at () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call at() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.attributes = function attributes () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call attributes() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.classes = function classes () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call classes() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.contains = function contains () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call contains() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.emitted = function emitted () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call emitted() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.emittedByOrder = function emittedByOrder () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call emittedByOrder() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.exists = function exists () {
    return false
  };

  ErrorWrapper.prototype.filter = function filter () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call filter() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.visible = function visible () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call visible() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.hasAttribute = function hasAttribute () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call hasAttribute() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.hasClass = function hasClass () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call hasClass() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.hasProp = function hasProp () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call hasProp() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.hasStyle = function hasStyle () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call hasStyle() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.findAll = function findAll () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call findAll() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.find = function find () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call find() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.html = function html () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call html() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.is = function is () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call is() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.isEmpty = function isEmpty () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call isEmpty() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.isVisible = function isVisible () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call isVisible() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.isVueInstance = function isVueInstance () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call isVueInstance() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.name = function name () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call name() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.props = function props () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call props() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.text = function text () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call text() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.setComputed = function setComputed () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call setComputed() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.setData = function setData () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call setData() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.setMethods = function setMethods () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call setMethods() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.setProps = function setProps () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call setProps() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.setValue = function setValue () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call setValue() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.setChecked = function setChecked () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call setChecked() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.setSelected = function setSelected () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call setSelected() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.trigger = function trigger () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call trigger() on empty Wrapper")
    );
  };

  ErrorWrapper.prototype.update = function update () {
    util.throwError(
      "update has been removed from vue-test-utils." +
      "All updates are now synchronous by default"
    );
  };

  ErrorWrapper.prototype.destroy = function destroy () {
    util.throwError(
      ("find did not return " + (this.selector) + ", cannot call destroy() on empty Wrapper")
    );
  };

  // 

  function findDOMNodes (
    element,
    selector
  ) {
    var nodes = [];
    if (!element || !element.querySelectorAll || !element.matches) {
      return nodes
    }

    if (element.matches(selector)) {
      nodes.push(element);
    }
    // $FlowIgnore
    return nodes.concat([].slice.call(element.querySelectorAll(selector)))
  }

  function vmMatchesName (vm, name) {
    return !!name && (
      (vm.name === name) ||
      (vm.$options && vm.$options.name === name)
    )
  }

  function vmCtorMatches (vm, component) {
    var Ctor = typeof component === 'function'
      ? component.options._Ctor
      : component._Ctor;

    if (
      vm.$options && vm.$options.$_vueTestUtils_original === component ||
      vm.$_vueTestUtils_original === component
    ) {
      return true
    }

    if (!Ctor) {
      return false
    }

    var constructor = vm.constructor;
    return Object.keys(Ctor).some(function (c) {
      return component.functional
        ? Ctor[c] === vm._Ctor[c]
        : Ctor[c] === constructor
    })
  }

  function matches (node, selector) {
    if (selector.type === DOM_SELECTOR) {
      var element = node instanceof Element
        ? node
        : node.elm;
      return element && element.matches && element.matches(selector.value)
    }

    var isFunctionalSelector = typeof selector.value === 'function'
      ? selector.value.options.functional
      : selector.value.functional;

    var componentInstance = isFunctionalSelector
      ? node[FUNCTIONAL_OPTIONS]
      : node.child;

    if (!componentInstance) {
      return false
    }

    if (selector.type === COMPONENT_SELECTOR) {
      if (vmCtorMatches(componentInstance, selector.value)) {
        return true
      }
    }

    // Fallback to name selector for COMPONENT_SELECTOR for Vue < 2.1
    var nameSelector =
    typeof selector.value === 'function'
      ? selector.value.extendOptions.name
      : selector.value.name;
    return vmMatchesName(componentInstance, nameSelector)
  }

  // 

  function findAllInstances (rootVm) {
    var instances = [rootVm];
    var i = 0;
    while (i < instances.length) {
      var vm = instances[i]
      ;(vm.$children || []).forEach(function (child) {
        instances.push(child);
      });
      i++;
    }
    return instances
  }

  function findAllVNodes (
    vnode,
    selector
  ) {
    var matchingNodes = [];
    var nodes = [vnode];
    while (nodes.length) {
      var node = nodes.shift();
      if (node.children) {
        var children = [].concat( node.children ).reverse();
        children.forEach(function (n) {
          nodes.unshift(n);
        });
      }
      if (node.child) {
        nodes.unshift(node.child._vnode);
      }
      if (matches(node, selector)) {
        matchingNodes.push(node);
      }
    }

    return matchingNodes
  }

  function removeDuplicateNodes (vNodes) {
    var vNodeElms = vNodes.map(function (vNode) { return vNode.elm; });
    return vNodes.filter(
      function (vNode, index) { return index === vNodeElms.indexOf(vNode.elm); }
    )
  }

  function find (
    root,
    vm,
    selector
  ) {
    if ((root instanceof Element) && selector.type !== DOM_SELECTOR) {
      util.throwError(
        "cannot find a Vue instance on a DOM node. The node " +
        "you are calling find on does not exist in the " +
        "VDom. Are you adding the node as innerHTML?"
      );
    }

    if (
      selector.type === COMPONENT_SELECTOR &&
      selector.value.functional &&
      util.vueVersion < 2.3
    ) {
      util.throwError(
        "find for functional components is not supported " +
          "in Vue < 2.3"
      );
    }

    if (root instanceof Element) {
      return findDOMNodes(root, selector.value)
    }

    if (!root && selector.type !== DOM_SELECTOR) {
      util.throwError(
        "cannot find a Vue instance on a DOM node. The node " +
        "you are calling find on does not exist in the " +
        "VDom. Are you adding the node as innerHTML?"
      );
    }

    if (!vm && selector.type === REF_SELECTOR) {
      util.throwError(
        "$ref selectors can only be used on Vue component " + "wrappers"
      );
    }

    if (
      vm &&
      vm.$refs &&
      selector.value.ref in vm.$refs
    ) {
      var refs = vm.$refs[selector.value.ref];
      return Array.isArray(refs) ? refs : [refs]
    }

    var nodes = findAllVNodes(root, selector);
    var dedupedNodes = removeDuplicateNodes(nodes);

    if (nodes.length > 0 || selector.type !== DOM_SELECTOR) {
      return dedupedNodes
    }

    // Fallback in case element exists in HTML, but not in vnode tree
    // (e.g. if innerHTML is set as a domProp)
    return findDOMNodes(root.elm, selector.value)
  }

  // 

  function createWrapper (
    node,
    options
  ) {
    if ( options === void 0 ) options = {};

    var componentInstance = node.child;
    if (componentInstance) {
      return new VueWrapper(componentInstance, options)
    }
    return node instanceof Vue
      ? new VueWrapper(node, options)
      : new Wrapper(node, options)
  }

  // 

  var i = 0;

  function orderDeps (watcher) {
    watcher.deps.forEach(function (dep) {
      if (dep._sortedId === i) {
        return
      }
      dep._sortedId = i;
      dep.subs.forEach(orderDeps);
      dep.subs = dep.subs.sort(function (a, b) { return a.id - b.id; });
    });
  }

  function orderVmWatchers (vm) {
    if (vm._watchers) {
      vm._watchers.forEach(orderDeps);
    }

    if (vm._computedWatchers) {
      Object.keys(vm._computedWatchers).forEach(function (computedWatcher) {
        orderDeps(vm._computedWatchers[computedWatcher]);
      });
    }

    vm._watcher && orderDeps(vm._watcher);

    vm.$children.forEach(orderVmWatchers);
  }

  function orderWatchers (vm) {
    orderVmWatchers(vm);
    i++;
  }

  function recursivelySetData (vm, target, data) {
    Object.keys(data).forEach(function (key) {
      var val = data[key];
      var targetVal = target[key];

      if (validators.isPlainObject(val) && validators.isPlainObject(targetVal)) {
        recursivelySetData(vm, targetVal, val);
      } else {
        vm.$set(target, key, val);
      }
    });
  }

  var defaultEventType = {
    eventInterface: 'Event',
    cancelable: true,
    bubbles: true
  };

  var modifiers = {
    enter: 13,
    tab: 9,
    delete: 46,
    esc: 27,
    space: 32,
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    end: 35,
    home: 36,
    backspace: 8,
    insert: 45,
    pageup: 33,
    pagedown: 34
  };

  function createDOMEvent (type, options) {
    var ref = type.split('.');
    var eventType = ref[0];
    var modifier = ref[1];
    var ref$1 = eventTypes[eventType] || defaultEventType;
    var eventInterface = ref$1.eventInterface;
    var bubbles = ref$1.bubbles;
    var cancelable = ref$1.cancelable;

    if (typeof window.Event === 'function') {
      var SupportedEventInterface =
       typeof window[eventInterface] === 'function'
         ? window[eventInterface]
         : window.Event;

      return new SupportedEventInterface(eventType, Object.assign({}, {bubbles: bubbles,
        cancelable: cancelable},
        options,
        {keyCode: modifiers[modifier]}))
    }

    // Fallback for IE10,11 - https://stackoverflow.com/questions/26596123
    var eventObject = document.createEvent('Event');

    eventObject.initEvent(eventType, bubbles, cancelable);
    Object.keys(options || {}).forEach(function (key) {
      eventObject[key] = options[key];
    });
    eventObject.keyCode = modifiers[modifier];

    return eventObject
  }

  // 

  var Wrapper = function Wrapper (
    node,
    options,
    isVueWrapper
  ) {
    var vnode = node instanceof Element ? null : node;
    var element = node instanceof Element ? node : node.elm;
    // Prevent redefine by VueWrapper
    if (!isVueWrapper) {
      // $FlowIgnore : issue with defineProperty
      Object.defineProperty(this, 'rootNode', {
        get: function () { return vnode || element; },
        set: function () { return util.throwError('wrapper.vnode is read-only'); }
      });
      // $FlowIgnore
      Object.defineProperty(this, 'vnode', {
        get: function () { return vnode; },
        set: function () { return util.throwError('wrapper.vnode is read-only'); }
      });
      // $FlowIgnore
      Object.defineProperty(this, 'element', {
        get: function () { return element; },
        set: function () { return util.throwError('wrapper.element is read-only'); }
      });
      // $FlowIgnore
      Object.defineProperty(this, 'vm', {
        get: function () { return undefined; },
        set: function () { return util.throwError('wrapper.vm is read-only'); }
      });
    }
    var frozenOptions = Object.freeze(options);
    // $FlowIgnore
    Object.defineProperty(this, 'options', {
      get: function () { return frozenOptions; },
      set: function () { return util.throwError('wrapper.options is read-only'); }
    });
    if (
      this.vnode &&
      (this.vnode[FUNCTIONAL_OPTIONS] || this.vnode.functionalContext)
    ) {
      this.isFunctionalComponent = true;
    }
  };

  Wrapper.prototype.at = function at () {
    util.throwError('at() must be called on a WrapperArray');
  };

  /**
   * Returns an Object containing all the attribute/value pairs on the element.
   */
  Wrapper.prototype.attributes = function attributes (key) {
    var attributes = this.element.attributes;
    var attributeMap = {};
    for (var i = 0; i < attributes.length; i++) {
      var att = attributes.item(i);
      attributeMap[att.localName] = att.value;
    }
    if (key) {
      return attributeMap[key]
    }
    return attributeMap
  };

  /**
   * Returns an Array containing all the classes on the element
   */
  Wrapper.prototype.classes = function classes (className) {
      var this$1 = this;

    var classAttribute = this.element.getAttribute('class');
    var classes = classAttribute ? classAttribute.split(' ') : [];
    // Handle converting cssmodules identifiers back to the original class name
    if (this.vm && this.vm.$style) {
      var cssModuleIdentifiers = Object.keys(this.vm.$style)
        .reduce(function (acc, key) {
        // $FlowIgnore
          var moduleIdent = this$1.vm.$style[key];
          if (moduleIdent) {
            acc[moduleIdent.split(' ')[0]] = key;
          }
          return acc
        }, {});
      classes = classes.map(
        function (name) { return cssModuleIdentifiers[name] || name; }
      );
    }

    if (className) {
      if (classes.indexOf(className) > -1) {
        return true
      } else {
        return false
      }
    }
    return classes
  };

  /**
   * Checks if wrapper contains provided selector.
   */
  Wrapper.prototype.contains = function contains (rawSelector) {
    var selector = getSelector(rawSelector, 'contains');
    var nodes = find(this.rootNode, this.vm, selector);
    return nodes.length > 0
  };

  /**
   * Calls destroy on vm
   */
  Wrapper.prototype.destroy = function destroy () {
    if (!this.isVueInstance()) {
      util.throwError("wrapper.destroy() can only be called on a Vue instance");
    }

    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    // $FlowIgnore
    this.vm.$destroy();
  };

  /**
   * Returns an object containing custom events emitted by the Wrapper vm
   */
  Wrapper.prototype.emitted = function emitted (
    event
  ) {
    if (!this._emitted && !this.vm) {
      util.throwError("wrapper.emitted() can only be called on a Vue instance");
    }
    if (event) {
      return this._emitted[event]
    }
    return this._emitted
  };

  /**
   * Returns an Array containing custom events emitted by the Wrapper vm
   */
  Wrapper.prototype.emittedByOrder = function emittedByOrder () {
    if (!this._emittedByOrder && !this.vm) {
      util.throwError(
        "wrapper.emittedByOrder() can only be called on a Vue instance"
      );
    }
    return this._emittedByOrder
  };

  /**
   * Utility to check wrapper exists. Returns true as Wrapper always exists
   */
  Wrapper.prototype.exists = function exists () {
    if (this.vm) {
      return !!this.vm && !this.vm._isDestroyed
    }
    return true
  };

  Wrapper.prototype.filter = function filter () {
    util.throwError('filter() must be called on a WrapperArray');
  };

  /**
   * Finds first node in tree of the current wrapper that
   * matches the provided selector.
   */
  Wrapper.prototype.find = function find$1 (rawSelector) {
    var selector = getSelector(rawSelector, 'find');
    var node = find(this.rootNode, this.vm, selector)[0];

    if (!node) {
      if (selector.type === REF_SELECTOR) {
        return new ErrorWrapper(("ref=\"" + (selector.value.ref) + "\""))
      }
      return new ErrorWrapper(
        typeof selector.value === 'string'
          ? selector.value
          : 'Component'
      )
    }

    return createWrapper(node, this.options)
  };

  /**
   * Finds node in tree of the current wrapper that matches
   * the provided selector.
   */
  Wrapper.prototype.findAll = function findAll (rawSelector) {
      var this$1 = this;

    var selector = getSelector(rawSelector, 'findAll');
    var nodes = find(this.rootNode, this.vm, selector);
    var wrappers = nodes.map(function (node) {
      // Using CSS Selector, returns a VueWrapper instance if the root element
      // binds a Vue instance.
      return createWrapper(node, this$1.options)
    });
    return new WrapperArray(wrappers)
  };

  /**
   * Checks if wrapper has an attribute with matching value
   */
  Wrapper.prototype.hasAttribute = function hasAttribute (attribute, value) {
    util.warn(
      "hasAttribute() has been deprecated and will be " +
      "removed in version 1.0.0. Use attributes() " +
      "instead—https://vue-test-utils.vuejs.org/api/wrapper/attributes.html"
    );

    if (typeof attribute !== 'string') {
      util.throwError(
        "wrapper.hasAttribute() must be passed attribute as a string"
      );
    }

    if (typeof value !== 'string') {
      util.throwError(
        "wrapper.hasAttribute() must be passed value as a string"
      );
    }

    return !!(this.element.getAttribute(attribute) === value)
  };

  /**
   * Asserts wrapper has a class name
   */
  Wrapper.prototype.hasClass = function hasClass (className) {
      var this$1 = this;

    util.warn(
      "hasClass() has been deprecated and will be removed " +
      "in version 1.0.0. Use classes() " +
      "instead—https://vue-test-utils.vuejs.org/api/wrapper/classes.html"
    );
    var targetClass = className;

    if (typeof targetClass !== 'string') {
      util.throwError('wrapper.hasClass() must be passed a string');
    }

    // if $style is available and has a matching target, use that instead.
    if (this.vm && this.vm.$style && this.vm.$style[targetClass]) {
      targetClass = this.vm.$style[targetClass];
    }

    var containsAllClasses = targetClass
      .split(' ')
      .every(function (target) { return this$1.element.classList.contains(target); });

    return !!(this.element && containsAllClasses)
  };

  /**
   * Asserts wrapper has a prop name
   */
  Wrapper.prototype.hasProp = function hasProp (prop, value) {
    util.warn(
      "hasProp() has been deprecated and will be removed " +
      "in version 1.0.0. Use props() " +
      "instead—https://vue-test-utils.vuejs.org/api/wrapper/props.html"
    );

    if (!this.isVueInstance()) {
      util.throwError('wrapper.hasProp() must be called on a Vue instance');
    }
    if (typeof prop !== 'string') {
      util.throwError('wrapper.hasProp() must be passed prop as a string');
    }

    // $props object does not exist in Vue 2.1.x, so use
    // $options.propsData instead
    if (
      this.vm &&
      this.vm.$options &&
      this.vm.$options.propsData &&
      this.vm.$options.propsData[prop] === value
    ) {
      return true
    }

    return !!this.vm && !!this.vm.$props && this.vm.$props[prop] === value
  };

  /**
   * Checks if wrapper has a style with value
   */
  Wrapper.prototype.hasStyle = function hasStyle (style, value) {
    util.warn(
      "hasStyle() has been deprecated and will be removed " +
      "in version 1.0.0. Use wrapper.element.style " +
      "instead"
    );

    if (typeof style !== 'string') {
      util.throwError("wrapper.hasStyle() must be passed style as a string");
    }

    if (typeof value !== 'string') {
      util.throwError('wrapper.hasClass() must be passed value as string');
    }

    /* istanbul ignore next */
    if (
      navigator.userAgent.includes &&
      (navigator.userAgent.includes('node.js') ||
        navigator.userAgent.includes('jsdom'))
    ) {
      util.warn(
        "wrapper.hasStyle is not fully supported when " +
        "running jsdom - only inline styles are supported"
      );
    }
    var body = document.querySelector('body');
    var mockElement = document.createElement('div');

    if (!(body instanceof Element)) {
      return false
    }
    var mockNode = body.insertBefore(mockElement, null);
    // $FlowIgnore : Flow thinks style[style] returns a number
    mockElement.style[style] = value;

    if (!this.options.attachedToDocument && (this.vm || this.vnode)) {
      // $FlowIgnore : Possible null value, will be removed in 1.0.0
      var vm = this.vm || this.vnode.context.$root;
      body.insertBefore(vm.$root._vnode.elm, null);
    }

    var elStyle = window.getComputedStyle(this.element)[style];
    var mockNodeStyle = window.getComputedStyle(mockNode)[style];
    return !!(elStyle && mockNodeStyle && elStyle === mockNodeStyle)
  };

  /**
   * Returns HTML of element as a string
   */
  Wrapper.prototype.html = function html () {
    return this.element.outerHTML
  };

  /**
   * Checks if node matches selector
   */
  Wrapper.prototype.is = function is (rawSelector) {
    var selector = getSelector(rawSelector, 'is');

    if (selector.type === REF_SELECTOR) {
      util.throwError('$ref selectors can not be used with wrapper.is()');
    }

    return matches(this.rootNode, selector)
  };

  /**
   * Checks if node is empty
   */
  Wrapper.prototype.isEmpty = function isEmpty () {
    if (!this.vnode) {
      return this.element.innerHTML === ''
    }
    var nodes = [];
    var node = this.vnode;
    var i = 0;

    while (node) {
      if (node.child) {
        nodes.push(node.child._vnode);
      }
      node.children && node.children.forEach(function (n) {
        nodes.push(n);
      });
      node = nodes[i++];
    }
    return nodes.every(function (n) { return n.isComment || n.child; })
  };

  /**
   * Checks if node is visible
   */
  Wrapper.prototype.isVisible = function isVisible () {
    var element = this.element;
    while (element) {
      if (
        element.style &&
        (element.style.visibility === 'hidden' ||
          element.style.display === 'none')
      ) {
        return false
      }
      element = element.parentElement;
    }

    return true
  };

  /**
   * Checks if wrapper is a vue instance
   */
  Wrapper.prototype.isVueInstance = function isVueInstance () {
    return !!this.vm
  };

  /**
   * Returns name of component, or tag name if node is not a Vue component
   */
  Wrapper.prototype.name = function name () {
    if (this.vm) {
      return this.vm.$options.name ||
      // compat for Vue < 2.3
      (this.vm.$options.extendOptions && this.vm.$options.extendOptions.name)
    }

    if (!this.vnode) {
      return this.element.tagName
    }

    return this.vnode.tag
  };

  /**
   * Returns an Object containing the prop name/value pairs on the element
   */
  Wrapper.prototype.props = function props (key) {
      var this$1 = this;

    if (this.isFunctionalComponent) {
      util.throwError(
        "wrapper.props() cannot be called on a mounted " +
          "functional component."
      );
    }
    if (!this.vm) {
      util.throwError('wrapper.props() must be called on a Vue instance');
    }

    var props = {};
    var keys = this.vm && this.vm.$options._propKeys;

    if (keys) {
      (keys || {}).forEach(function (key) {
        if (this$1.vm) {
          props[key] = this$1.vm[key];
        }
      });
    }

    if (key) {
      return props[key]
    }

    return props
  };

  /**
   * Checks radio button or checkbox element
   */
  Wrapper.prototype.setChecked = function setChecked (checked) {
      if ( checked === void 0 ) checked = true;

    if (typeof checked !== 'boolean') {
      util.throwError('wrapper.setChecked() must be passed a boolean');
    }
    var tagName = this.element.tagName;
    // $FlowIgnore
    var type = this.attributes().type;

    if (tagName === 'SELECT') {
      util.throwError(
        "wrapper.setChecked() cannot be called on a " +
          "<select> element. Use wrapper.setSelected() " +
          "instead"
      );
    } else if (tagName === 'INPUT' && type === 'checkbox') {
      // $FlowIgnore
      if (this.element.checked !== checked) {
        if (!navigator.userAgent.includes('jsdom')) {
          // $FlowIgnore
          this.element.checked = checked;
        }
        this.trigger('click');
        this.trigger('change');
      }
    } else if (tagName === 'INPUT' && type === 'radio') {
      if (!checked) {
        util.throwError(
          "wrapper.setChecked() cannot be called with " +
            "parameter false on a <input type=\"radio\" /> " +
            "element."
        );
      } else {
        // $FlowIgnore
        if (!this.element.checked) {
          this.trigger('click');
          this.trigger('change');
        }
      }
    } else if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
      util.throwError(
        "wrapper.setChecked() cannot be called on \"text\" " +
          "inputs. Use wrapper.setValue() instead"
      );
    } else {
      util.throwError("wrapper.setChecked() cannot be called on this element");
    }
  };

  /**
   * Selects <option></option> element
   */
  Wrapper.prototype.setSelected = function setSelected () {
    var tagName = this.element.tagName;
    // $FlowIgnore
    var type = this.attributes().type;

    if (tagName === 'OPTION') {
      // $FlowIgnore
      this.element.selected = true;
      // $FlowIgnore
      if (this.element.parentElement.tagName === 'OPTGROUP') {
        // $FlowIgnore
        createWrapper(this.element.parentElement.parentElement, this.options)
          .trigger('change');
      } else {
        // $FlowIgnore
        createWrapper(this.element.parentElement, this.options)
          .trigger('change');
      }
    } else if (tagName === 'SELECT') {
      util.throwError(
        "wrapper.setSelected() cannot be called on select. " +
          "Call it on one of its options"
      );
    } else if (tagName === 'INPUT' && type === 'checkbox') {
      util.throwError(
        "wrapper.setSelected() cannot be called on a <input " +
          "type=\"checkbox\" /> element. Use " +
          "wrapper.setChecked() instead"
      );
    } else if (tagName === 'INPUT' && type === 'radio') {
      util.throwError(
        "wrapper.setSelected() cannot be called on a <input " +
          "type=\"radio\" /> element. Use wrapper.setChecked() " +
          "instead"
      );
    } else if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
      util.throwError(
        "wrapper.setSelected() cannot be called on \"text\" " +
          "inputs. Use wrapper.setValue() instead"
      );
    } else {
      util.throwError("wrapper.setSelected() cannot be called on this element");
    }
  };

  /**
   * Sets vm computed
   */
  Wrapper.prototype.setComputed = function setComputed (computed) {
      var this$1 = this;

    if (!this.isVueInstance()) {
      util.throwError(
        "wrapper.setComputed() can only be called on a Vue " +
        "instance"
      );
    }

    util.warn(
      "setComputed() has been deprecated and will be " +
        "removed in version 1.0.0. You can overwrite " +
        "computed properties by passing a computed object " +
        "in the mounting options"
    );

    Object.keys(computed).forEach(function (key) {
      if (util.vueVersion > 2.1) {
        // $FlowIgnore : Problem with possibly null this.vm
        if (!this$1.vm._computedWatchers[key]) {
          util.throwError(
            "wrapper.setComputed() was passed a value that " +
            "does not exist as a computed property on the " +
            "Vue instance. Property " + key + " does not exist " +
            "on the Vue instance"
          );
        }
        // $FlowIgnore : Problem with possibly null this.vm
        this$1.vm._computedWatchers[key].value = computed[key];
        // $FlowIgnore : Problem with possibly null this.vm
        this$1.vm._computedWatchers[key].getter = function () { return computed[key]; };
      } else {
        var isStore = false;
        // $FlowIgnore : Problem with possibly null this.vm
        this$1.vm._watchers.forEach(function (watcher) {
          if (watcher.getter.vuex && key in watcher.vm.$options.store.getters) {
            watcher.vm.$options.store.getters = Object.assign({}, watcher.vm.$options.store.getters);
            Object.defineProperty(watcher.vm.$options.store.getters, key, {
              get: function () {
                return computed[key]
              }
            });
            isStore = true;
          }
        });

        // $FlowIgnore : Problem with possibly null this.vm
        if (!isStore && !this$1.vm._watchers.some(function (w) { return w.getter.name === key; })) {
          util.throwError(
            "wrapper.setComputed() was passed a value that does " +
            "not exist as a computed property on the Vue instance. " +
            "Property " + key + " does not exist on the Vue instance"
          );
        }
        // $FlowIgnore : Problem with possibly null this.vm
        this$1.vm._watchers.forEach(function (watcher) {
          if (watcher.getter.name === key) {
            watcher.value = computed[key];
            watcher.getter = function () { return computed[key]; };
          }
        });
      }
    });
    // $FlowIgnore : Problem with possibly null this.vm
    this.vm._watchers.forEach(function (watcher) {
      watcher.run();
    });
  };

  /**
   * Sets vm data
   */
  Wrapper.prototype.setData = function setData (data) {
    if (this.isFunctionalComponent) {
      util.throwError(
        "wrapper.setData() cannot be called on a functional " +
        "component"
      );
    }

    if (!this.vm) {
      util.throwError(
        "wrapper.setData() can only be called on a Vue " +
        "instance"
      );
    }

    recursivelySetData(this.vm, this.vm, data);
  };

  /**
   * Sets vm methods
   */
  Wrapper.prototype.setMethods = function setMethods (methods) {
      var this$1 = this;

    if (!this.isVueInstance()) {
      util.throwError(
        "wrapper.setMethods() can only be called on a Vue " +
        "instance"
      );
    }
    Object.keys(methods).forEach(function (key) {
      // $FlowIgnore : Problem with possibly null this.vm
      this$1.vm[key] = methods[key];
      // $FlowIgnore : Problem with possibly null this.vm
      this$1.vm.$options.methods[key] = methods[key];
    });

    if (this.vnode) {
      var context = this.vnode.context;
      if (context.$options.render) { context._update(context._render()); }
    }
  };

  /**
   * Sets vm props
   */
  Wrapper.prototype.setProps = function setProps (data) {
      var this$1 = this;

    var originalConfig = Vue.config.silent;
    Vue.config.silent = config.silent;
    if (this.isFunctionalComponent) {
      util.throwError(
        "wrapper.setProps() cannot be called on a " +
        "functional component"
      );
    }
    if (!this.vm) {
      util.throwError(
        "wrapper.setProps() can only be called on a Vue " +
        "instance"
      );
    }

    Object.keys(data).forEach(function (key) {
      if (
        typeof data[key] === 'object' &&
        data[key] !== null &&
        // $FlowIgnore : Problem with possibly null this.vm
        data[key] === this$1.vm[key]
      ) {
        util.throwError(
          "wrapper.setProps() called with the same object " +
          "of the existing " + key + " property. " +
          "You must call wrapper.setProps() with a new object " +
          "to trigger reactivity"
        );
      }
      if (
        !this$1.vm ||
        !this$1.vm.$options._propKeys ||
        !this$1.vm.$options._propKeys.some(function (prop) { return prop === key; })
      ) {
        if (util.vueVersion > 2.3) {
          // $FlowIgnore : Problem with possibly null this.vm
          this$1.vm.$attrs[key] = data[key];
          return
        }
        util.throwError(
          "wrapper.setProps() called with " + key + " property which " +
          "is not defined on the component"
        );
      }

      if (this$1.vm && this$1.vm._props) {
        // Set actual props value
        this$1.vm._props[key] = data[key];
        // $FlowIgnore : Problem with possibly null this.vm
        this$1.vm[key] = data[key];
      } else {
        // $FlowIgnore : Problem with possibly null this.vm.$options
        this$1.vm.$options.propsData[key] = data[key];
        // $FlowIgnore : Problem with possibly null this.vm
        this$1.vm[key] = data[key];
        // $FlowIgnore : Need to call this twice to fix watcher bug in 2.0.x
        this$1.vm[key] = data[key];
      }
    });
    // $FlowIgnore : Problem with possibly null this.vm
    this.vm.$forceUpdate();
    // $FlowIgnore : Problem with possibly null this.vm
    orderWatchers(this.vm || this.vnode.context.$root);
    Vue.config.silent = originalConfig;
  };

  /**
   * Sets element value and triggers input event
   */
  Wrapper.prototype.setValue = function setValue (value) {
    var tagName = this.element.tagName;
    // $FlowIgnore
    var type = this.attributes().type;

    if (tagName === 'SELECT') {
      // $FlowIgnore
      this.element.value = value;
      this.trigger('change');
    } else if (tagName === 'OPTION') {
      util.throwError(
        "wrapper.setValue() cannot be called on an <option> " +
          "element. Use wrapper.setSelected() instead"
      );
    } else if (tagName === 'INPUT' && type === 'checkbox') {
      util.throwError(
        "wrapper.setValue() cannot be called on a <input " +
          "type=\"checkbox\" /> element. Use " +
          "wrapper.setChecked() instead"
      );
    } else if (tagName === 'INPUT' && type === 'radio') {
      util.throwError(
        "wrapper.setValue() cannot be called on a <input " +
          "type=\"radio\" /> element. Use wrapper.setChecked() " +
          "instead"
      );
    } else if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
      // $FlowIgnore
      this.element.value = value;
      this.trigger('input');
    } else {
      util.throwError("wrapper.setValue() cannot be called on this element");
    }
  };

  /**
   * Return text of wrapper element
   */
  Wrapper.prototype.text = function text () {
    return this.element.textContent.trim()
  };

  /**
   * Dispatches a DOM event on wrapper
   */
  Wrapper.prototype.trigger = function trigger (type, options) {
      if ( options === void 0 ) options = {};

    if (typeof type !== 'string') {
      util.throwError('wrapper.trigger() must be passed a string');
    }

    if (options.target) {
      util.throwError(
        "you cannot set the target value of an event. See " +
          "the notes section of the docs for more " +
          "details—https://vue-test-utils.vuejs.org/api/wrapper/trigger.html"
      );
    }

    // Don't fire event on a disabled element
    if (this.attributes().disabled) {
      return
    }

    var event = createDOMEvent(type, options);
    this.element.dispatchEvent(event);

    if (this.vnode) {
      orderWatchers(this.vm || this.vnode.context.$root);
    }
  };

  Wrapper.prototype.update = function update () {
    util.warn(
      "update has been removed from vue-test-utils. All " +
      "updates are now synchronous by default"
    );
  };

  /**
   * Utility to check wrapper is visible. Returns false if a parent
   * element has display: none or visibility: hidden style.
   */
  Wrapper.prototype.visible = function visible () {
    util.warn(
      "visible has been deprecated and will be removed in " +
      "version 1, use isVisible instead"
    );
    var element = this.element;
    while (element) {
      if (
        element.style &&
        (element.style.visibility === 'hidden' ||
          element.style.display === 'none')
      ) {
        return false
      }
      element = element.parentElement;
    }

    return true
  };

  // 

  function setDepsSync (dep) {
    dep.subs.forEach(setWatcherSync);
  }

  function setWatcherSync (watcher) {
    if (watcher.sync === true) {
      return
    }
    watcher.sync = true;
    watcher.deps.forEach(setDepsSync);
  }

  function setWatchersToSync (vm) {
    if (vm._watchers) {
      vm._watchers.forEach(setWatcherSync);
    }

    if (vm._computedWatchers) {
      Object.keys(vm._computedWatchers).forEach(function (computedWatcher) {
        setWatcherSync(vm._computedWatchers[computedWatcher]);
      });
    }

    setWatcherSync(vm._watcher);

    vm.$children.forEach(setWatchersToSync);
    // preventing double registration
    if (!vm.$_vueTestUtils_updateInSetWatcherSync) {
      vm.$_vueTestUtils_updateInSetWatcherSync = vm._update;
      vm._update = function (vnode, hydrating) {
        var this$1 = this;

        this.$_vueTestUtils_updateInSetWatcherSync(vnode, hydrating);
        if (VUE_VERSION >= 2.1 && this._isMounted && this.$options.updated) {
          this.$options.updated.forEach(function (handler) {
            handler.call(this$1);
          });
        }
      };
    }
  }

  // 

  var VueWrapper = /*@__PURE__*/(function (Wrapper$$1) {
    function VueWrapper (vm, options) {
      var this$1 = this;

      Wrapper$$1.call(this, vm._vnode, options, true);
      // $FlowIgnore : issue with defineProperty
      Object.defineProperty(this, 'rootNode', {
        get: function () { return vm.$vnode || { child: this$1.vm }; },
        set: function () { return util.throwError('wrapper.vnode is read-only'); }
      });
      // $FlowIgnore : issue with defineProperty
      Object.defineProperty(this, 'vnode', {
        get: function () { return vm._vnode; },
        set: function () { return util.throwError('wrapper.vnode is read-only'); }
      });
      // $FlowIgnore
      Object.defineProperty(this, 'element', {
        get: function () { return vm.$el; },
        set: function () { return util.throwError('wrapper.element is read-only'); }
      });
      // $FlowIgnore
      Object.defineProperty(this, 'vm', {
        get: function () { return vm; },
        set: function () { return util.throwError('wrapper.vm is read-only'); }
      });
      if (options.sync) {
        setWatchersToSync(vm);
        orderWatchers(vm);
      }
      this.isFunctionalComponent = vm.$options._isFunctionalContainer;
      this._emitted = vm.__emitted;
      this._emittedByOrder = vm.__emittedByOrder;
    }

    if ( Wrapper$$1 ) VueWrapper.__proto__ = Wrapper$$1;
    VueWrapper.prototype = Object.create( Wrapper$$1 && Wrapper$$1.prototype );
    VueWrapper.prototype.constructor = VueWrapper;

    return VueWrapper;
  }(Wrapper));

  // 

  function createElement () {
    if (document) {
      var elem = document.createElement('div');

      if (document.body) {
        document.body.appendChild(elem);
      }
      return elem
    }
  }

  // 

  function errorHandler (
    errorOrString,
    vm
  ) {
    var error =
      typeof errorOrString === 'object'
        ? errorOrString
        : new Error(errorOrString);

    vm._error = error;

    throw error
  }

  // 

  function warnIfNoWindow () {
    if (typeof window === 'undefined') {
      util.throwError(
        "window is undefined, vue-test-utils needs to be " +
        "run in a browser environment. \n" +
        "You can run the tests in node using jsdom \n" +
        "See https://vue-test-utils.vuejs.org/guides/#browser-environment " +
        "for more details."
      );
    }
  }

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  var _listCacheClear = listCacheClear;

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  var eq_1 = eq;

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq_1(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  var _assocIndexOf = assocIndexOf;

  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  var _listCacheDelete = listCacheDelete;

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  var _listCacheGet = listCacheGet;

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return _assocIndexOf(this.__data__, key) > -1;
  }

  var _listCacheHas = listCacheHas;

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  var _listCacheSet = listCacheSet;

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = _listCacheClear;
  ListCache.prototype['delete'] = _listCacheDelete;
  ListCache.prototype.get = _listCacheGet;
  ListCache.prototype.has = _listCacheHas;
  ListCache.prototype.set = _listCacheSet;

  var _ListCache = ListCache;

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */
  function stackClear() {
    this.__data__ = new _ListCache;
    this.size = 0;
  }

  var _stackClear = stackClear;

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);

    this.size = data.size;
    return result;
  }

  var _stackDelete = stackDelete;

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }

  var _stackGet = stackGet;

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }

  var _stackHas = stackHas;

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = _freeGlobal || freeSelf || Function('return this')();

  var _root = root;

  /** Built-in value references. */
  var Symbol = _root.Symbol;

  var _Symbol = Symbol;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  var _getRawTag = getRawTag;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  var _objectToString = objectToString;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag$1 && symToStringTag$1 in Object(value))
      ? _getRawTag(value)
      : _objectToString(value);
  }

  var _baseGetTag = baseGetTag;

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject;

  /** `Object#toString` result references. */
  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    if (!isObject_1(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = _baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  var isFunction_1 = isFunction;

  /** Used to detect overreaching core-js shims. */
  var coreJsData = _root['__core-js_shared__'];

  var _coreJsData = coreJsData;

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  var _isMasked = isMasked;

  /** Used for built-in method references. */
  var funcProto = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  var _toSource = toSource;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto$1 = Function.prototype,
      objectProto$2 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = funcProto$1.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject_1(value) || _isMasked(value)) {
      return false;
    }
    var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
    return pattern.test(_toSource(value));
  }

  var _baseIsNative = baseIsNative;

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  var _getValue = getValue;

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = _getValue(object, key);
    return _baseIsNative(value) ? value : undefined;
  }

  var _getNative = getNative;

  /* Built-in method references that are verified to be native. */
  var Map = _getNative(_root, 'Map');

  var _Map = Map;

  /* Built-in method references that are verified to be native. */
  var nativeCreate = _getNative(Object, 'create');

  var _nativeCreate = nativeCreate;

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
    this.size = 0;
  }

  var _hashClear = hashClear;

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  var _hashDelete = hashDelete;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$3 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (_nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
  }

  var _hashGet = hashGet;

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
  }

  var _hashHas = hashHas;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
    return this;
  }

  var _hashSet = hashSet;

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = _hashClear;
  Hash.prototype['delete'] = _hashDelete;
  Hash.prototype.get = _hashGet;
  Hash.prototype.has = _hashHas;
  Hash.prototype.set = _hashSet;

  var _Hash = Hash;

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new _Hash,
      'map': new (_Map || _ListCache),
      'string': new _Hash
    };
  }

  var _mapCacheClear = mapCacheClear;

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  var _isKeyable = isKeyable;

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return _isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  var _getMapData = getMapData;

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    var result = _getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  var _mapCacheDelete = mapCacheDelete;

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return _getMapData(this, key).get(key);
  }

  var _mapCacheGet = mapCacheGet;

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return _getMapData(this, key).has(key);
  }

  var _mapCacheHas = mapCacheHas;

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    var data = _getMapData(this, key),
        size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  var _mapCacheSet = mapCacheSet;

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = _mapCacheClear;
  MapCache.prototype['delete'] = _mapCacheDelete;
  MapCache.prototype.get = _mapCacheGet;
  MapCache.prototype.has = _mapCacheHas;
  MapCache.prototype.set = _mapCacheSet;

  var _MapCache = MapCache;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof _ListCache) {
      var pairs = data.__data__;
      if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new _MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }

  var _stackSet = stackSet;

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Stack(entries) {
    var data = this.__data__ = new _ListCache(entries);
    this.size = data.size;
  }

  // Add methods to `Stack`.
  Stack.prototype.clear = _stackClear;
  Stack.prototype['delete'] = _stackDelete;
  Stack.prototype.get = _stackGet;
  Stack.prototype.has = _stackHas;
  Stack.prototype.set = _stackSet;

  var _Stack = Stack;

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  var _arrayEach = arrayEach;

  var defineProperty = (function() {
    try {
      var func = _getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }());

  var _defineProperty = defineProperty;

  /**
   * The base implementation of `assignValue` and `assignMergeValue` without
   * value checks.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function baseAssignValue(object, key, value) {
    if (key == '__proto__' && _defineProperty) {
      _defineProperty(object, key, {
        'configurable': true,
        'enumerable': true,
        'value': value,
        'writable': true
      });
    } else {
      object[key] = value;
    }
  }

  var _baseAssignValue = baseAssignValue;

  /** Used for built-in method references. */
  var objectProto$5 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty$4.call(object, key) && eq_1(objValue, value)) ||
        (value === undefined && !(key in object))) {
      _baseAssignValue(object, key, value);
    }
  }

  var _assignValue = assignValue;

  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});

    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];

      var newValue = customizer
        ? customizer(object[key], source[key], key, object, source)
        : undefined;

      if (newValue === undefined) {
        newValue = source[key];
      }
      if (isNew) {
        _baseAssignValue(object, key, newValue);
      } else {
        _assignValue(object, key, newValue);
      }
    }
    return object;
  }

  var _copyObject = copyObject;

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  var _baseTimes = baseTimes;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]';

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
  }

  var _baseIsArguments = baseIsArguments;

  /** Used for built-in method references. */
  var objectProto$6 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

  /** Built-in value references. */
  var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
    return isObjectLike_1(value) && hasOwnProperty$5.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
  };

  var isArguments_1 = isArguments;

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  var isArray_1 = isArray;

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  var stubFalse_1 = stubFalse;

  var isBuffer_1 = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports = exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Built-in value references. */
  var Buffer = moduleExports ? _root.Buffer : undefined;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */
  var isBuffer = nativeIsBuffer || stubFalse_1;

  module.exports = isBuffer;
  });

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;

    return !!length &&
      (type == 'number' ||
        (type != 'symbol' && reIsUint.test(value))) &&
          (value > -1 && value % 1 == 0 && value < length);
  }

  var _isIndex = isIndex;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
  }

  var isLength_1 = isLength;

  /** `Object#toString` result references. */
  var argsTag$1 = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag$1 = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */
  function baseIsTypedArray(value) {
    return isObjectLike_1(value) &&
      isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
  }

  var _baseIsTypedArray = baseIsTypedArray;

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  var _baseUnary = baseUnary;

  var _nodeUtil = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports = exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && _freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  module.exports = nodeUtil;
  });

  /* Node.js helper references. */
  var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

  var isTypedArray_1 = isTypedArray;

  /** Used for built-in method references. */
  var objectProto$7 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray_1(value),
        isArg = !isArr && isArguments_1(value),
        isBuff = !isArr && !isArg && isBuffer_1(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? _baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty$6.call(value, key)) &&
          !(skipIndexes && (
             // Safari 9 has enumerable `arguments.length` in strict mode.
             key == 'length' ||
             // Node.js 0.10 has enumerable non-index properties on buffers.
             (isBuff && (key == 'offset' || key == 'parent')) ||
             // PhantomJS 2 has enumerable non-index properties on typed arrays.
             (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
             // Skip index properties.
             _isIndex(key, length)
          ))) {
        result.push(key);
      }
    }
    return result;
  }

  var _arrayLikeKeys = arrayLikeKeys;

  /** Used for built-in method references. */
  var objectProto$8 = Object.prototype;

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;

    return value === proto;
  }

  var _isPrototype = isPrototype;

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  var _overArg = overArg;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeKeys = _overArg(Object.keys, Object);

  var _nativeKeys = nativeKeys;

  /** Used for built-in method references. */
  var objectProto$9 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeys(object) {
    if (!_isPrototype(object)) {
      return _nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty$7.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }
    return result;
  }

  var _baseKeys = baseKeys;

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null && isLength_1(value.length) && !isFunction_1(value);
  }

  var isArrayLike_1 = isArrayLike;

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  function keys(object) {
    return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
  }

  var keys_1 = keys;

  /**
   * The base implementation of `_.assign` without support for multiple sources
   * or `customizer` functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @returns {Object} Returns `object`.
   */
  function baseAssign(object, source) {
    return object && _copyObject(source, keys_1(source), object);
  }

  var _baseAssign = baseAssign;

  /**
   * This function is like
   * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * except that it includes inherited enumerable properties.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }

  var _nativeKeysIn = nativeKeysIn;

  /** Used for built-in method references. */
  var objectProto$10 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$8 = objectProto$10.hasOwnProperty;

  /**
   * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeysIn(object) {
    if (!isObject_1(object)) {
      return _nativeKeysIn(object);
    }
    var isProto = _isPrototype(object),
        result = [];

    for (var key in object) {
      if (!(key == 'constructor' && (isProto || !hasOwnProperty$8.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }

  var _baseKeysIn = baseKeysIn;

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */
  function keysIn$1(object) {
    return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
  }

  var keysIn_1 = keysIn$1;

  /**
   * The base implementation of `_.assignIn` without support for multiple sources
   * or `customizer` functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @returns {Object} Returns `object`.
   */
  function baseAssignIn(object, source) {
    return object && _copyObject(source, keysIn_1(source), object);
  }

  var _baseAssignIn = baseAssignIn;

  var _cloneBuffer = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports = exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Built-in value references. */
  var Buffer = moduleExports ? _root.Buffer : undefined,
      allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

  /**
   * Creates a clone of  `buffer`.
   *
   * @private
   * @param {Buffer} buffer The buffer to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Buffer} Returns the cloned buffer.
   */
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length,
        result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

    buffer.copy(result);
    return result;
  }

  module.exports = cloneBuffer;
  });

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function copyArray(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  var _copyArray = copyArray;

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  var _arrayFilter = arrayFilter;

  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */
  function stubArray() {
    return [];
  }

  var stubArray_1 = stubArray;

  /** Used for built-in method references. */
  var objectProto$11 = Object.prototype;

  /** Built-in value references. */
  var propertyIsEnumerable$1 = objectProto$11.propertyIsEnumerable;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeGetSymbols = Object.getOwnPropertySymbols;

  /**
   * Creates an array of the own enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */
  var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return _arrayFilter(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable$1.call(object, symbol);
    });
  };

  var _getSymbols = getSymbols;

  /**
   * Copies own symbols of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy symbols from.
   * @param {Object} [object={}] The object to copy symbols to.
   * @returns {Object} Returns `object`.
   */
  function copySymbols(source, object) {
    return _copyObject(source, _getSymbols(source), object);
  }

  var _copySymbols = copySymbols;

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  var _arrayPush = arrayPush;

  /** Built-in value references. */
  var getPrototype = _overArg(Object.getPrototypeOf, Object);

  var _getPrototype = getPrototype;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

  /**
   * Creates an array of the own and inherited enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */
  var getSymbolsIn = !nativeGetSymbols$1 ? stubArray_1 : function(object) {
    var result = [];
    while (object) {
      _arrayPush(result, _getSymbols(object));
      object = _getPrototype(object);
    }
    return result;
  };

  var _getSymbolsIn = getSymbolsIn;

  /**
   * Copies own and inherited symbols of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy symbols from.
   * @param {Object} [object={}] The object to copy symbols to.
   * @returns {Object} Returns `object`.
   */
  function copySymbolsIn(source, object) {
    return _copyObject(source, _getSymbolsIn(source), object);
  }

  var _copySymbolsIn = copySymbolsIn;

  /**
   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
   * `keysFunc` and `symbolsFunc` to get the enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @param {Function} symbolsFunc The function to get the symbols of `object`.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
  }

  var _baseGetAllKeys = baseGetAllKeys;

  /**
   * Creates an array of own enumerable property names and symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function getAllKeys(object) {
    return _baseGetAllKeys(object, keys_1, _getSymbols);
  }

  var _getAllKeys = getAllKeys;

  /**
   * Creates an array of own and inherited enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function getAllKeysIn(object) {
    return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
  }

  var _getAllKeysIn = getAllKeysIn;

  /* Built-in method references that are verified to be native. */
  var DataView = _getNative(_root, 'DataView');

  var _DataView = DataView;

  /* Built-in method references that are verified to be native. */
  var Promise = _getNative(_root, 'Promise');

  var _Promise = Promise;

  /* Built-in method references that are verified to be native. */
  var Set = _getNative(_root, 'Set');

  var _Set = Set;

  /* Built-in method references that are verified to be native. */
  var WeakMap = _getNative(_root, 'WeakMap');

  var _WeakMap = WeakMap;

  /** `Object#toString` result references. */
  var mapTag$1 = '[object Map]',
      objectTag$1 = '[object Object]',
      promiseTag = '[object Promise]',
      setTag$1 = '[object Set]',
      weakMapTag$1 = '[object WeakMap]';

  var dataViewTag$1 = '[object DataView]';

  /** Used to detect maps, sets, and weakmaps. */
  var dataViewCtorString = _toSource(_DataView),
      mapCtorString = _toSource(_Map),
      promiseCtorString = _toSource(_Promise),
      setCtorString = _toSource(_Set),
      weakMapCtorString = _toSource(_WeakMap);

  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  var getTag = _baseGetTag;

  // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
  if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
      (_Map && getTag(new _Map) != mapTag$1) ||
      (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
      (_Set && getTag(new _Set) != setTag$1) ||
      (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
    getTag = function(value) {
      var result = _baseGetTag(value),
          Ctor = result == objectTag$1 ? value.constructor : undefined,
          ctorString = Ctor ? _toSource(Ctor) : '';

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString: return dataViewTag$1;
          case mapCtorString: return mapTag$1;
          case promiseCtorString: return promiseTag;
          case setCtorString: return setTag$1;
          case weakMapCtorString: return weakMapTag$1;
        }
      }
      return result;
    };
  }

  var _getTag = getTag;

  /** Used for built-in method references. */
  var objectProto$12 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$9 = objectProto$12.hasOwnProperty;

  /**
   * Initializes an array clone.
   *
   * @private
   * @param {Array} array The array to clone.
   * @returns {Array} Returns the initialized clone.
   */
  function initCloneArray(array) {
    var length = array.length,
        result = new array.constructor(length);

    // Add properties assigned by `RegExp#exec`.
    if (length && typeof array[0] == 'string' && hasOwnProperty$9.call(array, 'index')) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }

  var _initCloneArray = initCloneArray;

  /** Built-in value references. */
  var Uint8Array = _root.Uint8Array;

  var _Uint8Array = Uint8Array;

  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
    return result;
  }

  var _cloneArrayBuffer = cloneArrayBuffer;

  /**
   * Creates a clone of `dataView`.
   *
   * @private
   * @param {Object} dataView The data view to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned data view.
   */
  function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }

  var _cloneDataView = cloneDataView;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /**
   * Creates a clone of `regexp`.
   *
   * @private
   * @param {Object} regexp The regexp to clone.
   * @returns {Object} Returns the cloned regexp.
   */
  function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }

  var _cloneRegExp = cloneRegExp;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = _Symbol ? _Symbol.prototype : undefined,
      symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

  /**
   * Creates a clone of the `symbol` object.
   *
   * @private
   * @param {Object} symbol The symbol object to clone.
   * @returns {Object} Returns the cloned symbol object.
   */
  function cloneSymbol(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
  }

  var _cloneSymbol = cloneSymbol;

  /**
   * Creates a clone of `typedArray`.
   *
   * @private
   * @param {Object} typedArray The typed array to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned typed array.
   */
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }

  var _cloneTypedArray = cloneTypedArray;

  /** `Object#toString` result references. */
  var boolTag$1 = '[object Boolean]',
      dateTag$1 = '[object Date]',
      mapTag$2 = '[object Map]',
      numberTag$1 = '[object Number]',
      regexpTag$1 = '[object RegExp]',
      setTag$2 = '[object Set]',
      stringTag$1 = '[object String]',
      symbolTag = '[object Symbol]';

  var arrayBufferTag$1 = '[object ArrayBuffer]',
      dataViewTag$2 = '[object DataView]',
      float32Tag$1 = '[object Float32Array]',
      float64Tag$1 = '[object Float64Array]',
      int8Tag$1 = '[object Int8Array]',
      int16Tag$1 = '[object Int16Array]',
      int32Tag$1 = '[object Int32Array]',
      uint8Tag$1 = '[object Uint8Array]',
      uint8ClampedTag$1 = '[object Uint8ClampedArray]',
      uint16Tag$1 = '[object Uint16Array]',
      uint32Tag$1 = '[object Uint32Array]';

  /**
   * Initializes an object clone based on its `toStringTag`.
   *
   * **Note:** This function only supports cloning values with tags of
   * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
   *
   * @private
   * @param {Object} object The object to clone.
   * @param {string} tag The `toStringTag` of the object to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneByTag(object, tag, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag$1:
        return _cloneArrayBuffer(object);

      case boolTag$1:
      case dateTag$1:
        return new Ctor(+object);

      case dataViewTag$2:
        return _cloneDataView(object, isDeep);

      case float32Tag$1: case float64Tag$1:
      case int8Tag$1: case int16Tag$1: case int32Tag$1:
      case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
        return _cloneTypedArray(object, isDeep);

      case mapTag$2:
        return new Ctor;

      case numberTag$1:
      case stringTag$1:
        return new Ctor(object);

      case regexpTag$1:
        return _cloneRegExp(object);

      case setTag$2:
        return new Ctor;

      case symbolTag:
        return _cloneSymbol(object);
    }
  }

  var _initCloneByTag = initCloneByTag;

  /** Built-in value references. */
  var objectCreate = Object.create;

  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} proto The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  var baseCreate = (function() {
    function object() {}
    return function(proto) {
      if (!isObject_1(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object;
      object.prototype = undefined;
      return result;
    };
  }());

  var _baseCreate = baseCreate;

  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneObject(object) {
    return (typeof object.constructor == 'function' && !_isPrototype(object))
      ? _baseCreate(_getPrototype(object))
      : {};
  }

  var _initCloneObject = initCloneObject;

  /** `Object#toString` result references. */
  var mapTag$3 = '[object Map]';

  /**
   * The base implementation of `_.isMap` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a map, else `false`.
   */
  function baseIsMap(value) {
    return isObjectLike_1(value) && _getTag(value) == mapTag$3;
  }

  var _baseIsMap = baseIsMap;

  /* Node.js helper references. */
  var nodeIsMap = _nodeUtil && _nodeUtil.isMap;

  /**
   * Checks if `value` is classified as a `Map` object.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a map, else `false`.
   * @example
   *
   * _.isMap(new Map);
   * // => true
   *
   * _.isMap(new WeakMap);
   * // => false
   */
  var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;

  var isMap_1 = isMap;

  /** `Object#toString` result references. */
  var setTag$3 = '[object Set]';

  /**
   * The base implementation of `_.isSet` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a set, else `false`.
   */
  function baseIsSet(value) {
    return isObjectLike_1(value) && _getTag(value) == setTag$3;
  }

  var _baseIsSet = baseIsSet;

  /* Node.js helper references. */
  var nodeIsSet = _nodeUtil && _nodeUtil.isSet;

  /**
   * Checks if `value` is classified as a `Set` object.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a set, else `false`.
   * @example
   *
   * _.isSet(new Set);
   * // => true
   *
   * _.isSet(new WeakSet);
   * // => false
   */
  var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;

  var isSet_1 = isSet;

  /** Used to compose bitmasks for cloning. */
  var CLONE_DEEP_FLAG = 1,
      CLONE_FLAT_FLAG = 2,
      CLONE_SYMBOLS_FLAG = 4;

  /** `Object#toString` result references. */
  var argsTag$2 = '[object Arguments]',
      arrayTag$1 = '[object Array]',
      boolTag$2 = '[object Boolean]',
      dateTag$2 = '[object Date]',
      errorTag$1 = '[object Error]',
      funcTag$2 = '[object Function]',
      genTag$1 = '[object GeneratorFunction]',
      mapTag$4 = '[object Map]',
      numberTag$2 = '[object Number]',
      objectTag$2 = '[object Object]',
      regexpTag$2 = '[object RegExp]',
      setTag$4 = '[object Set]',
      stringTag$2 = '[object String]',
      symbolTag$1 = '[object Symbol]',
      weakMapTag$2 = '[object WeakMap]';

  var arrayBufferTag$2 = '[object ArrayBuffer]',
      dataViewTag$3 = '[object DataView]',
      float32Tag$2 = '[object Float32Array]',
      float64Tag$2 = '[object Float64Array]',
      int8Tag$2 = '[object Int8Array]',
      int16Tag$2 = '[object Int16Array]',
      int32Tag$2 = '[object Int32Array]',
      uint8Tag$2 = '[object Uint8Array]',
      uint8ClampedTag$2 = '[object Uint8ClampedArray]',
      uint16Tag$2 = '[object Uint16Array]',
      uint32Tag$2 = '[object Uint32Array]';

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] =
  cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] =
  cloneableTags[boolTag$2] = cloneableTags[dateTag$2] =
  cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] =
  cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] =
  cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] =
  cloneableTags[numberTag$2] = cloneableTags[objectTag$2] =
  cloneableTags[regexpTag$2] = cloneableTags[setTag$4] =
  cloneableTags[stringTag$2] = cloneableTags[symbolTag$1] =
  cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] =
  cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
  cloneableTags[errorTag$1] = cloneableTags[funcTag$2] =
  cloneableTags[weakMapTag$2] = false;

  /**
   * The base implementation of `_.clone` and `_.cloneDeep` which tracks
   * traversed objects.
   *
   * @private
   * @param {*} value The value to clone.
   * @param {boolean} bitmask The bitmask flags.
   *  1 - Deep clone
   *  2 - Flatten inherited properties
   *  4 - Clone symbols
   * @param {Function} [customizer] The function to customize cloning.
   * @param {string} [key] The key of `value`.
   * @param {Object} [object] The parent object of `value`.
   * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
   * @returns {*} Returns the cloned value.
   */
  function baseClone(value, bitmask, customizer, key, object, stack) {
    var result,
        isDeep = bitmask & CLONE_DEEP_FLAG,
        isFlat = bitmask & CLONE_FLAT_FLAG,
        isFull = bitmask & CLONE_SYMBOLS_FLAG;

    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== undefined) {
      return result;
    }
    if (!isObject_1(value)) {
      return value;
    }
    var isArr = isArray_1(value);
    if (isArr) {
      result = _initCloneArray(value);
      if (!isDeep) {
        return _copyArray(value, result);
      }
    } else {
      var tag = _getTag(value),
          isFunc = tag == funcTag$2 || tag == genTag$1;

      if (isBuffer_1(value)) {
        return _cloneBuffer(value, isDeep);
      }
      if (tag == objectTag$2 || tag == argsTag$2 || (isFunc && !object)) {
        result = (isFlat || isFunc) ? {} : _initCloneObject(value);
        if (!isDeep) {
          return isFlat
            ? _copySymbolsIn(value, _baseAssignIn(result, value))
            : _copySymbols(value, _baseAssign(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }
        result = _initCloneByTag(value, tag, isDeep);
      }
    }
    // Check for circular references and return its corresponding clone.
    stack || (stack = new _Stack);
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result);

    if (isSet_1(value)) {
      value.forEach(function(subValue) {
        result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
      });

      return result;
    }

    if (isMap_1(value)) {
      value.forEach(function(subValue, key) {
        result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
      });

      return result;
    }

    var keysFunc = isFull
      ? (isFlat ? _getAllKeysIn : _getAllKeys)
      : (isFlat ? keysIn : keys_1);

    var props = isArr ? undefined : keysFunc(value);
    _arrayEach(props || value, function(subValue, key) {
      if (props) {
        key = subValue;
        subValue = value[key];
      }
      // Recursively populate clone (susceptible to call stack limits).
      _assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
    return result;
  }

  var _baseClone = baseClone;

  /** Used to compose bitmasks for cloning. */
  var CLONE_DEEP_FLAG$1 = 1,
      CLONE_SYMBOLS_FLAG$1 = 4;

  /**
   * This method is like `_.clone` except that it recursively clones `value`.
   *
   * @static
   * @memberOf _
   * @since 1.0.0
   * @category Lang
   * @param {*} value The value to recursively clone.
   * @returns {*} Returns the deep cloned value.
   * @see _.clone
   * @example
   *
   * var objects = [{ 'a': 1 }, { 'b': 2 }];
   *
   * var deep = _.cloneDeep(objects);
   * console.log(deep[0] === objects[0]);
   * // => false
   */
  function cloneDeep(value) {
    return _baseClone(value, CLONE_DEEP_FLAG$1 | CLONE_SYMBOLS_FLAG$1);
  }

  var cloneDeep_1 = cloneDeep;

  // 

  function createLocalVue (_Vue) {
    if ( _Vue === void 0 ) _Vue = Vue;

    var instance = _Vue.extend();

    // clone global APIs
    Object.keys(_Vue).forEach(function (key) {
      if (!instance.hasOwnProperty(key)) {
        var original = _Vue[key];
        // cloneDeep can fail when cloning Vue instances
        // cloneDeep checks that the instance has a Symbol
        // which errors in Vue < 2.17 (https://github.com/vuejs/vue/pull/7878)
        try {
          instance[key] = typeof original === 'object'
            ? cloneDeep_1(original)
            : original;
        } catch (e) {
          instance[key] = original;
        }
      }
    });

    // config is not enumerable
    instance.config = cloneDeep_1(Vue.config);

    instance.config.errorHandler = errorHandler;

    // option merge strategies need to be exposed by reference
    // so that merge strats registered by plugins can work properly
    instance.config.optionMergeStrategies = Vue.config.optionMergeStrategies;

    // make sure all extends are based on this instance.
    // this is important so that global components registered by plugins,
    // e.g. router-link are created using the correct base constructor
    instance.options._base = instance;

    // compat for vue-router < 2.7.1 where it does not allow multiple installs
    if (instance._installedPlugins && instance._installedPlugins.length) {
      instance._installedPlugins.length = 0;
    }
    var use = instance.use;
    instance.use = function (plugin) {
      var rest = [], len = arguments.length - 1;
      while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

      if (plugin.installed === true) {
        plugin.installed = false;
      }
      if (plugin.install && plugin.install.installed === true) {
        plugin.install.installed = false;
      }
      use.call.apply(use, [ instance, plugin ].concat( rest ));
    };
    return instance
  }

  // 
  Vue.config.productionTip = false;
  Vue.config.devtools = false;

  function mount (
    component,
    options
  ) {
    if ( options === void 0 ) options = {};

    var existingErrorHandler = Vue.config.errorHandler;
    Vue.config.errorHandler = errorHandler;

    warnIfNoWindow();

    var elm = options.attachToDocument ? createElement() : undefined;

    var mergedOptions = mergeOptions.mergeOptions(options, config);

    var parentVm = createInstance(
      component,
      mergedOptions,
      createLocalVue(options.localVue)
    );

    var vm = parentVm.$mount(elm).$refs.vm;

    var componentsWithError = findAllInstances(vm).filter(
      function (c) { return c._error; }
    );

    if (componentsWithError.length > 0) {
      throw componentsWithError[0]._error
    }

    Vue.config.errorHandler = existingErrorHandler;

    var wrapperOptions = {
      attachedToDocument: !!mergedOptions.attachToDocument,
      sync: mergedOptions.sync
    };
    var root = vm.$options._isFunctionalContainer
      ? vm._vnode
      : vm;
    return createWrapper(root, wrapperOptions)
  }

  // 


  function shallowMount (
    component,
    options
  ) {
    if ( options === void 0 ) options = {};

    return mount(component, Object.assign({}, options,
      {shouldProxy: true}))
  }

  // 
  var toTypes = [String, Object];
  var eventTypes$1 = [String, Array];

  var RouterLinkStub = {
    name: 'RouterLinkStub',
    props: {
      to: {
        type: toTypes,
        required: true
      },
      tag: {
        type: String,
        default: 'a'
      },
      exact: Boolean,
      append: Boolean,
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      event: {
        type: eventTypes$1,
        default: 'click'
      }
    },
    render: function render (h) {
      return h(this.tag, undefined, this.$slots.default)
    }
  }

  function shallow (component, options) {
    util.warn(
      "shallow has been renamed to shallowMount. shallow " +
      "will be removed in 1.0.0, use shallowMount instead"
    );
    return shallowMount(component, options)
  }

  var index = {
    createLocalVue: createLocalVue,
    createWrapper: createWrapper,
    config: config,
    mount: mount,
    shallow: shallow,
    shallowMount: shallowMount,
    TransitionStub: TransitionStub,
    TransitionGroupStub: TransitionGroupStub,
    RouterLinkStub: RouterLinkStub,
    Wrapper: Wrapper,
    WrapperArray: WrapperArray
  }

  return index;

}(Vue,null,null,null,null,null));
