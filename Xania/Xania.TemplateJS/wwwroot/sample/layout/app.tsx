﻿import { Observables } from "../../src/observables"

import { Xania as xania, Repeat, expr, Dom, Reactive as Re, Template } from "../../src/xania"
import { ClockApp } from "./../clock/app"
import { TodoApp } from "./todo"
import { BallsApp } from "./../balls/app"
import { UrlHelper, HtmlHelper } from "../../src/mvc"

export function store() {
    return new Re.Store({
        time: new Observables.Time(),
        user: { firstName: "Ibrahim", lastName: "ben Salah" },
        size(ts) {
            return Math.floor((ts % 1000) / 50);
        }
    }, [Math]);
}

var layout: any = (view, url: UrlHelper) =>
    <div>
        <h1>{expr("user.firstName")} {expr("user.lastName")}</h1>
        <div style="clear: both;">
            <a href="#" onClick={url.action('todos')}>todos</a>
        </div>
        <div>
            view:
            <button onClick={url.action('index')}>home</button>
            <button onClick={url.action('view1')}>view 1</button>
            <button onClick={url.action('view2')}>view 2</button>
            <button onClick={url.action('clock')}>clock</button>
            <button onClick={url.action('clock2')}>clock 2</button>
            <button onClick={url.action('todos')}>todos</button>
            <button onClick={url.action('balls')}>balls</button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            model:
            <button onClick={expr("user.firstName <- 'Ramy'")}>Ramy</button>
            <button onClick={expr("user.firstName <- 'Ibrahim'")}>Ibrahim</button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            time:
            <button onClick={expr("time.toggle ()")}>toggle</button>
        </div>
        <div style="padding: 10px;">
        </div>
    </div>;


export function execute({ driver, html, url }) {
    var mainView = url.route(path => {
        switch (path) {
            case 'view1':
                return <div>view 1: {expr("user.firstName")} {expr("await time")}</div>;
            case 'view2':
                return (
                    <div>
                        {expr("user.firstName")}
                        <Repeat source={expr("for v in [1..(min (size (await time)) 10)]")}>
                            <p style="margin: 0">{expr("user.firstName")}: {expr("v")}</p>
                        </Repeat>
                        <hr style="padding: 0; margin: 0;" />
                        <Repeat expr={expr("for g in [(1 + min (size (await time)) 10)..10]")}>
                            <p style="margin: 0">{expr("user.lastName")}: {expr("g")}</p>
                        </Repeat>
                    </div>
                );
            case 'clock':
                return <ClockApp time={expr("time")} />;
            case 'clock2':
                return <ClockApp time={expr("time")} />;
            case 'todos':
                return <TodoApp />;
            case 'balls':
                return <BallsApp />;
            default:
                return html.partial(path, {});
        }
    });

    // xania.view(layout(mainView, url))
       // .bind(store(), driver);
}