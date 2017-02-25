"use strict";
var xania_1 = require("../../src/xania");
var anim_1 = require("../../src/anim");
require("./todos/index.css");
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
            xania.tag("section", { className: ["main", xania_1.query("store.todos.length = 0 -> ' hidden'")] },
                xania.tag("input", { className: "toggle-all", type: "checkbox", checked: xania_1.query("empty store.todos where not completed"), onClick: this.onToggleAll }),
                xania.tag("ul", { className: "todo-list" },
                    xania.tag(xania_1.ForEach, { expr: xania_1.query("for todo in store.todos where (completed = (show = 'completed')) or (show = 'all')") },
                        xania.tag(anim_1.Animate, { height: "58px", transform: "scale(1)", dispose: [{ height: "58px", opacity: 1 }, { height: 0, opacity: 0 }] },
                            xania.tag("li", { className: [xania_1.query("todo.completed -> 'completed'"), xania_1.query("todo = editingTodo -> ' editing'")] },
                                xania.tag("div", { className: "view" },
                                    xania.tag("input", { className: "toggle", type: "checkbox", checked: xania_1.query("todo.completed") }),
                                    xania.tag("label", { onDblClick: xania_1.query("editingTodo <- todo") }, xania_1.query("todo.title")),
                                    xania.tag("button", { className: "destroy", onClick: xania_1.query("store.remove todo") })),
                                xania.tag("input", { className: "edit", value: xania_1.query("todo.title"), autofocus: "", onBlur: this.onResetEditing, onKeyUp: this.onResetEditing })))))),
            xania.tag("footer", { className: ["footer", xania_1.query("store.todos.length = 0 -> ' hidden'")] },
                xania.tag("span", { className: "todo-count" },
                    xania.tag("strong", null, xania_1.query("count store.todos where not completed")),
                    " item(s) left"),
                xania.tag("ul", { className: "filters" },
                    xania.tag("li", null,
                        xania.tag("a", { className: xania_1.query("show = 'all' -> 'selected'"), onClick: this.onShow.bind(this, 'all') }, "All")),
                    xania.tag("li", null,
                        xania.tag("a", { className: xania_1.query("show = 'active' -> 'selected'"), onClick: this.onShow.bind(this, 'active') }, "Active")),
                    xania.tag("li", null,
                        xania.tag("a", { className: xania_1.query("show = 'completed' -> 'selected'"), onClick: this.onShow.bind(this, 'completed') }, "Completed"))),
                xania.tag("button", { className: ["clear-completed", xania_1.query("all active todos -> ' hidden'")], onClick: function () { return _this.store.removeCompleted(); } }, "Clear completed"))));
    };
    return TodoApp;
}());
exports.TodoApp = TodoApp;
var TodoStore = (function () {
    function TodoStore() {
        this.todos = [];
        for (var i = 0; i < 2; i++)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRvZG8udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx5Q0FBZ0Q7QUFDaEQsdUNBQXdDO0FBRXhDLDZCQUEwQjtBQUUxQjtJQUFBO1FBQUEsaUJBMkVDO1FBekVHLFVBQUssR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQ3hCLFNBQUksR0FBRyxLQUFLLENBQUM7UUFDYixnQkFBVyxHQUFHLElBQUksQ0FBQztRQUVuQixjQUFTLEdBQUcsVUFBQyxLQUFLO1lBQ2QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDakMsS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDZCxDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQTtRQUVELGdCQUFXLEdBQUc7WUFDVixLQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQTtRQUVELFdBQU0sR0FBRyxVQUFDLEtBQUs7WUFDWCxLQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN0QixDQUFDLENBQUE7UUFFRCxtQkFBYyxHQUFHLFVBQUMsS0FBSztZQUNuQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztnQkFDckIsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDNUIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDNUIsS0FBSSxDQUFDLFdBQVcs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QUM7QUFBRCxDQUFDLEFBUEQsSUFPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZvckVhY2gsIHF1ZXJ5IH0gZnJvbSBcIi4uLy4uL3NyYy94YW5pYVwiXHJcbmltcG9ydCB7IEFuaW1hdGUgfSBmcm9tIFwiLi4vLi4vc3JjL2FuaW1cIlxyXG5pbXBvcnQgeyBPYnNlcnZhYmxlcyB9IGZyb20gXCIuLi8uLi9zcmMvb2JzZXJ2YWJsZXNcIlxyXG5pbXBvcnQgJy4vdG9kb3MvaW5kZXguY3NzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFRvZG9BcHAge1xyXG5cclxuICAgIHN0b3JlID0gbmV3IFRvZG9TdG9yZSgpO1xyXG4gICAgc2hvdyA9IFwiYWxsXCI7XHJcbiAgICBlZGl0aW5nVG9kbyA9IG51bGw7XHJcblxyXG4gICAgb25BZGRUb2RvID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnRvZG9zLnB1c2gobmV3IFRvZG8odGl0bGUpKTtcclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2b2lkIDA7XHJcbiAgICB9XHJcblxyXG4gICAgb25Ub2dnbGVBbGwgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zdG9yZS50b2dnbGVBbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICBvblNob3cgPSAodmFsdWUpID0+IHtcclxuICAgICAgICB0aGlzLnNob3cgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBvblJlc2V0RWRpdGluZyA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMylcclxuICAgICAgICAgICAgdGhpcy5lZGl0aW5nVG9kbyA9IG51bGw7XHJcbiAgICAgICAgZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMjcpIHtcclxuICAgICAgICAgICAgdGhpcy5lZGl0aW5nVG9kbyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZpZXcoeGFuaWEpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2RvYXBwXCIgPlxyXG4gICAgICAgICAgICAgICAgPGhlYWRlcj5cclxuICAgICAgICAgICAgICAgICAgICA8aDE+dG9kb3M8L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJuZXctdG9kb1wiIHBsYWNlaG9sZGVyPVwiV2hhdCBuZWVkcyB0byBiZSBkb25lP1wiIGF1dG9mb2N1cz1cIlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uS2V5VXA9e3RoaXMub25BZGRUb2RvfSAvPlxyXG4gICAgICAgICAgICAgICAgPC9oZWFkZXI+XHJcbiAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9e1tcIm1haW5cIiwgcXVlcnkoXCJzdG9yZS50b2Rvcy5sZW5ndGggPSAwIC0+ICcgaGlkZGVuJ1wiKV19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJ0b2dnbGUtYWxsXCIgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17cXVlcnkoXCJlbXB0eSBzdG9yZS50b2RvcyB3aGVyZSBub3QgY29tcGxldGVkXCIpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9uVG9nZ2xlQWxsfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJ0b2RvLWxpc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEZvckVhY2ggZXhwcj17cXVlcnkoXCJmb3IgdG9kbyBpbiBzdG9yZS50b2RvcyB3aGVyZSAoY29tcGxldGVkID0gKHNob3cgPSAnY29tcGxldGVkJykpIG9yIChzaG93ID0gJ2FsbCcpXCIpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxBbmltYXRlIGhlaWdodD1cIjU4cHhcIiB0cmFuc2Zvcm09XCJzY2FsZSgxKVwiZGlzcG9zZT17W3sgaGVpZ2h0OiBcIjU4cHhcIiwgb3BhY2l0eTogMSB9LCB7IGhlaWdodDogMCwgb3BhY2l0eTogMCB9XX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17W3F1ZXJ5KFwidG9kby5jb21wbGV0ZWQgLT4gJ2NvbXBsZXRlZCdcIiksIHF1ZXJ5KFwidG9kbyA9IGVkaXRpbmdUb2RvIC0+ICcgZWRpdGluZydcIildfSA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidmlld1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cInRvZ2dsZVwiIHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e3F1ZXJ5KFwidG9kby5jb21wbGV0ZWRcIil9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgb25EYmxDbGljaz17cXVlcnkoXCJlZGl0aW5nVG9kbyA8LSB0b2RvXCIpfT57cXVlcnkoXCJ0b2RvLnRpdGxlXCIpfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImRlc3Ryb3lcIiBvbkNsaWNrPXtxdWVyeShcInN0b3JlLnJlbW92ZSB0b2RvXCIpfT48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJlZGl0XCIgdmFsdWU9e3F1ZXJ5KFwidG9kby50aXRsZVwiKX0gYXV0b2ZvY3VzPVwiXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQmx1cj17dGhpcy5vblJlc2V0RWRpdGluZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uS2V5VXA9e3RoaXMub25SZXNldEVkaXRpbmd9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQW5pbWF0ZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Gb3JFYWNoPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgICAgICAgICA8Zm9vdGVyIGNsYXNzTmFtZT17W1wiZm9vdGVyXCIsIHF1ZXJ5KFwic3RvcmUudG9kb3MubGVuZ3RoID0gMCAtPiAnIGhpZGRlbidcIildfT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2RvLWNvdW50XCI+PHN0cm9uZz57cXVlcnkoXCJjb3VudCBzdG9yZS50b2RvcyB3aGVyZSBub3QgY29tcGxldGVkXCIpfTwvc3Ryb25nPiBpdGVtKHMpIGxlZnQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImZpbHRlcnNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGNsYXNzTmFtZT17cXVlcnkoXCJzaG93ID0gJ2FsbCcgLT4gJ3NlbGVjdGVkJ1wiKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25TaG93LmJpbmQodGhpcywgJ2FsbCcpfT5BbGw8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGNsYXNzTmFtZT17cXVlcnkoXCJzaG93ID0gJ2FjdGl2ZScgLT4gJ3NlbGVjdGVkJ1wiKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25TaG93LmJpbmQodGhpcywgJ2FjdGl2ZScpfT5BY3RpdmU8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGNsYXNzTmFtZT17cXVlcnkoXCJzaG93ID0gJ2NvbXBsZXRlZCcgLT4gJ3NlbGVjdGVkJ1wiKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25TaG93LmJpbmQodGhpcywgJ2NvbXBsZXRlZCcpfT5Db21wbGV0ZWQ8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsID5cclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17W1wiY2xlYXItY29tcGxldGVkXCIsIHF1ZXJ5KFwiYWxsIGFjdGl2ZSB0b2RvcyAtPiAnIGhpZGRlbidcIildfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnN0b3JlLnJlbW92ZUNvbXBsZXRlZCgpfT5DbGVhciBjb21wbGV0ZWQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvZm9vdGVyPlxyXG4gICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVG9kb1N0b3JlIHtcclxuICAgIHB1YmxpYyB0b2RvczogVG9kb1tdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMudG9kb3MgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMudG9kb3MucHVzaChuZXcgVG9kbyhgdG9kbyAke2l9YCwgaSAlIDIgPT09IDApKTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVBbGwoKSB7XHJcbiAgICAgICAgdmFyIGFsbENvbXBsZXRlZCA9IHRoaXMudG9kb3MuZXZlcnkoZSA9PiBlLmNvbXBsZXRlZCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRvZG9zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB0aGlzLnRvZG9zW2ldLmNvbXBsZXRlZCA9ICFhbGxDb21wbGV0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQ29tcGxldGVkKCkge1xyXG4gICAgICAgIHRoaXMudG9kb3MgPSB0aGlzLnRvZG9zLmZpbHRlcih0ID0+ICF0LmNvbXBsZXRlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlKHRvZG8pIHtcclxuICAgICAgICB2YXIgaWR4ID0gdGhpcy50b2Rvcy5pbmRleE9mKHRvZG8pO1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJyZW1vdmUgdG9kbyBcIiwgaWR4KTtcclxuICAgICAgICBpZiAoaWR4ID49IDApXHJcbiAgICAgICAgICAgIHRoaXMudG9kb3Muc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwidG9kbyBub3QgZm91bmRcIiwgdG9kbyk7XHJcbiAgICB9XHJcblxyXG4gICAgb3JkZXJCeVRpdGxlKCkge1xyXG4gICAgICAgIHRoaXMudG9kb3MgPSB0aGlzLnRvZG9zLnNvcnQoKHgsIHkpID0+IHgudGl0bGUubG9jYWxlQ29tcGFyZSh5LnRpdGxlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgb3JkZXJCeVRpdGxlRGVzYygpIHtcclxuICAgICAgICB0aGlzLnRvZG9zID0gdGhpcy50b2Rvcy5zb3J0KCh4LCB5KSA9PiB5LnRpdGxlLmxvY2FsZUNvbXBhcmUoeC50aXRsZSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBUb2RvIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0aXRsZTogc3RyaW5nLCBwdWJsaWMgY29tcGxldGVkID0gZmFsc2UpIHtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVDb21wbGV0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuY29tcGxldGVkID0gIXRoaXMuY29tcGxldGVkO1xyXG4gICAgfVxyXG59XHJcblxyXG4iXX0=