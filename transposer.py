import csv

str = """

"""

with open("./data.csv", "w", encoding="utf-8", newline="") as f:

    writer = csv.writer(f)

    str = str.rstrip()
    array = str.split("\n")
    for e in array:
        if e == '\u200b\u200b\u200b': continue
        if e == '': continue;
        e = e.split(":")
        writer.writerow(e)