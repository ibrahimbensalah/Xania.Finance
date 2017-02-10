"use strict";
var xania_1 = require("../../src/xania");
var TodoApp = (function () {
    function TodoApp() {
        var _this = this;
        this.store = new TodoStore();
        this.show = "all";
        this.editingTodo = null;
        this.onAddTodo = function (event) {
            if (event.keyCode === 13) {
                var title = event.target.value;
                _this.store.todos.push(new Todo(title));
                return "";
            }
            return void 0;
        };
        this.onToggleAll = function () {
            _this.store.toggleAll();
        };
        this.onShow = function (value) {
            _this.show = value;
        };
        this.onResetEditing = function (event) {
            if (event.keyCode === 13)
                _this.editingTodo = null;
            else if (event.keyCode === 27) {
                _this.editingTodo = null;
            }
        };
    }
    TodoApp.prototype.view = function (xania) {
        var _this = this;
        return (xania.tag("section", { className: "todoapp" },
            xania.tag("header", null,
                xania.tag("h1", null, "todos"),
                xania.tag("input", { className: "new-todo", placeholder: "What needs to be done?", autofocus: "", onKeyUp: this.onAddTodo })),
            xania.tag("section", { className: ["main", xania_1.fs("store.todos.length = 0 -> ' hidden'")] },
                xania.tag("input", { className: "toggle-all", type: "checkbox", checked: xania_1.fs("empty store.todos where not completed"), onClick: this.onToggleAll }),
                xania.tag("ul", { className: "todo-list" },
                    xania.tag(xania_1.ForEach, { expr: xania_1.fs("for todo in store.todos where (completed = (show = 'completed')) or (show = 'all')") },
                        xania.tag("li", { className: [xania_1.fs("todo.completed -> 'completed'"), xania_1.fs("todo = editingTodo -> ' editing'")] },
                            xania.tag("div", { className: "view" },
                                xania.tag("input", { className: "toggle", type: "checkbox", checked: xania_1.fs("todo.completed") }),
                                xania.tag("label", { onDblClick: xania_1.fs("editingTodo <- todo") }, xania_1.fs("todo.title")),
                                xania.tag("button", { className: "destroy", onClick: xania_1.fs("store.remove todo") })),
                            xania.tag("input", { className: "edit", value: xania_1.fs("todo.title"), autofocus: "", onBlur: this.onResetEditing, onKeyUp: this.onResetEditing }))))),
            xania.tag("footer", { className: ["footer", xania_1.fs("store.todos.length = 0 -> ' hidden'")] },
                xania.tag("span", { className: "todo-count" },
                    xania.tag("strong", null, xania_1.fs("count store.todos where not completed")),
                    " item(s) left"),
                xania.tag("ul", { className: "filters" },
                    xania.tag("li", null,
                        xania.tag("a", { href: "#", className: xania_1.fs("show = 'all' -> 'selected'"), onClick: this.onShow.bind(this, 'all') }, "All")),
                    xania.tag("li", null,
                        xania.tag("a", { href: "#", className: xania_1.fs("show = 'active' -> 'selected'"), onClick: this.onShow.bind(this, 'active') }, "Active")),
                    xania.tag("li", null,
                        xania.tag("a", { href: "#", className: xania_1.fs("show = 'completed' -> 'selected'"), onClick: this.onShow.bind(this, 'completed') }, "Completed"))),
                xania.tag("button", { className: ["clear-completed", xania_1.fs("all active todos -> ' hidden'")], onClick: function () { return _this.store.removeCompleted(); } }, "Clear completed"))));
    };
    return TodoApp;
}());
exports.TodoApp = TodoApp;
var TodoStore = (function () {
    function TodoStore() {
        this.todos = [];
        for (var i = 0; i < 10; i++)
            this.todos.push(new Todo("todo " + i, i % 2 === 0));
    }
    TodoStore.prototype.toggleAll = function () {
        var allCompleted = this.todos.every(function (e) { return e.completed; });
        for (var i = 0; i < this.todos.length; i++)
            this.todos[i].completed = !allCompleted;
    };
    TodoStore.prototype.removeCompleted = function () {
        this.todos = this.todos.filter(function (t) { return !t.completed; });
    };
    TodoStore.prototype.remove = function (todo) {
        var idx = this.todos.indexOf(todo);
        console.debug("remove todo ", idx);
        if (idx >= 0)
            this.todos.splice(idx, 1);
        else
            console.error("todo not found", todo);
    };
    TodoStore.prototype.orderByTitle = function () {
        this.todos = this.todos.sort(function (x, y) { return x.title.localeCompare(y.title); });
    };
    TodoStore.prototype.orderByTitleDesc = function () {
        this.todos = this.todos.sort(function (x, y) { return y.title.localeCompare(x.title); });
    };
    return TodoStore;
}());
var Todo = (function () {
    function Todo(title, completed) {
        if (completed === void 0) { completed = false; }
        this.title = title;
        this.completed = completed;
    }
    Todo.prototype.toggleCompletion = function () {
        this.completed = !this.completed;
    };
    return Todo;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NhbXBsZS9sYXlvdXQvdG9kby50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHlDQUE2QztBQUc3QztJQUFBO1FBQUEsaUJBeUVDO1FBdkVHLFVBQUssR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQ3hCLFNBQUksR0FBRyxLQUFLLENBQUM7UUFDYixnQkFBVyxHQUFHLElBQUksQ0FBQztRQUVuQixjQUFTLEdBQUcsVUFBQyxLQUFLO1lBQ2QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDakMsS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDZCxDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQTtRQUVELGdCQUFXLEdBQUc7WUFDVixLQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQTtRQUVELFdBQU0sR0FBRyxVQUFDLEtBQUs7WUFDWCxLQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN0QixDQUFDLENBQUE7UUFFRCxtQkFBYyxHQUFHLFVBQUMsS0FBSztZQUNuQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztnQkFDckIsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDNUIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDNUIsS0FBSSxDQUFDLFdBQVcsR0FB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QUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlCLElBQUk7WUFDQSxPQUFPLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxnQ0FBWSxHQUFaO1FBQ0ksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQTlCLENBQThCLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsb0NBQWdCLEdBQWhCO1FBQ0ksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQTlCLENBQThCLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBQ0wsZ0JBQUM7QUFBRCxDQUFDLEFBcENELElBb0NDO0FBRUQ7SUFDSSxjQUFtQixLQUFhLEVBQVMsU0FBaUI7UUFBakIsMEJBQUEsRUFBQSxpQkFBaUI7UUFBdkMsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQVE7SUFDMUQsQ0FBQztJQUVELCtCQUFnQixHQUFoQjtRQUNJLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3JDLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FBQyxBQVBELElBT0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGb3JFYWNoLCBmcyB9IGZyb20gXCIuLi8uLi9zcmMveGFuaWFcIlxyXG5pbXBvcnQgeyBPYnNlcnZhYmxlcyB9IGZyb20gXCIuLi8uLi9zcmMvb2JzZXJ2YWJsZXNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIFRvZG9BcHAge1xyXG5cclxuICAgIHN0b3JlID0gbmV3IFRvZG9TdG9yZSgpO1xyXG4gICAgc2hvdyA9IFwiYWxsXCI7XHJcbiAgICBlZGl0aW5nVG9kbyA9IG51bGw7XHJcblxyXG4gICAgb25BZGRUb2RvID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnRvZG9zLnB1c2gobmV3IFRvZG8odGl0bGUpKTtcclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2b2lkIDA7XHJcbiAgICB9XHJcblxyXG4gICAgb25Ub2dnbGVBbGwgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zdG9yZS50b2dnbGVBbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICBvblNob3cgPSAodmFsdWUpID0+IHtcclxuICAgICAgICB0aGlzLnNob3cgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBvblJlc2V0RWRpdGluZyA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMylcclxuICAgICAgICAgICAgdGhpcy5lZGl0aW5nVG9kbyA9IG51bGw7XHJcbiAgICAgICAgZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMjcpIHtcclxuICAgICAgICAgICAgdGhpcy5lZGl0aW5nVG9kbyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZpZXcoeGFuaWEpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2RvYXBwXCI+XHJcbiAgICAgICAgICAgICAgICA8aGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMT50b2RvczwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cIm5ldy10b2RvXCIgcGxhY2Vob2xkZXI9XCJXaGF0IG5lZWRzIHRvIGJlIGRvbmU/XCIgYXV0b2ZvY3VzPVwiXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25LZXlVcD17dGhpcy5vbkFkZFRvZG99IC8+XHJcbiAgICAgICAgICAgICAgICA8L2hlYWRlcj5cclxuICAgICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT17W1wibWFpblwiLCBmcyhcInN0b3JlLnRvZG9zLmxlbmd0aCA9IDAgLT4gJyBoaWRkZW4nXCIpXX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cInRvZ2dsZS1hbGxcIiB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXtmcyhcImVtcHR5IHN0b3JlLnRvZG9zIHdoZXJlIG5vdCBjb21wbGV0ZWRcIil9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25Ub2dnbGVBbGx9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cInRvZG8tbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Rm9yRWFjaCBleHByPXtmcyhcImZvciB0b2RvIGluIHN0b3JlLnRvZG9zIHdoZXJlIChjb21wbGV0ZWQgPSAoc2hvdyA9ICdjb21wbGV0ZWQnKSkgb3IgKHNob3cgPSAnYWxsJylcIil9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17W2ZzKFwidG9kby5jb21wbGV0ZWQgLT4gJ2NvbXBsZXRlZCdcIiksIGZzKFwidG9kbyA9IGVkaXRpbmdUb2RvIC0+ICcgZWRpdGluZydcIildfSA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ2aWV3XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJ0b2dnbGVcIiB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXtmcyhcInRvZG8uY29tcGxldGVkXCIpfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgb25EYmxDbGljaz17ZnMoXCJlZGl0aW5nVG9kbyA8LSB0b2RvXCIpfT57ZnMoXCJ0b2RvLnRpdGxlXCIpfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZGVzdHJveVwiIG9uQ2xpY2s9e2ZzKFwic3RvcmUucmVtb3ZlIHRvZG9cIil9PjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJlZGl0XCIgdmFsdWU9e2ZzKFwidG9kby50aXRsZVwiKX0gYXV0b2ZvY3VzPVwiXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25CbHVyPXt0aGlzLm9uUmVzZXRFZGl0aW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbktleVVwPXt0aGlzLm9uUmVzZXRFZGl0aW5nfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Gb3JFYWNoPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgICAgICAgICA8Zm9vdGVyIGNsYXNzTmFtZT17W1wiZm9vdGVyXCIsIGZzKFwic3RvcmUudG9kb3MubGVuZ3RoID0gMCAtPiAnIGhpZGRlbidcIildfT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2RvLWNvdW50XCI+PHN0cm9uZz57ZnMoXCJjb3VudCBzdG9yZS50b2RvcyB3aGVyZSBub3QgY29tcGxldGVkXCIpfTwvc3Ryb25nPiBpdGVtKHMpIGxlZnQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImZpbHRlcnNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCIgY2xhc3NOYW1lPXtmcyhcInNob3cgPSAnYWxsJyAtPiAnc2VsZWN0ZWQnXCIpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5vblNob3cuYmluZCh0aGlzLCAnYWxsJyl9PkFsbDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIiBjbGFzc05hbWU9e2ZzKFwic2hvdyA9ICdhY3RpdmUnIC0+ICdzZWxlY3RlZCdcIil9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9uU2hvdy5iaW5kKHRoaXMsICdhY3RpdmUnKX0+QWN0aXZlPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiIGNsYXNzTmFtZT17ZnMoXCJzaG93ID0gJ2NvbXBsZXRlZCcgLT4gJ3NlbGVjdGVkJ1wiKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25TaG93LmJpbmQodGhpcywgJ2NvbXBsZXRlZCcpfT5Db21wbGV0ZWQ8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsID5cclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17W1wiY2xlYXItY29tcGxldGVkXCIsIGZzKFwiYWxsIGFjdGl2ZSB0b2RvcyAtPiAnIGhpZGRlbidcIildfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnN0b3JlLnJlbW92ZUNvbXBsZXRlZCgpfT5DbGVhciBjb21wbGV0ZWQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvZm9vdGVyPlxyXG4gICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVG9kb1N0b3JlIHtcclxuICAgIHB1YmxpYyB0b2RvczogVG9kb1tdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMudG9kb3MgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLnRvZG9zLnB1c2gobmV3IFRvZG8oYHRvZG8gJHtpfWAsIGkgJSAyID09PSAwKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlQWxsKCkge1xyXG4gICAgICAgIHZhciBhbGxDb21wbGV0ZWQgPSB0aGlzLnRvZG9zLmV2ZXJ5KGUgPT4gZS5jb21wbGV0ZWQpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50b2Rvcy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgdGhpcy50b2Rvc1tpXS5jb21wbGV0ZWQgPSAhYWxsQ29tcGxldGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUNvbXBsZXRlZCgpIHtcclxuICAgICAgICB0aGlzLnRvZG9zID0gdGhpcy50b2Rvcy5maWx0ZXIodCA9PiAhdC5jb21wbGV0ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZSh0b2RvKSB7XHJcbiAgICAgICAgdmFyIGlkeCA9IHRoaXMudG9kb3MuaW5kZXhPZih0b2RvKTtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKFwicmVtb3ZlIHRvZG8gXCIsIGlkeCk7XHJcbiAgICAgICAgaWYgKGlkeCA+PSAwKVxyXG4gICAgICAgICAgICB0aGlzLnRvZG9zLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcInRvZG8gbm90IGZvdW5kXCIsIHRvZG8pO1xyXG4gICAgfVxyXG5cclxuICAgIG9yZGVyQnlUaXRsZSgpIHtcclxuICAgICAgICB0aGlzLnRvZG9zID0gdGhpcy50b2Rvcy5zb3J0KCh4LCB5KSA9PiB4LnRpdGxlLmxvY2FsZUNvbXBhcmUoeS50aXRsZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIG9yZGVyQnlUaXRsZURlc2MoKSB7XHJcbiAgICAgICAgdGhpcy50b2RvcyA9IHRoaXMudG9kb3Muc29ydCgoeCwgeSkgPT4geS50aXRsZS5sb2NhbGVDb21wYXJlKHgudGl0bGUpKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVG9kbyB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGl0bGU6IHN0cmluZywgcHVibGljIGNvbXBsZXRlZCA9IGZhbHNlKSB7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlQ29tcGxldGlvbigpIHtcclxuICAgICAgICB0aGlzLmNvbXBsZXRlZCA9ICF0aGlzLmNvbXBsZXRlZDtcclxuICAgIH1cclxufVxyXG5cclxuIl19