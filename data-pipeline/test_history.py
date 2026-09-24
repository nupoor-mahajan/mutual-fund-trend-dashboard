import json
from pathlib import Path


FILE = Path(
    "data/raw/fund_history.json"
)


with open(
    FILE,
    "r",
    encoding="utf-8"
) as file:

    funds = json.load(file)


print("Funds:", len(funds))

for fund in funds:

    print(
        fund["main_category"],
        "|",
        fund["scheme_name"],
        "| NAV records:",
        len(fund["history"])
    )