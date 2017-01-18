﻿/// <reference path="../node_modules/@types/jasmine/index.d.ts" />

import { Template } from "../src/template";
import { fsharp as fs } from "../src/fsharp";
import { Dom } from "../src/dom";
import { Reactive as Re } from '../src/reactive';
import { Observables } from '../src/observables';
// import { Core } from "../src/core";

interface IPerson { firstName: string; lastName: string; adult: boolean, age: number, roles: string[] }

var ibrahim: IPerson, ramy: IPerson;

class RootDom {
    private dom = document.createDocumentFragment();

    insert(dom, insertAt) {
        if (insertAt < this.dom.childNodes.length) {
            var beforeElement = this.dom.childNodes[insertAt];
            this.dom.insertBefore(dom, beforeElement);
        } else {
            this.dom.appendChild(dom);
        }
        console.log("insert", dom, insertAt);
    }

    get childNodes() {
        return this.dom.childNodes;
    }
}

describe("templating",
    () => {

        beforeEach(() => {
            ibrahim = {
                age: 36,
                firstName: "Ibrahim",
                lastName: "ben Salah",
                adult: true,
                roles: ["developer"]
            };
            ramy = {
                age: 5,
                firstName: "Ramy",
                lastName: "ben Salah",
                adult: false,
                roles: []
            };
        });


        it("text binding",
            () => {
                var store = new Re.Store({ p: ibrahim });
                var binding = new Dom.TextBinding(fs("p.firstName")).update(store);

                store.get("p").get("firstName").set("bla");
                expect(binding.dom.textContent).toBe("Ibrahim");
                store.flush();
                expect(binding.dom.textContent).toBe("bla");

                expect(store.dirty.length).toBe(0);
                expect(binding.dependencies.length).toBe(2);
            });

        it("content binding",
            () => {
                var store = new Re.Store({ people: [ibrahim, ramy] });
                var fragment = new RootDom();
                var binding = new Dom.ContentBinding(fs("for p in people"), fragment.insert.bind(fragment),
                    [
                        new Template.TextTemplate(fs("p.firstName + ' ' + p.lastName")),
                        new Template.ContentTemplate(fs("for r in p.roles"))
                            .child(new Template.TextTemplate(fs("':: ' + r")))
                    ])
                    .update(store);

                console.log(fragment.childNodes);
                expect(fragment.childNodes.length).toBe(3);

                store.get("people").get(1).get("roles").set(["zoon"]);
                store.flush();

                console.log(fragment.childNodes);
                expect(fragment.childNodes.length).toBe(4);

                store.get("people").get(0).get("roles").set(["papa"]);
                store.flush();
                console.log(fragment.childNodes);
            });

        it("tag class binding",
            () => {
                var binding = new Dom.TagBinding("div")
                    .attr("class", fs("p.firstName"))
                    .attr("class.adult-person", fs("p.adult"));

                binding.update(new Re.Store({ p: ibrahim }));
                expect(binding.dom.className).toBe("Ibrahim adult-person");

                binding.update(new Re.Store({ p: ramy }));
                expect(binding.dom.className).toBe("Ramy");
            });

        it("tag attribute binding",
            () => {
                var binding = new Dom.TagBinding("div")
                    .attr("id", fs('p.age'));

                binding.update(new Re.Store({ p: ibrahim }));
                expect(binding.dom.id).toBe('36');

                binding.update(new Re.Store({ p: ramy }));
                expect(binding.dom.id).toBe('5');
            });

        it("tag children binding",
            () => {
                var store = new Re.Store({ p: ibrahim });
                var div = new Dom.TagBinding("div")
                    .attr("data-age", fs("p.age"))
                    .text(fs("p.firstName"))
                    .update(store);

                expect(div.dom.childNodes.length).toBe(1);
                expect(div.dom.textContent).toBe('Ibrahim');

                store.get('p').get('firstName').set('IBRAHIM');
                store.flush();

                expect(div.dom.textContent).toBe('IBRAHIM');
                console.log(div.dom);
            });


        it("tag event binding",
            () => {
                var store = new Re.Store({
                    p: {
                        message: null,
                        sayHello(user = 'Jasmine') {
                            this.message = "Hello, " + user + "!";
                        }
                    }
                });
                var button = new Dom.TagBinding("button")
                    .on("click", fs("p.sayHello"))
                    .update(store);

                button.trigger('click');

                expect(store.get('p').get('message').valueOf()).toBe("Hello, Jasmine!");
            });

        it("supports streams",
            () => {
                var stream = new Observables.Observable<number>();

                var binding = new Dom.TextBinding(fs("stream")).update(new Re.Store({ stream }));
                expect(binding.dom.textContent).toBe("");

                stream.onNext(123);
                expect(binding.dom.textContent).toBe("123");

                stream.onNext(456);
                expect(binding.dom.textContent).toBe("456");
            });
    });