import re


def main():
    points = []
    with open("temp/copied_from_browser_console.txt", "r") as f:
        lines = f.readlines()
        for i in range(0, len(lines), 3):
            regex = r"{.*}"
            match = re.search(regex, lines[i])
            # The match will look like this:
            # {x: 1006, y: 429}
            # Parse x and y
            x = re.search(r"x: (\d+)", match.group()).group(1)
            y = re.search(r"y: (\d+)", match.group()).group(1)
            points.append((x, y))

    str = "["
    for x, y in points:
        str += f"Point({x}, {y}), "

    str += "]"

    # Print the string we can directly copy into the python code
    print(str)


main()
