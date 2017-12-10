namespace Xania.CosmosDb.AST
{
    public interface IExpr
    {
    }

    public interface ITraversal: IExpr
    {
        Selector Selector { get; }
    }

    public class Selector: IExpr
    {
    }
}
