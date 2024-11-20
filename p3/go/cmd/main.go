package main

import (
	"fmt"
	"strings"
)

type Thing = int

const (
	Tree Thing = iota
	Snow
)

func getInput() string {
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
.#..#...#.#`
}

func main() {
	lines := strings.Split(getInput(), "\n")
	treeCount := 0
	for i, line := range lines {
		if string(line[i*3%len(line)]) == "#" {
			treeCount++
		}
	}

	fmt.Printf("Tree count: %d\n", treeCount)
}
