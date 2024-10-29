package main

import (
	"fmt"
	"log"
	"strconv"
	"strings"
)

func getInput() string {
	return `forward 5
  down 5
  forward 8
  up 3
  down 8
  forward 2`
}

type Point struct {
	x int
	y int
}

func parseLine(line string) Point {
	line = strings.TrimSpace(line)
	words := strings.Split(line, " ")
	amount, err := strconv.Atoi(words[1])

	if err != nil {
		log.Fatalf("error parsing amount: %v", err)
	}

	if words[0] == "forward" {
		return Point{
			x: amount,
			y: 0,
		}
	} else if words[0] == "up" {
		return Point{
			x: 0,
			y: -amount,
		}
	} else if words[0] == "down" {
		return Point{
			x: 0,
			y: amount,
		}
	}

	return Point{
		x: 0,
		y: 0,
	}
}

func main() {
	lines := strings.Split(getInput(), "\n")

	pos := Point{x: 0, y: 0}

	for _, line := range lines {

		point := parseLine(line)

		pos.x += point.x
		pos.y += point.y
	}

	fmt.Printf("point: %+v", pos)
}
