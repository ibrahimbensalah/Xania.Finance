using System.Linq;

namespace Xania.CosmosDb.AST
{
    public class Lambda : IExpr
    {
        public Parameter[] Parameters { get; }
        public IExpr Body { get; }

        public Lambda(Parameter[] parameters, IExpr body)
        {
            Parameters = parameters;
            Body = body;
        }

        public bool IsIdentity()
        {
            return Parameters.Length == 1 && Parameters[0] == Body;
        }

        public string ToGremlin()
        {
            return $"{Body.ToGremlin()}";
        }
    }
}