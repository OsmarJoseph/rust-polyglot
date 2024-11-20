import { assertEquals } from "jsr:@std/assert";
import { Operation } from "./config.ts";
import { type Data, Projector } from "./projector.ts";

function createData(): Data {
  return {
    projector: {
      "/": {
        foo: "bar1",
        fem: "is",
      },
      "/foo": {
        "foo": "bar2",
      },
      "/foo/bar": {
        "foo": "bar3",
      },
    },
  };
}

function getProjector(pwd: string, data = createData()): Projector {
  return new Projector({
    args: [],
    operation: Operation.Print,
    pwd,
    configPath: "",
  }, data);
}

Deno.test("getValueAll", () => {
  const projector = getProjector("/foo/bar");

  assertEquals(projector.getValueAll(), {
    "fem": "is",
    "foo": "bar3",
  });
});

Deno.test("getValue", () => {
  let projector = getProjector("/foo/bar");

  assertEquals(projector.getValue("foo"), "bar3");

  projector = getProjector("/foo");

  assertEquals(projector.getValue("foo"), "bar2");

  assertEquals(projector.getValue("fem"), "is");
});

Deno.test("setValue", () => {
  const data = createData();
  let projector = getProjector("/foo/bar", data);

  projector.setValue("foo", "bar4");
  assertEquals(projector.getValue("foo"), "bar4");

  projector.setValue("baz", "foo");
  assertEquals(projector.getValue("baz"), "foo");

  projector.setValue("fem", "is not");
  assertEquals(projector.getValue("fem"), "is not");

  projector = getProjector("/", data);
  assertEquals(projector.getValue("fem"), "is");
});

Deno.test("removeValue", () => {
  const projector = getProjector("/foo/bar");

  assertEquals(projector.getValue("foo"), "bar3");
  projector.removeValue("foo");
  assertEquals(projector.getValue("foo"), "bar2");
});
