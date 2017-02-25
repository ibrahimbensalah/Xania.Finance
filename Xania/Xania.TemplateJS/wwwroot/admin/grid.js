"use strict";
var xania_1 = require("../src/xania");
require("./grid.css");
var DataGrid = (function () {
    function DataGrid() {
        var _this = this;
        this.data = [];
        this.columns = [];
        this.activeRow = null;
        this.activeRecord = null;
        this.onRowClick = function (event, context) {
            var activeRow = context.get('row').valueOf();
            _this.activeRow = activeRow;
            _this.activeRecord = activeRow.data;
            event.preventDefault();
        };
        this.columns.push({ field: "Name" });
        this.columns.push({ field: "Email" });
        this.columns.push({ field: "Roles" });
        for (var e = 0; e < 100; e++) {
            this.data.push({
                idx: e,
                data: { Id: e, Name: "User " + e, Email: "user" + e + "@xania.nl", Roles: ["Role 1", "Role 12"], EmailConfirmed: e % 3 === 0 },
                get: function (field) {
                    return this.data[field];
                },
                alternate: e % 2 === 0
            });
        }
    }
    DataGrid.prototype.view = function (xania) {
        return (xania.tag("div", { id: "users", "data-modelid": "Id", className: "xn-grid", role: "grid", "data-itemheight": "31" },
            xania.tag("div", { className: "xn-border-box xn-grid-header", style: "z-index: 100" },
                xania.tag("div", { role: "rowheader", className: "xn-grid-row-header xn-grid-header-cell" }, "\u00A0"),
                xania.tag(xania_1.ForEach, { expr: xania_1.query("for column in columns") },
                    xania.tag("div", { "data-idx": "UserName", role: "gridcell", className: "xn-grid-header-cell" },
                        xania.tag("div", { className: "xn-grid-cell-content" },
                            xania.tag("a", { "data-bind": "click: sort.bind($data, 'UserName')" }, xania_1.query("column.field"))))),
                xania.tag("div", { className: "xn-grid-header-cell", style: "width: 100%; min-width: 100px" }, "\u00A0")),
            xania.tag("div", { className: "xn-list-scrollable", style: "overflow: auto; height: 100%;", role: "listbox" },
                xania.tag("div", { className: "xn-content", style: "padding-top: 0px; " },
                    xania.tag("table", { style: "width: 100%;" },
                        xania.tag("tbody", { "data-bind": "foreach: view" },
                            xania.tag(xania_1.ForEach, { expr: xania_1.query("for row in data") },
                                xania.tag("tr", { role: "listitem", onClick: this.onRowClick, className: ["xn-list-item", xania_1.query("row = activeRow -> ' xn-grid-row-activated'"),
                                        xania_1.query("row.alternate -> ' xn-grid-row-alternate'"), xania_1.query("row.updated -> ' xn-grid-row-updated'")] },
                                    xania.tag("td", null,
                                        xania.tag("div", { className: "xn-grid-row-header" },
                                            xania.tag("span", { className: ["fa", xania_1.query("row = activeRow -> ' fa-edit'")] }))),
                                    xania.tag(xania_1.ForEach, { expr: xania_1.query("for column in columns") },
                                        xania.tag("td", { role: "gridcell", tabindex: "-1", className: "xn-grid-cell" },
                                            xania.tag("div", { className: "xn-grid-cell-content" },
                                                xania.tag("a", { href: "#" }, xania_1.query("row.get column.field"))))),
                                    xania.tag("td", { role: "gridcell", tabindex: "-1", className: "xn-grid-cell", style: "width: 100%;" })))))))));
    };
    return DataGrid;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataGrid;
function bla() { }
exports.bla = bla;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdyaWQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzQ0FBNkM7QUFDN0Msc0JBQW1CO0FBRW5CO0lBTUk7UUFBQSxpQkFpQkM7UUF0Qk8sU0FBSSxHQUFHLEVBQUUsQ0FBQztRQUNWLFlBQU8sR0FBRyxFQUFFLENBQUM7UUFDYixjQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBcUI1QixlQUFVLEdBQUcsVUFBQyxLQUFLLEVBQUUsT0FBTztZQUN4QixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzdDLEtBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQzNCLEtBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztZQUNuQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFDO1FBdkJFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBSXRDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ1gsR0FBRyxFQUFFLENBQUM7Z0JBQ04sSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBUSxDQUFHLEVBQUUsS0FBSyxFQUFFLFNBQU8sQ0FBQyxjQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDekgsR0FBRyxZQUFDLEtBQUs7b0JBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVCLENBQUM7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQzthQUN6QixDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztJQVNELHVCQUFJLEdBQUosVUFBSyxLQUFLO1FBQ04sTUFBTSxDQUFDLENBQ0gsbUJBQUssRUFBRSxFQUFDLE9BQU8sa0JBQWMsSUFBSSxFQUFDLFNBQVMsRUFBQyxTQUFTLEVBQUMsSUFBSSxFQUFDLE1BQU0scUJBQWlCLElBQUk7WUFDbEYsbUJBQUssU0FBUyxFQUFDLDhCQUE4QixFQUFDLEtBQUssRUFBQyxjQUFjO2dCQUM5RCxtQkFBSyxJQUFJLEVBQUMsV0FBVyxFQUFDLFNBQVMsRUFBQyx3Q0FBd0MsYUFBYTtnQkFDckYsVUFBQyxlQUFPLElBQUMsSUFBSSxFQUFFLGFBQUssQ0FBQyx1QkFBdUIsQ0FBQztvQkFDekMsK0JBQWMsVUFBVSxFQUFDLElBQUksRUFBQyxVQUFVLEVBQUMsU0FBUyxFQUFDLHFCQUFxQjt3QkFDcEUsbUJBQUssU0FBUyxFQUFDLHNCQUFzQjs0QkFBQyw4QkFBYSxxQ0FBcUMsSUFBRSxhQUFLLENBQUMsY0FBYyxDQUFDLENBQUssQ0FBTSxDQUN4SCxDQUNBO2dCQUNWLG1CQUFLLFNBQVMsRUFBQyxxQkFBcUIsRUFBQyxLQUFLLEVBQUMsK0JBQStCLGFBQWEsQ0FDckY7WUFFTixtQkFBSyxTQUFTLEVBQUMsb0JBQW9CLEVBQUMsS0FBSyxFQUFDLCtCQUErQixFQUFDLElBQUksRUFBQyxTQUFTO2dCQUNwRixtQkFBSyxTQUFTLEVBQUMsWUFBWSxFQUFDLEtBQUssRUFBQyxvQkFBb0I7b0JBQ2xELHFCQUFPLEtBQUssRUFBQyxjQUFjO3dCQUN2QixrQ0FBaUIsZUFBZTs0QkFDNUIsVUFBQyxlQUFPLElBQUMsSUFBSSxFQUFFLGFBQUssQ0FBQyxpQkFBaUIsQ0FBQztnQ0FDbkMsa0JBQUksSUFBSSxFQUFDLFVBQVUsRUFDZixPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFDeEIsU0FBUyxFQUFFLENBQUMsY0FBYyxFQUFFLGFBQUssQ0FBQyw2Q0FBNkMsQ0FBQzt3Q0FDeEUsYUFBSyxDQUFDLDJDQUEyQyxDQUFDLEVBQUUsYUFBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7b0NBQzNHO3dDQUNJLG1CQUFLLFNBQVMsRUFBQyxvQkFBb0I7NENBQy9CLG9CQUFNLFNBQVMsRUFBRSxDQUFDLElBQUksRUFBRSxhQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQyxHQUFTLENBQ3RFLENBQ0w7b0NBQ0wsVUFBQyxlQUFPLElBQUMsSUFBSSxFQUFFLGFBQUssQ0FBQyx1QkFBdUIsQ0FBQzt3Q0FDekMsa0JBQUksSUFBSSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxjQUFjOzRDQUN0RCxtQkFBSyxTQUFTLEVBQUMsc0JBQXNCO2dEQUFDLGlCQUFHLElBQUksRUFBQyxHQUFHLElBQUUsYUFBSyxDQUFDLHNCQUFzQixDQUFDLENBQUssQ0FBTSxDQUMxRixDQUNDO29DQUNWLGtCQUFJLElBQUksRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsY0FBYyxFQUFDLEtBQUssRUFBQyxjQUFjLEdBQU0sQ0FDcEYsQ0FDQyxDQUNOLENBQ0osQ0FDTixDQUNKLENBQ0osQ0FDVCxDQUFDO0lBQ04sQ0FBQztJQUNMLGVBQUM7QUFBRCxDQUFDLEFBMUVELElBMEVDOzs7QUFFRCxpQkFBd0IsQ0FBQztBQUF6QixrQkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGb3JFYWNoLCBxdWVyeSB9IGZyb20gXCIuLi9zcmMveGFuaWFcIlxyXG5pbXBvcnQgJy4vZ3JpZC5jc3MnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEYXRhR3JpZCB7XHJcbiAgICBwcml2YXRlIGRhdGEgPSBbXTtcclxuICAgIHByaXZhdGUgY29sdW1ucyA9IFtdO1xyXG4gICAgcHJpdmF0ZSBhY3RpdmVSb3cgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBhY3RpdmVSZWNvcmQgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuY29sdW1ucy5wdXNoKHsgZmllbGQ6IFwiTmFtZVwiIH0pO1xyXG4gICAgICAgIHRoaXMuY29sdW1ucy5wdXNoKHsgZmllbGQ6IFwiRW1haWxcIiB9KTtcclxuICAgICAgICB0aGlzLmNvbHVtbnMucHVzaCh7IGZpZWxkOiBcIlJvbGVzXCIgfSk7XHJcblxyXG4gICAgICAgIC8vIEVtYWlsQ29uZmlybWVkXHJcblxyXG4gICAgICAgIGZvciAodmFyIGUgPSAwOyBlIDwgMTAwOyBlKyspIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaWR4OiBlLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogeyBJZDogZSwgTmFtZTogYFVzZXIgJHtlfWAsIEVtYWlsOiBgdXNlciR7ZX1AeGFuaWEubmxgLCBSb2xlczogW1wiUm9sZSAxXCIsIFwiUm9sZSAxMlwiXSwgRW1haWxDb25maXJtZWQ6IGUgJSAzID09PSAwIH0sXHJcbiAgICAgICAgICAgICAgICBnZXQoZmllbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhW2ZpZWxkXTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhbHRlcm5hdGU6IGUgJSAyID09PSAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblJvd0NsaWNrID0gKGV2ZW50LCBjb250ZXh0KSA9PiB7XHJcbiAgICAgICAgdmFyIGFjdGl2ZVJvdyA9IGNvbnRleHQuZ2V0KCdyb3cnKS52YWx1ZU9mKCk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVSb3cgPSBhY3RpdmVSb3c7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVSZWNvcmQgPSBhY3RpdmVSb3cuZGF0YTtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB2aWV3KHhhbmlhKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD1cInVzZXJzXCIgZGF0YS1tb2RlbGlkPVwiSWRcIiBjbGFzc05hbWU9XCJ4bi1ncmlkXCIgcm9sZT1cImdyaWRcIiBkYXRhLWl0ZW1oZWlnaHQ9XCIzMVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ4bi1ib3JkZXItYm94IHhuLWdyaWQtaGVhZGVyXCIgc3R5bGU9XCJ6LWluZGV4OiAxMDBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHJvbGU9XCJyb3doZWFkZXJcIiBjbGFzc05hbWU9XCJ4bi1ncmlkLXJvdy1oZWFkZXIgeG4tZ3JpZC1oZWFkZXItY2VsbFwiPiZuYnNwOzwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxGb3JFYWNoIGV4cHI9e3F1ZXJ5KFwiZm9yIGNvbHVtbiBpbiBjb2x1bW5zXCIpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWlkeD1cIlVzZXJOYW1lXCIgcm9sZT1cImdyaWRjZWxsXCIgY2xhc3NOYW1lPVwieG4tZ3JpZC1oZWFkZXItY2VsbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ4bi1ncmlkLWNlbGwtY29udGVudFwiPjxhIGRhdGEtYmluZD1cImNsaWNrOiBzb3J0LmJpbmQoJGRhdGEsICdVc2VyTmFtZScpXCI+e3F1ZXJ5KFwiY29sdW1uLmZpZWxkXCIpfTwvYT48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Gb3JFYWNoPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwieG4tZ3JpZC1oZWFkZXItY2VsbFwiIHN0eWxlPVwid2lkdGg6IDEwMCU7IG1pbi13aWR0aDogMTAwcHhcIj4mbmJzcDs8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwieG4tbGlzdC1zY3JvbGxhYmxlXCIgc3R5bGU9XCJvdmVyZmxvdzogYXV0bzsgaGVpZ2h0OiAxMDAlO1wiIHJvbGU9XCJsaXN0Ym94XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ4bi1jb250ZW50XCIgc3R5bGU9XCJwYWRkaW5nLXRvcDogMHB4OyBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIHN0eWxlPVwid2lkdGg6IDEwMCU7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHkgZGF0YS1iaW5kPVwiZm9yZWFjaDogdmlld1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JFYWNoIGV4cHI9e3F1ZXJ5KFwiZm9yIHJvdyBpbiBkYXRhXCIpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIHJvbGU9XCJsaXN0aXRlbVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9uUm93Q2xpY2t9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e1tcInhuLWxpc3QtaXRlbVwiLCBxdWVyeShcInJvdyA9IGFjdGl2ZVJvdyAtPiAnIHhuLWdyaWQtcm93LWFjdGl2YXRlZCdcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5KFwicm93LmFsdGVybmF0ZSAtPiAnIHhuLWdyaWQtcm93LWFsdGVybmF0ZSdcIiksIHF1ZXJ5KFwicm93LnVwZGF0ZWQgLT4gJyB4bi1ncmlkLXJvdy11cGRhdGVkJ1wiKV19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwieG4tZ3JpZC1yb3ctaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17W1wiZmFcIiwgcXVlcnkoXCJyb3cgPSBhY3RpdmVSb3cgLT4gJyBmYS1lZGl0J1wiKV19Pjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Rm9yRWFjaCBleHByPXtxdWVyeShcImZvciBjb2x1bW4gaW4gY29sdW1uc1wiKX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHJvbGU9XCJncmlkY2VsbFwiIHRhYmluZGV4PVwiLTFcIiBjbGFzc05hbWU9XCJ4bi1ncmlkLWNlbGxcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ4bi1ncmlkLWNlbGwtY29udGVudFwiPjxhIGhyZWY9XCIjXCI+e3F1ZXJ5KFwicm93LmdldCBjb2x1bW4uZmllbGRcIil9PC9hPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0ZvckVhY2g+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgcm9sZT1cImdyaWRjZWxsXCIgdGFiaW5kZXg9XCItMVwiIGNsYXNzTmFtZT1cInhuLWdyaWQtY2VsbFwiIHN0eWxlPVwid2lkdGg6IDEwMCU7XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0ZvckVhY2g+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBibGEoKSB7IH0iXX0=