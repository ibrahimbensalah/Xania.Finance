"use strict";
var xania_1 = require("../../src/xania");
function run(target) {
    var state = {
        databases: ENV.generateData(true).toArray()
    };
    var store = new xania_1.Reactive.Store(state);
    dbmon(xania_1.Xania)
        .bind(xania_1.Dom.DomVisitor)
        .update(store, new xania_1.Dom.DomDriver(target));
    var load = function () {
        ENV.generateData(true);
        store.refresh();
        Monitoring.renderRate.ping();
        window.setTimeout(load, ENV.timeout);
    };
    load();
}
exports.run = run;
var dbmon = function (xania) {
    return xania.tag("table", { clazz: "table table-striped latest-data" },
        xania.tag("tbody", null,
            xania.tag(xania_1.Repeat, { source: xania_1.expr("databases") },
                xania.tag("tr", null,
                    xania.tag("td", { className: "dbname" }, xania_1.expr("dbname")),
                    xania.tag("td", { className: "query-count" },
                        xania.tag("span", { className: xania_1.expr("lastSample.countClassName") }, xania_1.expr("lastSample.nbQueries"))),
                    xania.tag(xania_1.Repeat, { source: xania_1.expr("lastSample.topFiveQueries") },
                        xania.tag("td", { className: xania_1.expr("elapsedClassName") },
                            xania_1.expr("formatElapsed"),
                            xania.tag("div", { className: "popover left" },
                                xania.tag("div", { className: "popover-content" }, xania_1.expr("query")),
                                xania.tag("div", { className: "arrow" }))))))));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEseUNBQTBFO0FBUTFFLGFBQW9CLE1BQVk7SUFFNUIsSUFBSSxLQUFLLEdBQUc7UUFDUixTQUFTLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUU7S0FDOUMsQ0FBQztJQUNGLElBQUksS0FBSyxHQUFHLElBQUksZ0JBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFaEMsS0FBSyxDQUFDLGFBQUssQ0FBQztTQUNQLElBQUksQ0FBQyxXQUFHLENBQUMsVUFBVSxDQUFDO1NBQ3BCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxXQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFFOUMsSUFBSSxJQUFJLEdBQUc7UUFDUCxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVoQixVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUM7SUFDRixJQUFJLEVBQUUsQ0FBQztBQUVYLENBQUM7QUFwQkQsa0JBb0JDO0FBRUQsSUFBSSxLQUFLLEdBQVEsVUFBQyxLQUFLO0lBQ25CLE9BQUEscUJBQU8sS0FBSyxFQUFDLGlDQUFpQztRQUMxQztZQUNJLFVBQUMsY0FBTSxJQUFDLE1BQU0sRUFBRSxZQUFJLENBQUMsV0FBVyxDQUFDO2dCQUM3QjtvQkFDSSxrQkFBSSxTQUFTLEVBQUMsUUFBUSxJQUNqQixZQUFJLENBQUMsUUFBUSxDQUFDLENBQ2Q7b0JBQ0wsa0JBQUksU0FBUyxFQUFDLGFBQWE7d0JBQ3ZCLG9CQUFNLFNBQVMsRUFBRSxZQUFJLENBQUMsMkJBQTJCLENBQUMsSUFDN0MsWUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQzFCLENBQ047b0JBQ0wsVUFBQyxjQUFNLElBQUMsTUFBTSxFQUFFLFlBQUksQ0FBQywyQkFBMkIsQ0FBQzt3QkFDN0Msa0JBQUksU0FBUyxFQUFFLFlBQUksQ0FBQyxrQkFBa0IsQ0FBQzs0QkFDbEMsWUFBSSxDQUFDLGVBQWUsQ0FBQzs0QkFDdEIsbUJBQUssU0FBUyxFQUFDLGNBQWM7Z0NBQ3pCLG1CQUFLLFNBQVMsRUFBQyxpQkFBaUIsSUFDM0IsWUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUNaO2dDQUNOLG1CQUFLLFNBQVMsRUFBQyxPQUFPLEdBQU8sQ0FDM0IsQ0FDTCxDQUNBLENBQ1IsQ0FDQSxDQUNMLENBQ0o7QUExQlIsQ0EwQlEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFhhbmlhLCBleHByLCBSZXBlYXQsIFJlYWN0aXZlIGFzIFJlLCBEb20gfSBmcm9tIFwiLi4vLi4vc3JjL3hhbmlhXCJcclxuXHJcbi8vIFJlU2hhcnBlciBkaXNhYmxlIEluY29uc2lzdGVudE5hbWluZ1xyXG5kZWNsYXJlIHZhciBFTlY7XHJcbmRlY2xhcmUgdmFyIE1vbml0b3Jpbmc7XHJcbi8vIFJlU2hhcnBlciByZXN0b3JlIEluY29uc2lzdGVudE5hbWluZ1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBydW4odGFyZ2V0OiBOb2RlKSB7XHJcblxyXG4gICAgdmFyIHN0YXRlID0ge1xyXG4gICAgICAgIGRhdGFiYXNlczogRU5WLmdlbmVyYXRlRGF0YSh0cnVlKS50b0FycmF5KClcclxuICAgIH07XHJcbiAgICB2YXIgc3RvcmUgPSBuZXcgUmUuU3RvcmUoc3RhdGUpO1xyXG5cclxuICAgIGRibW9uKFhhbmlhKVxyXG4gICAgICAgIC5iaW5kKERvbS5Eb21WaXNpdG9yKVxyXG4gICAgICAgIC51cGRhdGUoc3RvcmUsIG5ldyBEb20uRG9tRHJpdmVyKHRhcmdldCkpO1xyXG5cclxuICAgIHZhciBsb2FkID0gKCkgPT4ge1xyXG4gICAgICAgIEVOVi5nZW5lcmF0ZURhdGEodHJ1ZSk7XHJcbiAgICAgICAgc3RvcmUucmVmcmVzaCgpO1xyXG5cclxuICAgICAgICBNb25pdG9yaW5nLnJlbmRlclJhdGUucGluZygpO1xyXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGxvYWQsIEVOVi50aW1lb3V0KTtcclxuICAgIH07XHJcbiAgICBsb2FkKCk7XHJcblxyXG59XHJcblxyXG52YXIgZGJtb246IGFueSA9ICh4YW5pYSkgPT5cclxuICAgIDx0YWJsZSBjbGF6ej1cInRhYmxlIHRhYmxlLXN0cmlwZWQgbGF0ZXN0LWRhdGFcIj5cclxuICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgIDxSZXBlYXQgc291cmNlPXtleHByKFwiZGF0YWJhc2VzXCIpfT5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiZGJuYW1lXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtleHByKFwiZGJuYW1lXCIpfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInF1ZXJ5LWNvdW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17ZXhwcihcImxhc3RTYW1wbGUuY291bnRDbGFzc05hbWVcIil9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2V4cHIoXCJsYXN0U2FtcGxlLm5iUXVlcmllc1wiKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPFJlcGVhdCBzb3VyY2U9e2V4cHIoXCJsYXN0U2FtcGxlLnRvcEZpdmVRdWVyaWVzXCIpfSA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9e2V4cHIoXCJlbGFwc2VkQ2xhc3NOYW1lXCIpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtleHByKFwiZm9ybWF0RWxhcHNlZFwiKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicG9wb3ZlciBsZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwb3BvdmVyLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2V4cHIoXCJxdWVyeVwiKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFycm93XCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8L1JlcGVhdD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgIDwvUmVwZWF0PlxyXG4gICAgICAgIDwvdGJvZHk+XHJcbiAgICA8L3RhYmxlPjsiXX0=