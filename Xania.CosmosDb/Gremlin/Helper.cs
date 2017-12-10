using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Xania.CosmosDb.AST;

namespace Xania.CosmosDb.Gremlin
{
    public static class Helper
    {
        public static IGremlinExpr ToGremlin(IExpr expression)
        {
            if (expression == null)
                return null;
            if (expression is Where where)
            {
                var parameter = where.Predicate.Parameters[0];
                var predicate = ToGremlin(where.Predicate);
                var source = ToGremlin(where.Source);
                //var (head, tail) = HeadTail(predicate);
                //if (head is Select select && select.Label.Equals(parameter.Name))
                //{
                //    if (tail == null)
                //        return source;
                //    return Bind(source, tail);
                //}
                return new Bind(Unfold(source).Concat(new []{ As(parameter.Name), Call("where", predicate) }).ToArray());
            }
            if (expression is AST.Vertex vertex)
                return Call("hasLabel", Const(vertex.Label));
            if (expression is Lambda lambda)
                return ToGremlin(lambda.Body);
            if (expression is Compose compose)
                return Bind(ToGremlin(compose.Source), ToGremlin(compose.Expr));
            if (expression is Parameter param)
                return new Select(param.Name);
            if (expression is Equal equal)
                return Call("has", Const(equal.PropertyName), ToGremlin(equal.Right));
            if (expression is Constant cons)
                return Const(cons.Value);
                // return $"has('{PropertyName}', {Right.ToGremlin()})";
            if (expression is AST.Member member)
                return Member(ToGremlin(member.Target), member.Name);
            if (expression is SelectMany selectMany)
            {
                var sourceParam = selectMany.Selector.Parameters[0];
                var collectionParam = selectMany.Selector.Parameters[1];

                var selector = ToGremlin(selectMany.Selector);
                var source = ToGremlin(selectMany.Source);
                var collection = ToGremlin(selectMany.Collection);
                // if (collectionParam == selector.Body)
                //    return new Bind(source.Concat(Unfold(ToGremlin(collection))).ToArray());

                // $"{Source.ToGremlin()}.as('{sourceParam.Name}')
                //   .{ Collection.ToGremlin()}.as('{collectionParam.Name}')
                //   .{Selector.ToGremlin()}";

                return new Bind(
                    Unfold(source)
                        .Concat(Unfold(As(sourceParam.Name)))
                        .Concat(Unfold(collection))
                        .Concat(Unfold(As(collectionParam.Name)))
                        .Concat(Unfold(selector))
                        .ToArray()
                );
            }
            if (expression is AST.Term term)
                return new Term(term.Expression);

            throw new NotImplementedException($"ToGremlin {expression}");
        }

        private static IEnumerable<IGremlinExpr> Unfold(IGremlinExpr expr)
        {
            if (expr is Bind bind)
                foreach (var child in bind.Expressions.SelectMany(Unfold))
                {
                    yield return child;
                }
            else
                yield return expr;
        }

        private static IGremlinExpr Member(IGremlinExpr target, string name)
        {
            return Bind(target, Call("out", Const(name)));
        }

        private static (IGremlinExpr, IEnumerable<IGremlinExpr>) HeadTail(IGremlinExpr expr)
        {
            if (expr is Bind bind)
            {
                var (head, tail1) = HeadTail(bind.Expressions[0]);
                var tail2 = bind.Expressions.Skip(1);
                return (head, tail1.Concat(tail2));
            }
            return (expr, Enumerable.Empty<IGremlinExpr>());
        }

        private static IGremlinExpr As(string name)
        {
            return Call("as", Const(name));
        }

        private static IGremlinExpr Term(string value)
        {
            return new Term(value);
        }

        private static IGremlinExpr Const(object value)
        {
            return new Const(value);
        }

        public static Call Call(string methodName, params IGremlinExpr[] expressions)
        {
            return new Call(methodName, expressions);
        }

        public static Bind Bind(IGremlinExpr expr1, IGremlinExpr expr2)
        {
            return new Bind(new [] {expr1, expr2});
        }

        public static Bind Bind(IGremlinExpr head, IEnumerable<IGremlinExpr> expressions)
        {
            if (head is Bind bind)
                return new Bind(bind.Expressions.Concat(expressions).ToArray());
            var list = new List<IGremlinExpr> {head};
            foreach (var expr in expressions)
                list.Add(expr);
            return new Bind(list.ToArray());
        }
    }

    internal class Const : IGremlinExpr
    {
        private readonly object _value;

        public Const(object value)
        {
            _value = value;
        }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(_value);
        }
    }
}
