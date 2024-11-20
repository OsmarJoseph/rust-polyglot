import { assertEquals } from "jsr:@std/assert";
import getConfig, { Operation } from "./config.ts";

Deno.test("should print with no arguments", () => {
  const config = getConfig({});

  assertEquals(config.operation, Operation.Print);
  assertEquals(config.args, []);
});

Deno.test("should print with one arguments", () => {
  const config = getConfig({ args: ["foo"] });

  assertEquals(config.operation, Operation.Print);
  assertEquals(config.args, ["foo"]);
});

Deno.test("should add", () => {
  const config = getConfig({ args: ["add", "foo", "bar"] });

  assertEquals(config.operation, Operation.Add);
  assertEquals(config.args, ["foo", "bar"]);
});

Deno.test("should remove", () => {
  const config = getConfig({ args: ["rm", "foo"] });

  assertEquals(config.operation, Operation.Remove);
  assertEquals(config.args, ["foo"]);
});
