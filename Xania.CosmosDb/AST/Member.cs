using System;

namespace Xania.CosmosDb.AST
{
    internal class Member : IExpr
    {
        public IExpr Target { get; }
        public string Name { get; }

        public Member(IExpr target, string name)
        {
            Target = target;
            Name = name;
        }

        public IExpr Where(Lambda predicate)
        {
            throw new NotImplementedException();
        }

        public IExpr SelectMany(IExpr collectionExpr, IExpr step1)
        {
            throw new NotImplementedException();
        }
    }

}
