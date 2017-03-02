﻿export interface IAstVisitor {
    where(source, predicate);
    select(source, selector);
    query(param, source);
    member(target, name);
    app(fun, args: any[]);
    extend(name: string, value: any);
    await(observable);
    const(value);
}

declare function require(module: string);

var peg = require("./query.peg");

function empty(list) {
    return list.length === 0;
}

function not(value) {
    return !value;
}

function count(list) {
    return list.length;
}

// ReSharper disable InconsistentNaming
var WHERE = 1;
var QUERY = 2;
var IDENT = 3;
var MEMBER = 4;
var APP = 5;
var SELECT = 6;
var CONST = 7;
var RANGE = 8;
var BINARY = 9;
var AWAIT = 10;
var PIPE = 11;
var COMPOSE = 12;
var LAMBDA = 13;
// ReSharper restore InconsistentNaming

class Expression {
    constructor(public ast, private stack: any[]) {
    }

    execute(binding: IAstVisitor, context: any) {
        var { stack } = this;
        let idx = stack.length;
        while (idx--) {
            var ast = stack[idx];
            switch (ast.type) {
                case IDENT:
                    ast.value = binding.member(context, ast.name);
                    break;
                case QUERY:
                    ast.value = binding.query(ast.param, ast.source.value);
                    break;
                case CONST:
                    break;
                case MEMBER:
                    var target = ast.target.value;
                    var name = ast.member.value || ast.member;
                    ast.value = binding.member(target, name);
                    break;
                case AWAIT:
                    ast.value = binding.await(ast.expr.value);
                    break;
                case RANGE:
                    var first = ast.from.value;
                    var last = ast.to.value;
                    if (first === void 0 || last === void 0)
                        return void 0;
                    ast.value = new Range(first, last);
                    break;
                case BINARY:
                    var source;
                    switch (ast.op) {
                        case "->":
                            source = ast.left.value;

                            if (source === void 0 || !source.valueOf())
                                return void 0;

                            ast.value = ast.right.compiled.execute(binding, context);
                            break;
                        case WHERE:
                            source = ast.left.value;
                            let length = source.length;
                            var result = [];
                            for (var i = 0; i < length; i++) {
                                var item = binding.member(source, i);
                                var scope = new Scope(binding, [item, context]);
                                var b = accept(ast.right, binding, scope).valueOf();
                                if (b)
                                    result.push(item);
                            }
                            ast.value = result;
                            break;
                        default:
                            var left = ast.left.value;
                            var right = ast.right.value;
                            ast.value = binding.app(ast.op, [right, left]);
                            break;
                    }
                    break;
                case APP:
                    let args;
                    let length = ast.args.length;
                    for (let i = 0; i < length; i++) {
                        var arg = ast.args[i].value;
                        if (arg === void 0)
                            return arg;
                        if (!args) args = [arg];
                        else args.push(arg);
                    }
                    var fun = ast.fun.value;
                    if (fun === void 0) {
                        console.error("could not resolve expression, " + JSON.stringify(ast.fun));
                        return void 0;
                    } else
                        ast.value = binding.app(fun, args);
                    break;
                default:
                    throw Error("unsupported ast type " + ast.type);
            }

            if (ast.value === void 0)
                return void 0;
        }

        return this.ast.value;
    }

    static compile(ast) {
        var queue = [];
        Expression.compileAst(ast, queue);
        return new Expression(ast, queue);
    }

    static compileAst(ast, stack: any[]) {
        const compile = Expression.compileAst;
        if (typeof ast === "object") {
            switch (ast.type) {
                case IDENT:
                    switch (ast.name) {
                        case "null":
                            ast.type = CONST;
                            ast.value = null;
                            break;
                        case "true":
                            ast.type = CONST;
                            ast.value = true;
                            break;
                        case "false":
                            ast.type = CONST;
                            ast.value = false;
                            break;
                        case "no":
                        case "empty":
                            ast.type = CONST;
                            ast.value = empty;
                            break;
                        case "count":
                            ast.type = CONST;
                            ast.value = count;
                            break;
                        case "not":
                            ast.type = CONST;
                            ast.value = not;
                            break;
                        default:
                            stack.push(ast);
                            break;
                    }
                    break;
                case QUERY:
                    stack.push(ast);
                    compile(ast.source, stack);
                    break;
                case MEMBER:
                    stack.push(ast);
                    compile(ast.target, stack);
                    compile(ast.member, stack);
                    break;
                case AWAIT:
                    stack.push(ast);
                    compile(ast.expr, stack);
                    // return visitor.await(accept(ast.expr, visitor, context));
                    break;
                case RANGE:
                    stack.push(ast);
                    compile(ast.from, stack);
                    compile(ast.to, stack);
                    break;
                case CONST:
                    stack.push(ast);
                    break;
                case BINARY:
                    stack.push(ast);
                    switch (ast.op) {
                        case "->":
                        case WHERE:
                            ast.right.compiled = Expression.compile(ast.right);
                            compile(ast.left, stack);
                            break;
                        default:
                            compile(ast.right, stack);
                            compile(ast.left, stack);
                            break;
                    }
                    break;
                case APP:
                    stack.push(ast);
                    compile(ast.fun, stack);
                    var length = ast.args.length;
                    for (let i = 0; i < length; i++) {
                        compile(ast.args[i], stack);
                    }
                    break;
                default:
                    throw Error("unsupported ast type " + ast.type);
            }
        }
    }
}

