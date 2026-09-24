import json
import time
from datetime import datetime, timedelta
from pathlib import Path

import requests

from config import MFAPI_BASE_URL


SELECTED_FUNDS_FILE = Path("data/raw/selected_funds.json")
OUTPUT_FILE = Path("data/raw/fund_history.json")

REQUEST_TIMEOUT = 60
REQUEST_DELAY = 0.25

HISTORY_DAYS = 400


def load_selected_funds():
    with open(
        SELECTED_FUNDS_FILE,
        "r",
        encoding="utf-8"
    ) as file:
        return json.load(file)


def fetch_fund_history(scheme_code, max_retries=3):

    url = f"{MFAPI_BASE_URL}/{scheme_code}"

    for attempt in range(1, max_retries + 1):

        try:
            response = requests.get(
                url,
                timeout=120
            )

            response.raise_for_status()

            return response.json()

        except requests.exceptions.Timeout:

            print(
                f"  Timeout on attempt "
                f"{attempt}/{max_retries}"
            )

            if attempt < max_retries:
                time.sleep(5)

        except requests.RequestException as error:

            print(
                f"  API error on attempt "
                f"{attempt}/{max_retries}: {error}"
            )

            if attempt < max_retries:
                time.sleep(5)

    return None


def parse_date(date_string):
    return datetime.strptime(
        date_string,
        "%d-%m-%Y"
    )


def filter_last_year(history):
    if not history:
        return []

    # mfapi gives latest NAV first
    latest_date = parse_date(
        history[0]["date"]
    )

    cutoff_date = (
        latest_date
        - timedelta(days=HISTORY_DAYS)
    )

    filtered = []

    for record in history:

        try:
            record_date = parse_date(
                record["date"]
            )

            if record_date >= cutoff_date:

                filtered.append({
                    "date": record["date"],
                    "nav": record["nav"]
                })

        except (
            KeyError,
            ValueError,
            TypeError
        ):
            continue

    return filtered


def main():

    selected_funds = load_selected_funds()

    print(
        f"Loaded {len(selected_funds)} selected funds.\n"
    )

    final_data = []

    for index, fund in enumerate(
        selected_funds,
        start=1
    ):

        scheme_code = fund["scheme_code"]
        scheme_name = fund["scheme_name"]

        print(
            f"[{index}/{len(selected_funds)}] "
            f"{scheme_code} | {scheme_name}"
        )

        data = fetch_fund_history(
            scheme_code
        )

        if not data:
            print("  FAILED\n")
            continue

        raw_history = data.get(
            "data",
            []
        )

        one_year_history = filter_last_year(
            raw_history
        )

        if not one_year_history:
            print(
                "  FAILED - no usable NAV history\n"
            )
            continue

        latest = one_year_history[0]
        oldest = one_year_history[-1]

        output_fund = {
            "scheme_code": scheme_code,
            "scheme_name": scheme_name,
            "fund_house": fund["fund_house"],
            "scheme_type": fund["scheme_type"],
            "scheme_category": fund["scheme_category"],
            "main_category": fund["main_category"],
            "history": one_year_history
        }

        final_data.append(
            output_fund
        )

        print(
            f"  SAVED {len(one_year_history)} NAV records"
        )

        print(
            f"  Latest: {latest['date']} | "
            f"NAV {latest['nav']}"
        )

        print(
            f"  Oldest: {oldest['date']} | "
            f"NAV {oldest['nav']}\n"
        )

        time.sleep(
            REQUEST_DELAY
        )

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
            final_data,
            file,
            indent=2,
            ensure_ascii=False
        )

    print(
        "================================"
    )

    print(
        "HISTORY DOWNLOAD COMPLETE"
    )

    print(
        "================================"
    )

    print(
        f"Successful funds: {len(final_data)}"
    )

    print(
        f"Expected funds: {len(selected_funds)}"
    )

    print(
        f"Saved to: {OUTPUT_FILE}"
    )


if __name__ == "__main__":
    main()