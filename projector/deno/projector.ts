import type { Config } from "./config.ts";
import { existsSync } from "jsr:@std/fs";
import * as path from "jsr:@std/path";

export type Data = {
  projector: {
    // pwd
    [key: string]: {
      // key    value
      [key: string]: string;
    };
  };
};

const defaultData: Data = {
  projector: {},
};

export class Projector {
  constructor(private readonly config: Config, private readonly data: Data) {
  }
  static fromConfig(config: Config): Projector {
    if (!existsSync(config.configPath)) {
      return new Projector(config, defaultData);
    }

    let data: Data = defaultData;

    try {
      data = JSON.parse(Deno.readTextFileSync(config.configPath));
    } catch {
      data = defaultData;
    }

    return new Projector(config, data);
  }

  getValueAll(): Record<string, string> {
    let current = this.config.pwd;
    let previous = "";
    const paths = [];

    do {
      previous = current;
      paths.push(current);
      current = path.dirname(current);
    } while (current !== previous);

    return paths.reverse().reduce((acc, path) => {
      const value = this.data.projector[path];
      if (value) {
        Object.assign(acc, value);
      }
      return acc;
    }, {});
  }

  getValue(key: string): string | undefined {
    let current = this.config.pwd;
    let previous = "";
    let out: string | undefined = undefined;

    do {
      const value = this.data.projector[current]?.[key];
      if (value) {
        out = value;
        break;
      }
      previous = current;
      current = path.dirname(current);
    } while (current !== previous);

    return out;
  }

  setValue(key: string, value: string) {
    let directoryData = this.data.projector[this.config.pwd];
    if (!directoryData) {
      directoryData = {};
      this.data.projector[this.config.pwd] = directoryData;
    }

    directoryData[key] = value;
  }

  removeValue(key: string) {
    const directoryData = this.data.projector[this.config.pwd];
    if (directoryData) {
      delete directoryData[key];
    }
  }
}
