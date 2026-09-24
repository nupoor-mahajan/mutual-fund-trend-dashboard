import json
from pathlib import Path


FILE = Path(
    "data/processed/funds_with_metrics.json"
)


with open(
    FILE,
    "r",
    encoding="utf-8"
) as file:

    funds = json.load(file)


print(
    "Total funds:",
    len(funds)
)


categories = {
    "Equity": 0,
    "Debt": 0,
    "Hybrid": 0
}


trends = {
    "Upward": 0,
    "Downward": 0,
    "Unknown": 0
}


for fund in funds:

    categories[
        fund["main_category"]
    ] += 1

    trends[
        fund["trend"]
    ] += 1


print("\nCategories:")

for category, count in categories.items():

    print(
        category,
        ":",
        count
    )


print("\nTrends:")

for trend, count in trends.items():

    print(
        trend,
        ":",
        count
    )


print("\nSample fund:\n")

sample = funds[0]

print(
    "Name:",
    sample["scheme_name"]
)

print(
    "Category:",
    sample["main_category"]
)

print(
    "NAV:",
    sample["current_nav"]
)

print(
    "30-day average:",
    sample["moving_average_30d"]
)

print(
    "Trend:",
    sample["trend"]
)

print(
    "Returns:",
    sample["returns"]
)