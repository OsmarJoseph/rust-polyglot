fn get_input() -> &'static str {
    return "forward 5
    down 5
    forward 8
    up 3
    down 8
    forward 2";
}

struct Point {
    x: i32,
    y: i32,
}

fn parse_line(line: &str) -> Point {
    let (direction, amount) = line.trim().split_once(" ").expect("line must contain a space");

    let amount: i32 = amount
        .parse::<i32>()
        .expect("second argument must be a number");

    match direction {
        "up" => Point { x: 0, y: -amount },
        "down" => Point { x: 0, y: amount },
        "forward" => Point { x: amount, y: 0 },
        _ => panic!("unknown direction"),
    }
}

fn main() {
    let result = get_input()
        .lines()
        .map(parse_line)
        .fold(Point { x: 0, y: 0 }, |acc, point| Point {
            x: acc.x + point.x,
            y: acc.y + point.y,
        });

    println!("x: {}, y: {}", result.x, result.y);
}
