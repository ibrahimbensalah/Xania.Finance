﻿interface IAstVisitor {
    where(source, predicate);
    select(source, selector);
    query(param, source);
    member(target, name);
    app(fun, args: any[]);
    const(value);
}

declare function require(module: string);

var peg = require("./fsharp.peg");

// var fsharp = peg.parse;

export function accept(ast: any, visitor: IAstVisitor, context) {
    if (ast === null || ast === undefined)
        return null;

    if (ast.type === undefined)
        return ast;

    switch (ast.type) {
        case "where":
            return visitor.where(accept(ast.source, visitor, context), accept(ast.predicate, visitor, context));
        case "query":
            return visitor.query(ast.param, accept(ast.source, visitor, context));
        case "ident":
            return visitor.member(context, ast.name);
        case "member":
            return visitor.member(accept(ast.target, visitor, context), accept(ast.member, visitor, context));
        case "app":
            const args = [];
            for (let i = 0; i < ast.args.length; i++) {
                args.push(accept(ast.args[i], visitor, context));
            }
            return visitor.app(accept(ast.fun, visitor, context), args);
        case "select":
            return visitor.select(accept(ast.source, visitor, context), s => accept(ast.selector, visitor, s));
        case "const":
            return visitor.const(ast.value);
        default:
            throw new Error(`not supported type ${ast.type}`);
    }
}

export var fsharp = peg.parse;
