enum Direction {
  forward = "forward",
  down = "down",
  up = "up",
}

const getInput = (): string => {
  return `forward 5
    down 5
    forward 8
    up 3
    down 8
    forward 2`;
};

const parseLine = (line: string): [number, number] => {
  const [direction, value] = line.trim().split(" ");

  const amount = +value;

  switch (direction) {
    case Direction.forward:
      return [amount, 0];
    case Direction.up:
      return [0, -amount];
    case Direction.down:
      return [0, amount];
    default:
      return [0, 0];
  }
};

const items = getInput()
  .split("\n")
  .map(parseLine)
  .reduce((acc, amount) => {
    acc[0] += amount[0];
    acc[1] += amount[1];

    return acc;
  }, [0, 0]);

console.log(items, items[0] * items[1]);
