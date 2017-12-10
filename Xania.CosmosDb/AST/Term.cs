namespace Xania.CosmosDb.AST
{
    internal class Term: IExpr
    {
        public string Expression { get; }

        public Term(string expression)
        {
            Expression = expression;
        }

        public string ToGremlin()
        {
            return Expression.ToString();
        }
    }
}
