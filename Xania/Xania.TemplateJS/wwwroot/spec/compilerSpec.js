"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var reactive_1 = require("../src/reactive");
var fsharp_1 = require("../src/fsharp");
var observables_1 = require("../src/observables");
var ibrahim = {
    age: 36,
    firstName: "Ibrahim",
    lastName: "ben Salah",
    adult: true
};
describe("fsharp parser", function () {
    it(':: fun x -> x ', function () {
        var ast = fsharp_1.fsharp("fun x -> x");
        expect(ast).toBeDefined();
        var compose = ast;
        expect(compose.type).toBe("lambda");
        expect(compose.param).toBe("x");
        expect(compose.body.name).toBe("x");
    });
    it(':: .firstName ', function () {
        var ast = fsharp_1.fsharp(".firstName");
        expect(ast).toBeDefined();
        var compose = ast;
        expect(compose.type).toBe("lambda");
        expect(compose.param).toBe("x");
        expect(compose.body.target.name).toBe("x");
        expect(compose.body.member.name).toBe("firstName");
    });
    it(':: 1 + 2', function () {
        var ast = fsharp_1.fsharp("1 + 2");
        expect(ast).toBeDefined();
        var expr = ast;
        expect(expr.type).toBe(fsharp_1.TOKENS.BINARY);
    });
    it(':: fn a', function () {
        var ast = fsharp_1.fsharp("fun a");
        expect(ast).toBeDefined();
        var expr = ast;
        expect(expr.type).toBe(fsharp_1.TOKENS.APP);
        expect(expr.fun).toEqual({ type: fsharp_1.TOKENS.IDENT, name: 'fun' });
        expect(expr.args).toEqual([{ type: fsharp_1.TOKENS.IDENT, name: "a" }]);
    });
    it(':: fn ()', function () {
        var ast = fsharp_1.fsharp("fun ()");
        expect(ast).toBeDefined();
        var expr = ast;
        expect(expr.type).toBe(fsharp_1.TOKENS.APP);
        expect(expr.fun).toEqual({ type: fsharp_1.TOKENS.IDENT, name: 'fun' });
        expect(expr.args.length).toBe(0);
    });
    it(':: (+) a b', function () {
        var ast = fsharp_1.fsharp("(+) a b");
        expect(ast).toBeDefined();
        var expr = ast;
        expect(expr).toEqual({ "type": fsharp_1.TOKENS.APP, "fun": "+", "args": [{ "type": fsharp_1.TOKENS.IDENT, "name": "a" }, { "type": fsharp_1.TOKENS.IDENT, "name": "b" }] });
    });
    it(':: a |> b |> c', function () {
        var ast = fsharp_1.fsharp("a |> b |> c");
        expect(ast).toBeDefined();
        var pipe1 = ast;
        expect(pipe1.type).toBe(fsharp_1.TOKENS.BINARY);
        expect(pipe1.op).toBe("|>");
        expect(pipe1.right).toEqual({ "type": fsharp_1.TOKENS.IDENT, "name": "c" });
        var pipe2 = pipe1.left;
        expect(pipe2.type).toBe(fsharp_1.TOKENS.BINARY);
        expect(pipe2.op).toBe("|>");
        expect(pipe2.right).toEqual({ "type": fsharp_1.TOKENS.IDENT, "name": "b" });
        expect(pipe2.left).toEqual({ "type": fsharp_1.TOKENS.IDENT, "name": "a" });
    });
    it(':: a + b |> c', function () {
        var ast = fsharp_1.fsharp("a + b |> c");
        expect(ast).toBeDefined();
        var pipe = ast;
        expect(pipe.type).toBe(fsharp_1.TOKENS.BINARY);
        expect(pipe.op).toBe("|>");
        expect(pipe.right).toEqual({ type: fsharp_1.TOKENS.IDENT, name: "c" });
        var add = pipe.left;
        expect(add.right.name).toBe("b");
        expect(add.left.name).toBe("a");
    });
    it(':: a >> b ', function () {
        var ast = fsharp_1.fsharp("a >> b");
        expect(ast).toBeDefined();
        var compose = ast;
        expect(compose.type).toBe(fsharp_1.TOKENS.COMPOSE, JSON.stringify(ast, null, 2));
        expect(compose.fun).toBe(">>", JSON.stringify(ast, null, 2));
        expect(compose.args[0].name).toBe("b", JSON.stringify(compose.args[0], null, 2));
        expect(compose.args[1].name).toBe("a", JSON.stringify(compose.args[1], null, 2));
    });
    it(':: a.b ', function () {
        var ast = fsharp_1.fsharp("a.b");
        expect(ast).toBeDefined();
        var compose = ast;
        expect(compose.type).toBe(fsharp_1.TOKENS.MEMBER, JSON.stringify(ast, null, 2));
        expect(compose.target.name).toBe("a", JSON.stringify(ast, null, 2));
        expect(compose.member).toBe("b", JSON.stringify(ast, null, 2));
    });
    it(':: [1..n] ', function () {
        var ast = fsharp_1.fsharp("[1..n]");
        expect(ast).toBeDefined();
        var range = ast;
        expect(range.type).toBe(fsharp_1.TOKENS.RANGE, JSON.stringify(ast, null, 2));
        expect(range.from.value).toBe(1, JSON.stringify(ast, null, 2));
        expect(range.to.name).toBe("n", JSON.stringify(ast, null, 2));
    });
    it(':: for p in people where p.adult ', function () {
        var ast = fsharp_1.fsharp("for p in people where p.adult");
        expect(ast).toBeDefined();
        var where = ast;
        expect(where.type).toBe(fsharp_1.TOKENS.WHERE);
        expect(where.predicate.type).toBe(fsharp_1.TOKENS.MEMBER);
        expect(where.source.type).toBe(fsharp_1.TOKENS.QUERY);
    });
    it(":: empty list -> 'list is empty' ", function () {
        var rule = fsharp_1.fsharp("empty list -> 'list is empty'");
        expect(rule).toBeDefined();
        expect(rule.type).toBe(fsharp_1.TOKENS.BINARY);
        expect(rule.op).toBe("->");
        expect(rule.right.value).toBe('list is empty');
    });
    it(':: regression test', function () {
        var start = new Date().getTime();
        var ast = fsharp_1.fsharp("a |> b.c >> (+) 1 |> d");
        for (var i = 0; i < 1000; i++) {
            fsharp_1.fsharp("a |> b >> (+) 1 |> d");
        }
        var elapsed = new Date().getTime() - start;
        if (elapsed > 2000)
            fail("too slow");
        expect(ast).toEqual({
            "type": fsharp_1.TOKENS.BINARY,
            "op": "|>",
            "right": {
                "type": fsharp_1.TOKENS.IDENT,
                "name": "d"
            },
            "left": {
                "type": fsharp_1.TOKENS.BINARY,
                "op": "|>",
                "right": {
                    "type": fsharp_1.TOKENS.COMPOSE,
                    "fun": ">>",
                    "args": [
                        {
                            "type": fsharp_1.TOKENS.APP,
                            "fun": "+",
                            "args": [
                                {
                                    "type": fsharp_1.TOKENS.CONST,
                                    "value": 1
                                }
                            ]
                        },
                        {
                            "type": fsharp_1.TOKENS.MEMBER,
                            "target": {
                                "type": fsharp_1.TOKENS.IDENT,
                                "name": "b"
                            },
                            "member": "c"
                        }
                    ]
                },
                "left": {
                    "type": fsharp_1.TOKENS.IDENT,
                    "name": "a"
                }
            }
        });
    });
});
var TestBinding = (function (_super) {
    __extends(TestBinding, _super);
    function TestBinding(ast) {
        var _this = _super.call(this) || this;
        _this.ast = ast;
        return _this;
    }
    TestBinding.prototype.render = function (context) {
        this.context = context;
        return this.value = fsharp_1.accept(this.ast, this, context).valueOf();
    };
    TestBinding.prototype.app = function (fun, args) {
        if (fun === "assign") {
            var value = args[0].valueOf();
            args[1].set(value);
            return value;
        }
        return _super.prototype.app.call(this, fun, args);
    };
    return TestBinding;
}(reactive_1.Reactive.Binding));
describe("runtime", function () {
    it("expression dependencies", function () {
        var store = new reactive_1.Reactive.Store({ p: ibrahim });
        var binding = new TestBinding(fsharp_1.fsharp("p.firstName"));
        binding.render(store);
        expect(binding.value).toBe("Ibrahim");
        store.get("p").get("firstName").set("Mr Ibraihm");
        expect(binding.value).toBe("Mr Ibraihm");
    });
    it("consistent variable identity", function () {
        var store = new reactive_1.Reactive.Store({ p: ibrahim });
        var binding = new TestBinding(fsharp_1.fsharp("p"));
        expect(binding.render(store)).toBe(binding.render(store));
    });
    it("consistent member identity", function () {
        var store = new reactive_1.Reactive.Store({ xania: { owner: ibrahim } });
        var binding = new TestBinding(fsharp_1.fsharp("xania.owner"));
        expect(binding.render(store)).toBe(binding.render(store));
    });
    it("consistent query identity", function () {
        var store = new reactive_1.Reactive.Store({ xania: { employees: [ibrahim] } });
        var binding = new TestBinding(fsharp_1.fsharp("for e in xania.employees"));
        expect(binding.render(store)[0]).toBe(binding.render(store)[0], "not identical");
    });
    it("assign expression", function () {
        var store = new reactive_1.Reactive.Store({ x: 1, y: 2, sum: 0 });
        var binding = new TestBinding(fsharp_1.fsharp("sum <- x + y"));
        binding.render(store);
        expect(store.get("sum").valueOf()).toBe(3);
    });
    it('await observable', function () {
        var observable = new observables_1.Observables.Observable(123);
        var store = new reactive_1.Reactive.Store({ observable: observable });
        var binding = new TestBinding(fsharp_1.fsharp("await observable"));
        binding.render(store);
        expect(binding.value).toBe(123);
        observable.notify(456);
        expect(binding.value).toBe(456);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJTcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tcGlsZXJTcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLDRDQUFpRDtBQUNqRCx3Q0FBNkQ7QUFDN0Qsa0RBQWlEO0FBSWpELElBQUksT0FBTyxHQUFZO0lBQ25CLEdBQUcsRUFBRSxFQUFFO0lBQ1AsU0FBUyxFQUFFLFNBQVM7SUFDcEIsUUFBUSxFQUFFLFdBQVc7SUFDckIsS0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDO0FBRUYsUUFBUSxDQUFDLGVBQWUsRUFBRTtJQUV0QixFQUFFLENBQUMsZ0JBQWdCLEVBQ2Y7UUFDSSxJQUFJLEdBQUcsR0FBRyxlQUFFLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRTFCLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUNsQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFFUCxFQUFFLENBQUMsZ0JBQWdCLEVBQ2Y7UUFDSSxJQUFJLEdBQUcsR0FBRyxlQUFFLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRTFCLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUNsQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdkQsQ0FBQyxDQUFDLENBQUM7SUFFUCxFQUFFLENBQUMsVUFBVSxFQUNUO1FBQ0ksSUFBSSxHQUFHLEdBQUcsZUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUUxQixJQUFJLElBQUksR0FBRyxHQUFHLENBQUM7UUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFFUCxFQUFFLENBQUMsU0FBUyxFQUNSO1FBQ0ksSUFBSSxHQUFHLEdBQUcsZUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUUxQixJQUFJLElBQUksR0FBRyxHQUFHLENBQUM7UUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsZUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUM5RCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLGVBQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuRSxDQUFDLENBQUMsQ0FBQztJQUVQLEVBQUUsQ0FBQyxVQUFVLEVBQ1Q7UUFDSSxJQUFJLEdBQUcsR0FBRyxlQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRTFCLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxlQUFNLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUMsQ0FBQztJQUVQLEVBQUUsQ0FBQyxZQUFZLEVBQ1g7UUFDSSxJQUFJLEdBQUcsR0FBRyxlQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRTFCLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsZUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLGVBQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLGVBQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lB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SUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWhDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDcEMsQ0FBQyxDQUFDLENBQUM7QUFFWCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvQHR5cGVzL2phc21pbmUvaW5kZXguZC50c1wiIC8+XHJcblxyXG5pbXBvcnQgeyBSZWFjdGl2ZSBhcyBSZSB9IGZyb20gXCIuLi9zcmMvcmVhY3RpdmVcIjtcclxuaW1wb3J0IHsgZnNoYXJwIGFzIGZzLCBhY2NlcHQsIFRPS0VOUyB9IGZyb20gXCIuLi9zcmMvZnNoYXJwXCI7XHJcbmltcG9ydCB7IE9ic2VydmFibGVzIH0gZnJvbSBcIi4uL3NyYy9vYnNlcnZhYmxlc1wiO1xyXG5cclxuaW50ZXJmYWNlIElQZXJzb24geyBmaXJzdE5hbWU6IHN0cmluZzsgbGFzdE5hbWU6IHN0cmluZzsgYWR1bHQ6IGJvb2xlYW4sIGFnZTogbnVtYmVyIH1cclxuXHJcbnZhciBpYnJhaGltOiBJUGVyc29uID0ge1xyXG4gICAgYWdlOiAzNixcclxuICAgIGZpcnN0TmFtZTogXCJJYnJhaGltXCIsXHJcbiAgICBsYXN0TmFtZTogXCJiZW4gU2FsYWhcIixcclxuICAgIGFkdWx0OiB0cnVlXHJcbn07XHJcblxyXG5kZXNjcmliZShcImZzaGFycCBwYXJzZXJcIiwgKCkgPT4ge1xyXG5cclxuICAgIGl0KCc6OiBmdW4geCAtPiB4ICcsXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgYXN0ID0gZnMoXCJmdW4geCAtPiB4XCIpO1xyXG4gICAgICAgICAgICBleHBlY3QoYXN0KS50b0JlRGVmaW5lZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvbXBvc2UgPSBhc3Q7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb21wb3NlLnR5cGUpLnRvQmUoXCJsYW1iZGFcIik7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb21wb3NlLnBhcmFtKS50b0JlKFwieFwiKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbXBvc2UuYm9keS5uYW1lKS50b0JlKFwieFwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBpdCgnOjogLmZpcnN0TmFtZSAnLFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGFzdCA9IGZzKFwiLmZpcnN0TmFtZVwiKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFzdCkudG9CZURlZmluZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb21wb3NlID0gYXN0O1xyXG4gICAgICAgICAgICBleHBlY3QoY29tcG9zZS50eXBlKS50b0JlKFwibGFtYmRhXCIpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29tcG9zZS5wYXJhbSkudG9CZShcInhcIik7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb21wb3NlLmJvZHkudGFyZ2V0Lm5hbWUpLnRvQmUoXCJ4XCIpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29tcG9zZS5ib2R5Lm1lbWJlci5uYW1lKS50b0JlKFwiZmlyc3ROYW1lXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGl0KCc6OiAxICsgMicsXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgYXN0ID0gZnMoXCIxICsgMlwiKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFzdCkudG9CZURlZmluZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBleHByID0gYXN0O1xyXG4gICAgICAgICAgICBleHBlY3QoZXhwci50eXBlKS50b0JlKFRPS0VOUy5CSU5BUlkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGl0KCc6OiBmbiBhJyxcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBhc3QgPSBmcyhcImZ1biBhXCIpO1xyXG4gICAgICAgICAgICBleHBlY3QoYXN0KS50b0JlRGVmaW5lZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGV4cHIgPSBhc3Q7XHJcbiAgICAgICAgICAgIGV4cGVjdChleHByLnR5cGUpLnRvQmUoVE9LRU5TLkFQUCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChleHByLmZ1bikudG9FcXVhbCh7IHR5cGU6IFRPS0VOUy5JREVOVCwgbmFtZTogJ2Z1bicgfSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChleHByLmFyZ3MpLnRvRXF1YWwoW3sgdHlwZTogVE9LRU5TLklERU5ULCBuYW1lOiBcImFcIiB9XSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgaXQoJzo6IGZuICgpJyxcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBhc3QgPSBmcyhcImZ1biAoKVwiKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFzdCkudG9CZURlZmluZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBleHByID0gYXN0O1xyXG4gICAgICAgICAgICBleHBlY3QoZXhwci50eXBlKS50b0JlKFRPS0VOUy5BUFApO1xyXG4gICAgICAgICAgICBleHBlY3QoZXhwci5mdW4pLnRvRXF1YWwoeyB0eXBlOiBUT0tFTlMuSURFTlQsIG5hbWU6ICdmdW4nIH0pO1xyXG4gICAgICAgICAgICBleHBlY3QoZXhwci5hcmdzLmxlbmd0aCkudG9CZSgwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBpdCgnOjogKCspIGEgYicsXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgYXN0ID0gZnMoXCIoKykgYSBiXCIpO1xyXG4gICAgICAgICAgICBleHBlY3QoYXN0KS50b0JlRGVmaW5lZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGV4cHIgPSBhc3Q7XHJcbiAgICAgICAgICAgIGV4cGVjdChleHByKS50b0VxdWFsKHsgXCJ0eXBlXCI6IFRPS0VOUy5BUFAsIFwiZnVuXCI6IFwiK1wiLCBcImFyZ3NcIjogW3sgXCJ0eXBlXCI6IFRPS0VOUy5JREVOVCwgXCJuYW1lXCI6IFwiYVwiIH0sIHsgXCJ0eXBlXCI6IFRPS0VOUy5JREVOVCwgXCJuYW1lXCI6IFwiYlwiIH1dIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGl0KCc6OiBhIHw+IGIgfD4gYycsXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgYXN0ID0gZnMoXCJhIHw+IGIgfD4gY1wiKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFzdCkudG9CZURlZmluZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwaXBlMSA9IGFzdDtcclxuICAgICAgICAgICAgZXhwZWN0KHBpcGUxLnR5cGUpLnRvQmUoVE9LRU5TLkJJTkFSWSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChwaXBlMS5vcCkudG9CZShcInw+XCIpO1xyXG4gICAgICAgICAgICBleHBlY3QocGlwZTEucmlnaHQpLnRvRXF1YWwoeyBcInR5cGVcIjogVE9LRU5TLklERU5ULCBcIm5hbWVcIjogXCJjXCIgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcGlwZTIgPSBwaXBlMS5sZWZ0O1xyXG4gICAgICAgICAgICBleHBlY3QocGlwZTIudHlwZSkudG9CZShUT0tFTlMuQklOQVJZKTtcclxuICAgICAgICAgICAgZXhwZWN0KHBpcGUyLm9wKS50b0JlKFwifD5cIik7XHJcbiAgICAgICAgICAgIGV4cGVjdChwaXBlMi5yaWdodCkudG9FcXVhbCh7IFwidHlwZVwiOiBUT0tFTlMuSURFTlQsIFwibmFtZVwiOiBcImJcIiB9KTtcclxuICAgICAgICAgICAgZXhwZWN0KHBpcGUyLmxlZnQpLnRvRXF1YWwoeyBcInR5cGVcIjogVE9LRU5TLklERU5ULCBcIm5hbWVcIjogXCJhXCIgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgaXQoJzo6IGEgKyBiIHw+IGMnLFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGFzdCA9IGZzKFwiYSArIGIgfD4gY1wiKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFzdCkudG9CZURlZmluZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwaXBlID0gYXN0O1xyXG4gICAgICAgICAgICBleHBlY3QocGlwZS50eXBlKS50b0JlKFRPS0VOUy5CSU5BUlkpO1xyXG4gICAgICAgICAgICBleHBlY3QocGlwZS5vcCkudG9CZShcInw+XCIpO1xyXG4gICAgICAgICAgICBleHBlY3QocGlwZS5yaWdodCkudG9FcXVhbCh7IHR5cGU6IFRPS0VOUy5JREVOVCwgbmFtZTogXCJjXCIgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRkID0gcGlwZS5sZWZ0O1xyXG4gICAgICAgICAgICBleHBlY3QoYWRkLnJpZ2h0Lm5hbWUpLnRvQmUoXCJiXCIpO1xyXG4gICAgICAgICAgICBleHBlY3QoYWRkLmxlZnQubmFtZSkudG9CZShcImFcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBbe1widHlwZVwiOlwicGlwZVwiLFwiZnVuXCI6XCJ8PlwiLFwiYXJnc1wiOlt7XCJ0eXBlXCI6VE9LRU5TLklERU5ULFwibmFtZVwiOlwiY1wifSx7XCJ0eXBlXCI6XCJwaXBlXCIsXCJmdW5cIjpcInw+XCIsXCJhcmdzXCI6W3tcInR5cGVcIjpUT0tFTlMuSURFTlQsXCJuYW1lXCI6XCJiXCJ9LHtcInR5cGVcIjpUT0tFTlMuSURFTlQsXCJuYW1lXCI6XCJhXCJ9XX1dfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICBpdCgnOjogYSA+PiBiICcsXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgYXN0ID0gZnMoXCJhID4+IGJcIik7XHJcbiAgICAgICAgICAgIGV4cGVjdChhc3QpLnRvQmVEZWZpbmVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29tcG9zZSA9IGFzdDtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbXBvc2UudHlwZSkudG9CZShUT0tFTlMuQ09NUE9TRSwgSlNPTi5zdHJpbmdpZnkoYXN0LCBudWxsLCAyKSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb21wb3NlLmZ1bikudG9CZShcIj4+XCIsIEpTT04uc3RyaW5naWZ5KGFzdCwgbnVsbCwgMikpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29tcG9zZS5hcmdzWzBdLm5hbWUpLnRvQmUoXCJiXCIsIEpTT04uc3RyaW5naWZ5KGNvbXBvc2UuYXJnc1swXSwgbnVsbCwgMikpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29tcG9zZS5hcmdzWzFdLm5hbWUpLnRvQmUoXCJhXCIsIEpTT04uc3RyaW5naWZ5KGNvbXBvc2UuYXJnc1sxXSwgbnVsbCwgMikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGl0KCc6OiBhLmIgJyxcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBhc3QgPSBmcyhcImEuYlwiKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFzdCkudG9CZURlZmluZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb21wb3NlID0gYXN0O1xyXG4gICAgICAgICAgICBleHBlY3QoY29tcG9zZS50eXBlKS50b0JlKFRPS0VOUy5NRU1CRVIsIEpTT04uc3RyaW5naWZ5KGFzdCwgbnVsbCwgMikpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29tcG9zZS50YXJnZXQubmFtZSkudG9CZShcImFcIiwgSlNPTi5zdHJpbmdpZnkoYXN0LCBudWxsLCAyKSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb21wb3NlLm1lbWJlcikudG9CZShcImJcIiwgSlNPTi5zdHJpbmdpZnkoYXN0LCBudWxsLCAyKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgaXQoJzo6IFsxLi5uXSAnLFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGFzdCA9IGZzKFwiWzEuLm5dXCIpO1xyXG4gICAgICAgICAgICBleHBlY3QoYXN0KS50b0JlRGVmaW5lZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJhbmdlID0gYXN0O1xyXG4gICAgICAgICAgICBleHBlY3QocmFuZ2UudHlwZSkudG9CZShUT0tFTlMuUkFOR0UsIEpTT04uc3RyaW5naWZ5KGFzdCwgbnVsbCwgMikpO1xyXG4gICAgICAgICAgICBleHBlY3QocmFuZ2UuZnJvbS52YWx1ZSkudG9CZSgxLCBKU09OLnN0cmluZ2lmeShhc3QsIG51bGwsIDIpKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJhbmdlLnRvLm5hbWUpLnRvQmUoXCJuXCIsIEpTT04uc3RyaW5naWZ5KGFzdCwgbnVsbCwgMikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGl0KCc6OiBmb3IgcCBpbiBwZW9wbGUgd2hlcmUgcC5hZHVsdCAnLFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGFzdCA9IGZzKFwiZm9yIHAgaW4gcGVvcGxlIHdoZXJlIHAuYWR1bHRcIik7XHJcbiAgICAgICAgICAgIGV4cGVjdChhc3QpLnRvQmVEZWZpbmVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgd2hlcmUgPSBhc3Q7XHJcblxyXG4gICAgICAgICAgICBleHBlY3Qod2hlcmUudHlwZSkudG9CZShUT0tFTlMuV0hFUkUpO1xyXG4gICAgICAgICAgICBleHBlY3Qod2hlcmUucHJlZGljYXRlLnR5cGUpLnRvQmUoVE9LRU5TLk1FTUJFUik7XHJcbiAgICAgICAgICAgIGV4cGVjdCh3aGVyZS5zb3VyY2UudHlwZSkudG9CZShUT0tFTlMuUVVFUlkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGl0KFwiOjogZW1wdHkgbGlzdCAtPiAnbGlzdCBpcyBlbXB0eScgXCIsXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgcnVsZSA9IGZzKFwiZW1wdHkgbGlzdCAtPiAnbGlzdCBpcyBlbXB0eSdcIik7XHJcbiAgICAgICAgICAgIGV4cGVjdChydWxlKS50b0JlRGVmaW5lZCgpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KHJ1bGUudHlwZSkudG9CZShUT0tFTlMuQklOQVJZKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJ1bGUub3ApLnRvQmUoXCItPlwiKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJ1bGUucmlnaHQudmFsdWUpLnRvQmUoJ2xpc3QgaXMgZW1wdHknKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgaXQoJzo6IHJlZ3Jlc3Npb24gdGVzdCcsXHJcbiAgICAgICAgKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYXN0ID0gZnMoXCJhIHw+IGIuYyA+PiAoKykgMSB8PiBkXCIpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEwMDA7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZnMoXCJhIHw+IGIgPj4gKCspIDEgfD4gZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZWxhcHNlZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxhcHNlZCA+IDIwMDApIGZhaWwoXCJ0b28gc2xvd1wiKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChhc3QpLnRvRXF1YWwoXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFRPS0VOUy5CSU5BUlksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvcFwiOiBcInw+XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJyaWdodFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBUT0tFTlMuSURFTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImRcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJsZWZ0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFRPS0VOUy5CSU5BUlksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib3BcIjogXCJ8PlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJpZ2h0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBUT0tFTlMuQ09NUE9TRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZnVuXCI6IFwiPj5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogVE9LRU5TLkFQUCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmdW5cIjogXCIrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFRPS0VOUy5DT05TVCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogVE9LRU5TLk1FTUJFUixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFRPS0VOUy5JREVOVCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1lbWJlclwiOiBcImNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsZWZ0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBUT0tFTlMuSURFTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJhXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG59KTtcclxuXHJcblxyXG5jbGFzcyBUZXN0QmluZGluZyBleHRlbmRzIFJlLkJpbmRpbmcge1xyXG4gICAgcHVibGljIHZhbHVlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXN0KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoY29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUgPSBhY2NlcHQodGhpcy5hc3QsIHRoaXMsIGNvbnRleHQpLnZhbHVlT2YoKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHAoZnVuLCBhcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIGlmIChmdW4gPT09IFwiYXNzaWduXCIpIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gYXJnc1swXS52YWx1ZU9mKCk7XHJcbiAgICAgICAgICAgIGFyZ3NbMV0uc2V0KHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmFwcChmdW4sIGFyZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5kZXNjcmliZShcInJ1bnRpbWVcIiwgKCkgPT4ge1xyXG5cclxuICAgIGl0KFwiZXhwcmVzc2lvbiBkZXBlbmRlbmNpZXNcIixcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBzdG9yZSA9IG5ldyBSZS5TdG9yZSh7IHA6IGlicmFoaW0gfSk7XHJcbiAgICAgICAgICAgIHZhciBiaW5kaW5nID0gbmV3IFRlc3RCaW5kaW5nKGZzKFwicC5maXJzdE5hbWVcIikpO1xyXG4gICAgICAgICAgICBiaW5kaW5nLnJlbmRlcihzdG9yZSk7XHJcblxyXG4gICAgICAgICAgICBleHBlY3QoYmluZGluZy52YWx1ZSkudG9CZShcIklicmFoaW1cIik7XHJcbiAgICAgICAgICAgIC8vIGV4cGVjdChiaW5kaW5nLmRlcGVuZGVuY2llcy5sZW5ndGgpLnRvQmUoMik7XHJcblxyXG4gICAgICAgICAgICAvLyBleHBlY3Qoc3RvcmUuZGlydHkubGVuZ3RoKS50b0JlKDApO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZ2V0KFwicFwiKS5nZXQoXCJmaXJzdE5hbWVcIikuc2V0KFwiTXIgSWJyYWlobVwiKTtcclxuICAgICAgICAgICAgZXhwZWN0KGJpbmRpbmcudmFsdWUpLnRvQmUoXCJNciBJYnJhaWhtXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gZXhwZWN0KGJpbmRpbmcuZGVwZW5kZW5jaWVzLmxlbmd0aCkudG9CZSgyKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBpdChcImNvbnNpc3RlbnQgdmFyaWFibGUgaWRlbnRpdHlcIixcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBzdG9yZSA9IG5ldyBSZS5TdG9yZSh7IHA6IGlicmFoaW0gfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYmluZGluZyA9IG5ldyBUZXN0QmluZGluZyhmcyhcInBcIikpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KGJpbmRpbmcucmVuZGVyKHN0b3JlKSkudG9CZShiaW5kaW5nLnJlbmRlcihzdG9yZSkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGl0KFwiY29uc2lzdGVudCBtZW1iZXIgaWRlbnRpdHlcIiwgKCkgPT4ge1xyXG4gICAgICAgIHZhciBzdG9yZSA9IG5ldyBSZS5TdG9yZSh7IHhhbmlhOiB7IG93bmVyOiBpYnJhaGltIH0gfSk7XHJcbiAgICAgICAgdmFyIGJpbmRpbmcgPSBuZXcgVGVzdEJpbmRpbmcoZnMoXCJ4YW5pYS5vd25lclwiKSk7XHJcbiAgICAgICAgZXhwZWN0KGJpbmRpbmcucmVuZGVyKHN0b3JlKSkudG9CZShiaW5kaW5nLnJlbmRlcihzdG9yZSkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoXCJjb25zaXN0ZW50IHF1ZXJ5IGlkZW50aXR5XCIsICgpID0+IHtcclxuICAgICAgICB2YXIgc3RvcmUgPSBuZXcgUmUuU3RvcmUoeyB4YW5pYTogeyBlbXBsb3llZXM6IFtpYnJhaGltXSB9IH0pO1xyXG4gICAgICAgIHZhciBiaW5kaW5nID0gbmV3IFRlc3RCaW5kaW5nKGZzKFwiZm9yIGUgaW4geGFuaWEuZW1wbG95ZWVzXCIpKTtcclxuICAgICAgICBleHBlY3QoYmluZGluZy5yZW5kZXIoc3RvcmUpWzBdKS50b0JlKGJpbmRpbmcucmVuZGVyKHN0b3JlKVswXSwgXCJub3QgaWRlbnRpY2FsXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoXCJhc3NpZ24gZXhwcmVzc2lvblwiLFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIHN0b3JlID0gbmV3IFJlLlN0b3JlKHsgeDogMSwgeTogMiwgc3VtOiAwIH0pO1xyXG4gICAgICAgICAgICB2YXIgYmluZGluZyA9IG5ldyBUZXN0QmluZGluZyhmcyhcInN1bSA8LSB4ICsgeVwiKSk7XHJcbiAgICAgICAgICAgIGJpbmRpbmcucmVuZGVyKHN0b3JlKTtcclxuICAgICAgICAgICAgZXhwZWN0KHN0b3JlLmdldChcInN1bVwiKS52YWx1ZU9mKCkpLnRvQmUoMyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgaXQoJ2F3YWl0IG9ic2VydmFibGUnLFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZXMuT2JzZXJ2YWJsZSgxMjMpO1xyXG4gICAgICAgICAgICB2YXIgc3RvcmUgPSBuZXcgUmUuU3RvcmUoeyBvYnNlcnZhYmxlIH0pO1xyXG4gICAgICAgICAgICB2YXIgYmluZGluZyA9IG5ldyBUZXN0QmluZGluZyhmcyhcImF3YWl0IG9ic2VydmFibGVcIikpO1xyXG5cclxuICAgICAgICAgICAgYmluZGluZy5yZW5kZXIoc3RvcmUpO1xyXG4gICAgICAgICAgICBleHBlY3QoYmluZGluZy52YWx1ZSkudG9CZSgxMjMpO1xyXG5cclxuICAgICAgICAgICAgb2JzZXJ2YWJsZS5ub3RpZnkoNDU2KTtcclxuICAgICAgICAgICAgZXhwZWN0KGJpbmRpbmcudmFsdWUpLnRvQmUoNDU2KTtcclxuICAgICAgICB9KTtcclxuXHJcbn0pO1xyXG5cclxuIl19