using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Xania.CosmosDb.Gremlin
{

    public interface IGremlinExpr
    {
    }

    public class Call : IGremlinExpr
    {
        private readonly string _methodName;
        private readonly IGremlinExpr[] _expressions;

        public Call(string methodName, IGremlinExpr[] expressions)
        {
            _methodName = methodName;
            _expressions = expressions;
        }

        public override string ToString()
        {
            return $"{_methodName}({string.Join(",", _expressions.Select(e => e.ToString()))})";
        }
    }

    public class Bind : IGremlinExpr
    {
        public IGremlinExpr[] Expressions { get; }

        public Bind(IGremlinExpr[] expressions)
        {
            Expressions = expressions;
        }

        public override string ToString()
        {
            return string.Join(".", Expressions.Select(e => e.ToString()));
        }
    }
}
