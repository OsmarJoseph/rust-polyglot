fn get_input() -> &'static str {
    "..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#"
}

fn main() {
    let a = get_input()
        .lines()
        .enumerate()
        .filter(|&(i, line)| line.chars().nth((i * 3) % line.len()).unwrap() == '#')
        .count();

    println!("{}", a);
}
