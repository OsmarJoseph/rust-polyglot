import type { Opts } from "./opts.ts";
import * as path from "jsr:@std/path";

export enum Operation {
  Print,
  Add,
  Remove,
}

export type Config = {
  args: string[];
  operation: Operation;
  configPath: string;
  pwd: string;
};

function getPwd(opts: Opts): string {
  return opts.pwd || Deno.cwd();
}

function getConfigPath(opts: Opts): string {
  if (opts.config) {
    return opts.config;
  }

  const home = Deno.env.get("HOME");

  const location = Deno.env.get("XDG_CONFIG_HOME") || home;

  if (!location) {
    throw new Error("No config location found");
  }

  if (location === home) {
    return path.join(location, ".projector.json");
  }

  return path.join(location, "projector", "projector.json");
}

function getOperation(opts: Opts): Operation {
  if (!opts.args?.length || opts.args.length === 0) {
    return Operation.Print;
  }

  if (opts.args[0] === "add") {
    return Operation.Add;
  }

  if (opts.args[0] === "rm") {
    return Operation.Remove;
  }

  return Operation.Print;
}

function getArgs(opts: Opts, operation: Operation): string[] {
  if (!opts.args?.length || opts.args.length === 0) {
    return [];
  }

  if (operation === Operation.Print) {
    if (opts.args.length != 1) {
      throw new Error("Invalid number of arguments");
    }

    return opts.args;
  }

  if (operation === Operation.Add) {
    if (opts.args.length !== 3) {
      throw new Error("Invalid number of arguments");
    }

    return opts.args.slice(1);
  }

  if (operation === Operation.Remove) {
    if (opts.args.length !== 2) {
      throw new Error("Invalid number of arguments");
    }

    return opts.args.slice(1);
  }

  return [];
}

export default function getConfig(opts: Opts): Config {
  const operation = getOperation(opts);
  return {
    pwd: getPwd(opts),
    configPath: getConfigPath(opts),
    args: getArgs(opts, operation),
    operation,
  };
}
