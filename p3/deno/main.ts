function getInput(): string {
  return `..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`;
}

enum Thing {
  Tree,
  Snow,
}

const things = getInput()
  .split("\n")
  .map((row) =>
    row.split("").map((cell) => (cell === "#" ? Thing.Tree : Thing.Snow))
  );

let treeCount = 0

const width = things[0].length;
things.forEach((row, i) => {
  if (row[(i * 3) % width] === Thing.Tree) {
    treeCount++;
  }
});

console.log(treeCount);
