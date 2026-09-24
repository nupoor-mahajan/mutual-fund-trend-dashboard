import json
from datetime import datetime
from pathlib import Path


INPUT_FILE = Path("data/raw/fund_history.json")
OUTPUT_FILE = Path("data/processed/cleaned_funds.json")


def load_raw_data():
    with open(
        INPUT_FILE,
        "r",
        encoding="utf-8"
    ) as file:
        return json.load(file)


def convert_date(date_string):
    """
    Convert:
    18-09-2026

    into:
    2026-09-18
    """

    parsed = datetime.strptime(
        date_string,
        "%d-%m-%Y"
    )

    return parsed.strftime(
        "%Y-%m-%d"
    )


def clean_history(history):
    cleaned = []

    for record in history:

        try:
            clean_record = {
                "date": convert_date(
                    record["date"]
                ),
                "nav": float(
                    record["nav"]
                )
            }

            cleaned.append(
                clean_record
            )

        except (
            KeyError,
            ValueError,
            TypeError
        ):
            continue

    # Sort oldest -> newest
    cleaned.sort(
        key=lambda item: item["date"]
    )

    return cleaned


def main():

    raw_funds = load_raw_data()

    cleaned_funds = []

    print(
        f"Loaded {len(raw_funds)} funds.\n"
    )

    for fund in raw_funds:

        history = clean_history(
            fund["history"]
        )

        if not history:
            print(
                "SKIP:",
                fund["scheme_name"]
            )
            continue

        cleaned_fund = {
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

            "history":
                history
        }

        cleaned_funds.append(
            cleaned_fund
        )

        print(
            fund["main_category"],
            "|",
            fund["scheme_name"],
            "|",
            len(history),
            "records"
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
            cleaned_funds,
            file,
            indent=2,
            ensure_ascii=False
        )

    print(
        "\n================================"
    )

    print(
        "CLEANING COMPLETE"
    )

    print(
        "================================"
    )

    print(
        f"Funds cleaned: {len(cleaned_funds)}"
    )

    print(
        f"Saved to: {OUTPUT_FILE}"
    )


if __name__ == "__main__":
    main()