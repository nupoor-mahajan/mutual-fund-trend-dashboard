import json
from pathlib import Path


INPUT_FILE = Path(
    "data/processed/funds_with_metrics.json"
)

OUTPUT_FILE = Path(
    "../frontend/src/data/funds.json"
)


def main():

    with open(
        INPUT_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        funds = json.load(file)

    frontend_data = []

    for fund in funds:

        frontend_data.append({
            "schemeCode":
                fund["scheme_code"],

            "schemeName":
                fund["scheme_name"],

            "fundHouse":
                fund["fund_house"],

            "category":
                fund["main_category"],

            "subCategory":
                fund["scheme_category"],

            "currentNav":
                fund["current_nav"],

            "latestNavDate":
                fund["latest_nav_date"],

            "trend":
                fund["trend"],

            "movingAverage30d":
                fund["moving_average_30d"],

            "returns":
                fund["returns"],

            "history":
                fund["history"]
        })

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            frontend_data,
            file,
            indent=2,
            ensure_ascii=False
        )

    print(
        f"Frontend dataset created."
    )

    print(
        f"Funds: {len(frontend_data)}"
    )

    print(
        f"Saved to: {OUTPUT_FILE}"
    )


if __name__ == "__main__":
    main()