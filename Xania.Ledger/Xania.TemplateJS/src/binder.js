var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Binding = (function () {
    function Binding(context, idx) {
        this.context = context;
        this.idx = idx;
    }
    Binding.executeAsync = function (tpl, context, resolve) {
        var model = !!tpl.modelAccessor ? tpl.modelAccessor(context) : context, iter = function (data) {
            Xania.map(resolve, data);
        };
        if (typeof (model.then) === "function") {
            model.then(iter);
        }
        else {
            iter(model);
        }
    };
    Binding.prototype.update = function () {
        throw new Error("Abstract method Binding.update");
    };
    Binding.prototype.init = function (depGraph) {
        throw new Error("Abstract method Binding.update");
    };
    Binding.create = function (tpl, context, depGraph) {
        var results = [];
        Binding.createAsync(tpl, context, depGraph).then(results.push.bind(results));
        return results;
    };
    Binding.createAsync = function (tpl, context, depGraph) {
        return {
            then: function (resolve) {
                Binding.executeAsync(tpl, context, function (model, idx) {
                    if (typeof idx == "undefined")
                        throw new Error("model idx is not defined");
                    resolve(tpl.bind(model, idx).init(depGraph));
                });
            }
        };
    };
    Binding.prototype.accept = function (visitor) {
        var stack = [this];
        while (stack.length > 0) {
            var cur = stack.pop();
            visitor(cur);
            if (cur instanceof TagBinding) {
                var children = cur.children;
                for (var i = 0; i < children.length; i++)
                    stack.push(children[i]);
            }
        }
    };
    return Binding;
})();
var DependencyGraph = (function () {
    function DependencyGraph() {
        this.map = new Map();
    }
    DependencyGraph.prototype.add = function (object, property, binding) {
        if (this.map.has(object)) {
            var deps = this.map.get(object);
            if (deps.hasOwnProperty(property))
                deps[property].push(binding);
            else
                deps[property] = [binding];
        }
        else {
            var deps = {};
            deps[property] = [binding];
            this.map.set(object, deps);
        }
        return this;
    };
    DependencyGraph.prototype.get = function (object, property) {
        if (!this.map.has(object))
            return [];
        var deps = this.map.get(object);
        var result = [];
        if (deps.hasOwnProperty(property))
            result.push.apply(result, deps[property]);
        return result;
    };
    DependencyGraph.prototype.observer = function (binding) {
        if (binding === void 0) { binding = null; }
        var self = this;
        return {
            setRead: function (obj, property) {
                if (!!binding)
                    self.add(obj, property, binding);
            },
            setChange: function (obj, property) {
                var bindings = self.get(obj, property);
                for (var i = 0; i < bindings.length; i++) {
                    bindings[i].dirty = true;
                }
            }
        };
    };
    return DependencyGraph;
})();
var ContentBinding = (function (_super) {
    __extends(ContentBinding, _super);
    function ContentBinding(tpl, context, idx) {
        _super.call(this, context, idx);
        this.tpl = tpl;
    }
    ContentBinding.prototype.update = function () {
        if (this.dirty) {
            this.dom.textContent = this.tpl.execute(this.context);
            this.dirty = false;
        }
    };
    ContentBinding.prototype.init = function (depGraph) {
        var observable = Xania.observe(this.context, depGraph.observer(this));
        var text = this.tpl.execute(observable);
        this.dom = document.createTextNode(text);
        return this;
    };
    return ContentBinding;
})(Binding);
var TagBinding = (function (_super) {
    __extends(TagBinding, _super);
    function TagBinding(tpl, context, idx) {
        _super.call(this, context, idx);
        this.tpl = tpl;
        this.children = [];
    }
    TagBinding.prototype.renderTag = function (model) {
        var elt = document.createElement(this.tpl.name);
        var attributes = this.tpl.executeAttributes(model);
        for (var attrName in attributes) {
            if (attributes.hasOwnProperty(attrName)) {
                var domAttr = document.createAttribute(attrName);
                domAttr.value = attributes[attrName];
                elt.setAttributeNode(domAttr);
            }
        }
        return elt;
    };
    TagBinding.prototype.update = function () {
        if (this.dirty) {
            var elt = this.dom;
            var attributes = this.tpl.executeAttributes(this.context);
            for (var attrName in attributes) {
                if (attributes.hasOwnProperty(attrName)) {
                    var domAttr = elt.attributes[attrName];
                    if (!!domAttr) {
                        domAttr.value = attributes[attrName];
                        elt.setAttributeNode(domAttr);
                    }
                }
            }
            this.dirty = false;
        }
    };
    TagBinding.prototype.init = function (depGraph) {
        var _this = this;
        var observable = Xania.observe(this.context, depGraph.observer(this));
        this.dom = this.renderTag(observable);
        var children = this.tpl.children();
        for (var e = 0; e < children.length; e++) {
            Binding.createAsync(children[e], this.context, depGraph)
                .then(function (child) {
                child.parent = _this;
                _this.dom.appendChild(child.dom);
                _this.children.push(child);
            });
        }
        return this;
    };
    return TagBinding;
})(Binding);
var Binder = (function () {
    function Binder(compile) {
        if (compile === void 0) { compile = TemplateEngine.compile; }
        this.compile = compile;
    }
    Binder.prototype.import = function (itemType) {
        if (typeof itemType == "undefined")
            return null;
        switch (typeof (itemType)) {
            case "string":
                return window[itemType];
            case "function":
                return itemType;
            default:
                return null;
        }
    };
    Binder.prototype.parseAttr = function (tagElement, attr) {
        var name = attr.name;
        if (name === "click") {
            var fn = new Function("m", "with(m) { return " + attr.value + "; }");
            tagElement.addEvent("click", fn);
        }
        else if (name === "data-for" || name === "data-from") {
            tagElement.for(attr.value, this.import);
        }
        else {
            var tpl = this.compile(attr.value);
            tagElement.attr(name, tpl || attr.value);
        }
    };
    Binder.prototype.bind = function (rootDom, model, target) {
        var _this = this;
        target = target || document.body;
        var tpl = this.parseDom(rootDom);
        var rootBindings = [];
        var depGraph = new DependencyGraph();
        Binding.createAsync(tpl, model, depGraph)
            .then(function (rootBinding) {
            rootBindings.push(rootBinding);
            target.appendChild(rootBinding.dom);
        });
        function find(bindings, path) {
            var result = [];
            for (var i = path.length - 1; i >= 0; i--) {
                var dom = path[i];
                var domIdx = 0;
                for (; domIdx < bindings.length; domIdx++) {
                    var binding = bindings[domIdx];
                    if (binding.dom === dom) {
                        result.push(binding);
                        break;
                    }
                }
                if (domIdx === bindings.length) {
                    return [];
                }
                bindings = bindings[domIdx].children;
            }
            return result;
        }
        target.addEventListener("click", function (evt) {
            var pathIdx = evt.path.indexOf(target);
            if (pathIdx > 0) {
                var domPath = evt.path.splice(0, pathIdx);
                var bindingPath = find(rootBindings, domPath);
                if (bindingPath.length > 0) {
                    var b = bindingPath.pop();
                    var handler = b.tpl.events.get('click');
                    if (!!handler) {
                        var proxy = Xania.observe(b.context, depGraph.observer());
                        handler(proxy);
                        _this.updateBindings(rootBindings);
                    }
                }
            }
        });
        var onchange = function (evt) {
            var pathIdx = evt.path.indexOf(target);
            if (pathIdx > 0) {
                var elementPath = evt.path.splice(0, pathIdx);
                var bindingPath = find(rootBindings, elementPath);
                if (bindingPath.length > 0) {
                    var b = bindingPath.pop();
                    var nameAttr = evt.target.attributes["name"];
                    if (!!nameAttr) {
                        var proxy = Xania.observe(b.context, depGraph.observer());
                        var prop = nameAttr.value;
                        var update = new Function("context", "value", "with (context) { " + prop + " = value; }");
                        update(proxy, evt.target.value);
                        _this.updateBindings(rootBindings);
                    }
                }
            }
        };
        target.addEventListener("keyup", onchange);
    };
    Binder.prototype.updateBindings = function (bindings) {
        for (var i = 0; i < bindings.length; i++) {
            bindings[i].accept(function (b) { return b.update(); });
        }
    };
    Binder.prototype.parseDom = function (rootDom) {
        var stack = [];
        var i;
        var rootTpl;
        stack.push({
            node: rootDom,
            push: function (e) {
                rootTpl = e;
            }
        });
        while (stack.length > 0) {
            var cur = stack.pop();
            var node = cur.node;
            var push = cur.push;
            if (node.nodeType === 1) {
                var elt = node;
                var template = new TagElement(elt.tagName);
                for (i = 0; !!elt.attributes && i < elt.attributes.length; i++) {
                    var attribute = elt.attributes[i];
                    this.parseAttr(template, attribute);
                }
                for (i = elt.childNodes.length - 1; i >= 0; i--) {
                    stack.push({ node: elt.childNodes[i], push: template.addChild.bind(template) });
                }
                push(template);
            }
            else if (node.nodeType === 3) {
                var tpl = this.compile(node.textContent);
                push(new TextContent(tpl || node.textContent));
            }
        }
        return rootTpl;
    };
    return Binder;
})();
var TemplateEngine = (function () {
    function TemplateEngine() {
    }
    TemplateEngine.compile = function (input) {
        if (!input || !input.trim()) {
            return null;
        }
        var template = input.replace(/\n/g, "\\\n");
        var params = "";
        var returnExpr = template.replace(/@([\w\(\)\.]+)/gim, function (a, b) {
            var paramIdx = "arg" + params.length;
            params += "var " + paramIdx + " = " + b + ";";
            return "\" + " + paramIdx + " + \"";
        });
        if (params.length > 0) {
            if (!TemplateEngine.cacheFn[input]) {
                var functionBody = "with(m) {" + params + "return \"" + returnExpr + "\"}";
                TemplateEngine.cacheFn[input] = new Function("m", functionBody);
            }
            return TemplateEngine.cacheFn[input];
        }
        return function () { return returnExpr; };
    };
    TemplateEngine.cacheFn = {};
    return TemplateEngine;
})();
//# sourceMappingURL=binder.js.map