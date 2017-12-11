using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using Xania.CosmosDb.Gremlin;
using Xania.Reflection;

namespace Xania.CosmosDb
{
    public class CosmosQueryContext
    {
        public static string ToGremlin(Expression expression)
        {
            return $"g.V().{Evaluate(expression)}";
            // return $"g.V().{step.ToGremlin()}.{GetGremlinSelector(step)}";
        }

        //private static string GetGremlinSelector(Traversal expr)
        //{
        //    if (expr is Where where)
        //        return GetGremlinSelector(where.Source);
        //    if (expr is AST.Vertex)
        //        return "union(identity(), outE())";
        //    if (expr is AST.SelectMany many)
        //        return GetLambdaSelector(many.Selector.Body);
        //    throw new NotImplementedException($"step {expr.GetType().Name}");
        //}

        //private static string GetLambdaSelector(Traversal expr)
        //{
        //    if (expr is Parameter param)
        //        return $"union(identity(), select('{param.Name}').outE())";
        //    if (expr is Member member)
        //        return $"union(identity(), identity().outE())";
        //    throw new NotImplementedException($"step {expr.GetType().Name}");
        //}

        public static Traversal Evaluate(Expression expression)
        {
            /**
             * Evaluate expression
             */
            var values = new Stack<Traversal>();
            foreach (var oper in GetOperators(expression).Reverse())
            {
                var args = PopValues(values, oper.Item1).ToArray();
                var expr = oper.Item2(args);
                values.Push(expr);
            }

            return values.Single();
        }

        private static Traversal[] PopValues(Stack<Traversal> values, int operCount)
        {
            var arr = new Traversal[operCount];
            for (var i = operCount - 1; i >= 0; i--)
            {
                arr[i] = values.Pop();
            }
            return arr;
        }

        private static IEnumerable<(int, Func<Traversal[], Traversal>)> GetOperators(Expression root)
        {
            var cache = new Dictionary<ParameterExpression, Traversal>();
            var stack = new Stack<Expression>();
            stack.Push(root);
            while (stack.Count > 0)
            {
                var item = stack.Pop();
                if (item is MethodCallExpression methodCall)
                {
                    var methodName = methodCall.Method.Name;
                    if (methodName.Equals("Where"))
                    {
                        var lambda = GetSingleParameterLambda(methodCall, stack);
                        stack.Push(methodCall.Arguments[0]);
                        stack.Push(lambda);
                        yield return (2, args => Where(args[0].Append(Helper.As(lambda.Parameters[0].Name)), args[1]));
                    }
                    else if (methodName.Equals("SelectMany"))
                    {
                        stack.Push(methodCall.Arguments[0]);
                        stack.Push(methodCall.Arguments[1]);
                        stack.Push(methodCall.Arguments[2]);
                        yield return (3, SelectMany);
                    }
                    else
                        throw new NotSupportedException($"Method call {methodCall.Method.Name}");
                }
                else if (item is UnaryExpression unaryExpression)
                {
                    stack.Push(unaryExpression.Operand);
                }
                else if (item is LambdaExpression lambda)
                {
                    foreach (var p in lambda.Parameters)
                        stack.Push(p);
                    stack.Push(lambda.Body);
                    yield return (lambda.Parameters.Count + 1, Lambda);
                }
                else if (item is BinaryExpression binaryExpression)
                {
                    stack.Push(binaryExpression.Left);
                    stack.Push(binaryExpression.Right);
                    yield return (2, args => Binary(binaryExpression.NodeType, args[0], args[1]));
                }
                else if (item is ParameterExpression param)
                {
                    yield return (0, _ => Cache(cache, param, Parameter));
                }
                else if (item is ConstantExpression constantExpression)
                {
                    var value = constantExpression.Value;
                    if (value != null)
                    {
                        var valueType = value.GetType();
                        var queryableType = typeof(GraphQueryable<>).MapTo(valueType);
                        if (queryableType != null)
                        {
                            var itemType = queryableType.GenericTypeArguments[0];
                            yield return (0, _ => Helper.Vertex(itemType.Name.ToCamelCase()));
                        }
                        else if (valueType.IsPrimitive || value is string)
                        {
                            yield return (0, _ => Helper.Const(constantExpression.Value).ToTraversal());
                        }
                        else
                        {
                            throw new NotImplementedException();
                        }
                    }
                }
                else if (item is MemberExpression memberExpression)
                {
                    if (IsAnonymousType(memberExpression.Expression.Type))
                        yield return (0, args => null);
                    else
                    {
                        var isPrimitive = Graph.IsPrimitive(memberExpression.Type);

                        var memberName = memberExpression.Member.Name.ToCamelCase();
                        stack.Push(memberExpression.Expression);


                        yield return (1, args =>
                            isPrimitive ? args[0].Append(Helper.Values(memberName)) : args[0].Append(Helper.Relation(memberName)));
                    }

                    //if (!(memberExpression.Expression is ParameterExpression))
                    //{
                    //    yield return new Format("out('{0}')") {Count = 1};
                    //    stack.Push(memberExpression.Expression);
                    //}
                }
                else if (item is NewExpression newExpression)
                {
                    if (!IsAnonymousType(newExpression.Type))
                        throw new NotSupportedException($"GetOperators {newExpression}");

                    foreach (var arg in newExpression.Arguments)
                        stack.Push(arg);

                    yield return (newExpression.Arguments.Count, args => Traversal.Empty);
                }
                else
                {
                    throw new NotImplementedException($"GetOperators {item}");
                    // yield return new Term($"[[{item.GetType()}]]");
                }
            }
        }