export function accept(ast: any, visitor: IAstVisitor, context) {
    var length;
    switch (ast.type) {
        case IDENT:
            switch (ast.name) {
                case "null":
                    return null;
                case "true":
                    return true;
                case "false":
                    return false;
                case "no":
                case "empty":
                    return empty;
                case "count":
                    return count;
                case "not":
                    return not;
                default:
                    return visitor.member(context, ast.name);
            }
        case MEMBER:
            var target = accept(ast.target, visitor, context);
            var name = accept(ast.member, visitor, context);
            return visitor.member(target, name);
        case CONST:
            return visitor.const(ast.value);
        case BINARY:
            var source;
            switch (ast.op) {
                case "->":
                    source = accept(ast.left, visitor, context);

                    if (source === void 0)
                        return void 0;

                    return source.valueOf() ? accept(ast.right, visitor, context) : void 0;
                case WHERE:
                    source = accept(ast.left, visitor, context);
                    length = source.length;
                    var result = [];
                    for (var i = 0; i < length; i++) {
                        var item = visitor.member(source, i);
                        var scope = new Scope(visitor, [item, context]);
                        var b = accept(ast.right, visitor, scope).valueOf();
                        if (b)
                            result.push(item);
                    }
                    return result;
                default:
                    var left = accept(ast.left, visitor, context);
                    var right = accept(ast.right, visitor, context);

                    if (left === void 0 || right === void 0)
                        return void 0;

                    return visitor.app(ast.op, [right, left]);
            }

        case APP:
            let args;
            length = ast.args.length;
            for (let i = 0; i < length; i++) {
                var arg = accept(ast.args[i], visitor, context);
                if (arg === void 0)
                    return arg;
                if (!args) args = [arg];
                else args.push(arg);
            }
            var fun = accept(ast.fun, visitor, context);
            if (fun === void 0) {
                console.error("could not resolve expression, " + JSON.stringify(ast.fun));
                return void 0;
            } else
                return visitor.app(fun, args);
        case QUERY:
            return visitor.query(ast.param, accept(ast.source, visitor, context));
        case SELECT:
            return visitor.select(accept(ast.source, visitor, context), s => accept(ast.selector, visitor, s));
        case WHERE:
            return visitor.where(accept(ast.source, visitor, context), accept(ast.predicate, visitor, context));
        case RANGE:
            var first = accept(ast.from, visitor, context);
            var last = accept(ast.to, visitor, context);
            if (first === void 0 || last === void 0)
                return void 0;
            return new Range(first.valueOf(), last.valueOf());
        case AWAIT:
            return visitor.await(accept(ast.expr, visitor, context));
        case LAMBDA:
            return model => {
                var context = visitor.extend(ast.param, model);
                return accept(ast.body, visitor, context);
            }
        default:
            return ast;
    }
}

class Range {
    constructor(private first, private last) {
    }

    map(fn) {
        var result = [], last = this.last;
        for (var i = this.first; i <= last; i++) {
            result.push(fn(i));
        }
        return result;
    }
}

export default function compile(expr) {
    return Expression.compile(peg.parse(expr));
}

export function parse(expr) {
    return peg.parse(expr);
}

export class Scope {
    constructor(private visitor: IAstVisitor, private contexts: any[]) {
    }

    get(name: string) {
        var visitor = this.visitor;
        var contexts = this.contexts;
        for (var i = 0; i < this.contexts.length; i++) {
            var value = visitor.member(contexts[i], name);
            if (value !== void 0)
                return value;
        }

        return void 0;
    }
}

export var TOKENS = { WHERE, QUERY, IDENT, MEMBER, APP, SELECT, CONST, RANGE, BINARY, AWAIT, PIPE, COMPOSE }