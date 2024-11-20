import { parseArgs } from "jsr:@std/cli/parse-args";

export type Opts = {
  args?: string[];
  pwd?: string;
  config?: string;
};

export function getOpts(): Opts {
  const result = parseArgs(Deno.args, {
    string: ["config", "pwd"],
    alias: { c: "config", p: "pwd" },
  });

  return { args: result._.map(String), pwd: result.pwd, config: result.config };
}
