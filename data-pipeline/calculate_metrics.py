import json
from datetime import datetime, timedelta
from pathlib import Path


INPUT_FILE = Path("data/processed/cleaned_funds.json")
OUTPUT_FILE = Path("data/processed/funds_with_metrics.json")


def load_data():
    with open(
        INPUT_FILE,
        "r",
        encoding="utf-8"
    ) as file:
        return json.load(file)


def parse_date(date_string):
    return datetime.strptime(
        date_string,
        "%Y-%m-%d"
    )


def calculate_return(old_nav, current_nav):
    if old_nav == 0:
        return None

    value = (
        (current_nav - old_nav)
        / old_nav
    ) * 100

    return round(value, 2)


def find_nav_near_date(
    history,
    target_date
):
    """
    Find the NAV record closest to the requested
    historical date, preferring a date on or before
    the target.
    """

    valid_records = []

    for record in history:

        record_date = parse_date(
            record["date"]
        )

        if record_date <= target_date:
            valid_records.append(
                (
                    record_date,
                    record["nav"]
                )
            )

    if not valid_records:
        return None

    # Since history is sorted oldest -> newest,
    # this gives the latest NAV on/before target.
    return valid_records[-1][1]


def calculate_period_return(
    history,
    days
):
    if not history:
        return None

    latest_record = history[-1]

    latest_date = parse_date(
        latest_record["date"]
    )

    current_nav = latest_record["nav"]

    target_date = (
        latest_date
        - timedelta(days=days)
    )

    old_nav = find_nav_near_date(
        history,
        target_date
    )

    if old_nav is None:
        return None

    return calculate_return(
        old_nav,
        current_nav
    )


def calculate_moving_average(
    history,
    days=30
):
    if not history:
        return None

    latest_date = parse_date(
        history[-1]["date"]
    )

    cutoff_date = (
        latest_date
        - timedelta(days=days)
    )

    recent_navs = []

    for record in history:

        record_date = parse_date(
            record["date"]
        )

        if record_date >= cutoff_date:
            recent_navs.append(
                record["nav"]
            )

    if not recent_navs:
        return None

    average = sum(
        recent_navs
    ) / len(recent_navs)

    return round(
        average,
        4
    )


def calculate_trend(
    current_nav,
    moving_average
):
    if moving_average is None:
        return "Unknown"

    if current_nav >= moving_average:
        return "Upward"

    return "Downward"


def process_fund(fund):

    history = fund["history"]

    latest_record = history[-1]

    current_nav = latest_record["nav"]
    latest_date = latest_record["date"]

    moving_average_30d = (
        calculate_moving_average(
            history,
            30
        )
    )

    return {
        "scheme_code":
            fund["scheme_code"],

        "scheme_name":
            fund["scheme_name"],

        "fund_house":
            fund["fund_house"],

        "scheme_type":
            fund["scheme_type"],

        "scheme_category":
            fund["scheme_category"],

        "main_category":
            fund["main_category"],

        "current_nav":
            current_nav,

        "latest_nav_date":
            latest_date,

        "returns": {
            "1m": calculate_period_return(
                history,
                30
            ),

            "3m": calculate_period_return(
                history,
                90
            ),

            "6m": calculate_period_return(
                history,
                180
            ),

            "1y": calculate_period_return(
                history,
                365
            )
        },

        "moving_average_30d":
            moving_average_30d,

        "trend":
            calculate_trend(
                current_nav,
                moving_average_30d
            ),

        "history":
            history
    }


def main():

    funds = load_data()

    processed = []

    print(
        f"Loaded {len(funds)} cleaned funds.\n"
    )

    for fund in funds:

        result = process_fund(
            fund
        )

        processed.append(
            result
        )

        print(
            result["main_category"],
            "|",
            result["scheme_name"]
        )

        print(
            "  NAV:",
            result["current_nav"]
        )

        print(
            "  1M:",
            result["returns"]["1m"],
            "%"
        )

        print(
            "  3M:",
            result["returns"]["3m"],
            "%"
        )

        print(
            "  6M:",
            result["returns"]["6m"],
            "%"
        )

        print(
            "  1Y:",
            result["returns"]["1y"],
            "%"
        )

        print(
            "  30D MA:",
            result[
                "moving_average_30d"
            ]
        )

        print(
            "  Trend:",
            result["trend"]
        )

        print()

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
            processed,
            file,
            indent=2,
            ensure_ascii=False
        )

    print(
        "================================"
    )

    print(
        "METRIC CALCULATION COMPLETE"
    )

    print(
        "================================"
    )

    print(
        f"Funds processed: "
        f"{len(processed)}"
    )

    print(
        f"Saved to: "
        f"{OUTPUT_FILE}"
    )


if __name__ == "__main__":
    main()