        private static bool IsAnonymousType(Type type)
        {
            return type.CustomAttributes.Select(e => e.AttributeType).Contains(typeof(CompilerGeneratedAttribute));
        }

        private static Traversal Parameter(ParameterExpression parameter)
        {
            //if (IsAnonymousType(parameter.Type))
            //    return new Compose(null, null);

            return new Select(parameter.Name).ToTraversal();
        }

        private static Traversal Lambda(Traversal[] args)
        {
            return args.Last();
            // return new Lambda(args.Take(args.Length - 1).Cast<Parameter>().ToArray(), args.Last());
        }

        private static Traversal SelectMany(Traversal[] args)
        {
            var source = args[0];
            var collection = args[1];
            var selector = args[2];

            throw new NotImplementedException("SelectMany");

            //var sourceParam = selector.Parameters[0];
            //var collectionParam = selector.Parameters[1];

            // if (collectionParam == selector.Body)
            //    return new Bind(source.Concat(Unfold(ToGremlin(collection))).ToArray());

            // $"{Source.ToGremlin()}.as('{sourceParam.Name}')
            //   .{ Collection.ToGremlin()}.as('{collectionParam.Name}')
            //   .{Selector.ToGremlin()}";

            // return source.Append(Helper.As(sourceParam.Name));

            //return new Bind(
            //    Unfold(source)
            //        .Concat(Unfold(As(sourceParam.Name)))
            //        .Concat(Unfold(collection))
            //        .Concat(Unfold(As(collectionParam.Name)))
            //        .Concat(Unfold(selector))
            //        .ToArray()
            //);

            // return new SelectMany(args[0], (Lambda)args[1], (Lambda)args[2]);
        }

        private static Traversal Where(Traversal source, Traversal predicate)
        {
            return source.Append(Helper.Scope("where", predicate));
            //var parameter = predicate.Parameters[0];
            // var predicate = ToGremlin(where.Predicate);
            //var (head, tail) = HeadTail(predicate);
            //if (head is Select select && select.Label.Equals(parameter.Name))
            //{
            //    if (tail == null)
            //        return source;
            //    return Bind(source, tail);
            //}
            // return new Bind(Unfold(source).Concat(new[] { As(parameter.Name), Call("where", predicate) }).ToArray());
            // return new Where((AST.Vertex)args[0], (Lambda)args[1]);
        }

        private static Traversal Binary(ExpressionType oper, Traversal left, Traversal right)
        {
            // return Call("has", Const(equal.PropertyName), ToGremlin(equal.Right));
            if (oper == ExpressionType.Equal)
            {
                if (left.Steps.Last() is Values values)
                    return new Traversal(left.Steps.Take(left.Steps.Count() - 1)).Append(new Call("has", right.Steps.Prepend(new Const(values.Name))));

                return left.Append(new Call("has", right.Steps));
            }
            throw new NotImplementedException();
        }

        private static TValue Cache<TKey, TValue>(Dictionary<TKey, TValue> cache, TKey key, Func<TKey, TValue> func)
        {
            if (!cache.TryGetValue(key, out var result))
                cache.Add(key, result = func(key));

            return result;
        }

        private static LambdaExpression GetSingleParameterLambda(MethodCallExpression methodCall, Stack<Expression> stack)
        {
            if (methodCall.Arguments[1] is UnaryExpression unaryExpression)
            {
                if (unaryExpression.Operand is LambdaExpression lambda)
                {
                    if (lambda.Parameters.Count != 1)
                        throw new NotSupportedException("Parameters count more 1.");

                    return lambda;
                }
                throw new NotSupportedException("Where second argument not supported.");
            }
            else
            {
                throw new NotSupportedException("Where second argument not supported.");
            }
        }
    }

    public class Traversal
    {
        public IEnumerable<IGremlinExpr> Steps { get; }

        public Traversal(IGremlinExpr step)
            : this(new[] { step })
        {
        }

        public Traversal(IEnumerable<IGremlinExpr> steps)
        {
            Steps = steps;
        }

        public override string ToString()
        {
            return string.Join(".", Steps.Select(e => e.ToString()));
        }

        public static readonly Traversal Empty = new Traversal(Enumerable.Empty<IGremlinExpr>());

        public Traversal Append(IGremlinExpr expr)
        {
            return new Traversal(Steps.Append(expr));
        }
    }
}