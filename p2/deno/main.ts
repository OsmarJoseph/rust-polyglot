type Point = {
  x: number;
  y: number;
};

function getInput(): string {
  return `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`;
}

type Line = {
  p1: Point;
  p2: Point;
};

function isHorOrVer(line: Line): boolean {
  return line.p1.x === line.p2.x || line.p1.y === line.p2.y;
}

function parsePoint(point: string): Point {
  const [x, y] = point.split(",").map(Number);
  return { x, y };
}
function parseLine(point: string): Line {
  const [p1, p2] = point.split(" -> ");
  return { p1: parsePoint(p1), p2: parsePoint(p2) };
}

const lines = getInput().split("\n").map(parseLine).filter(isHorOrVer);

console.log(lines); 
