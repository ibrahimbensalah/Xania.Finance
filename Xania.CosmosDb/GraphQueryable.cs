﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Xania.CosmosDb
{
    public class GraphQueryable<TModel> : IQueryable<TModel>
    {
        public GraphQueryable(Client client)
        {
            Provider = new GraphQueryProvider(client);
            Expression = Expression.Constant(this);
        }

        public GraphQueryable(GraphQueryProvider queryProvider, Expression expression)
        {
            Provider = queryProvider;
            Expression = expression;
        }

        public IEnumerator<TModel> GetEnumerator()
        {
            return Provider.Execute<IEnumerable<TModel>>(Expression).GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public Expression Expression { get; }
        public Type ElementType { get; } = typeof(TModel);
        public GraphQueryProvider Provider { get; }
        IQueryProvider IQueryable.Provider => Provider;
    }
}