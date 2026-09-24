import json
import time
from datetime import datetime, timedelta
from pathlib import Path

import requests

from config import MFAPI_BASE_URL


SCHEMES_FILE = Path("data/raw/schemes.json")
OUTPUT_FILE = Path("data/raw/selected_funds.json")

TARGET_PER_CATEGORY = 10

# Consider a fund active if the latest NAV
# is not older than 30 days.
MAX_DATA_AGE_DAYS = 30

# Avoid selecting too many schemes from one AMC/fund house.
MAX_PER_FUND_HOUSE_PER_CATEGORY = 2

REQUEST_TIMEOUT = 60
REQUEST_DELAY = 0.25


def load_schemes():
    with open(
        SCHEMES_FILE,
        "r",
        encoding="utf-8"
    ) as file:
        return json.load(file)


def fetch_fund_details(scheme_code):
    url = f"{MFAPI_BASE_URL}/{scheme_code}"

    try:
        response = requests.get(
            url,
            timeout=REQUEST_TIMEOUT
        )

        response.raise_for_status()

        return response.json()

    except requests.RequestException as error:
        print(
            f"  SKIP - API error for {scheme_code}: {error}"
        )
        return None


def get_main_category(scheme_category):
    """
    Convert mfapi scheme_category into our
    three dashboard categories.
    """

    category = scheme_category.lower()

    if "hybrid" in category:
        return "Hybrid"

    if "equity" in category:
        return "Equity"

    if "debt" in category:
        return "Debt"

    return None


def parse_nav_date(date_string):
    return datetime.strptime(
        date_string,
        "%d-%m-%Y"
    )


def has_recent_nav(history):
    """
    mfapi returns latest NAV first.

    Example:
    history[0] = latest NAV
    history[-1] = oldest NAV
    """

    if not history:
        return False

    try:
        latest_date = parse_nav_date(
            history[0]["date"]
        )

    except (KeyError, ValueError):
        return False

    today = datetime.now()

    age = today - latest_date

    return age.days <= MAX_DATA_AGE_DAYS


def has_one_year_history(history):
    if len(history) < 2:
        return False

    try:
        latest_date = parse_nav_date(
            history[0]["date"]
        )

        oldest_date = parse_nav_date(
            history[-1]["date"]
        )

    except (KeyError, ValueError):
        return False

    return (
        latest_date - oldest_date
        >= timedelta(days=365)
    )


def is_growth_scheme(scheme_name):

    name = scheme_name.lower()

    excluded_terms = [
        "idcw",
        "dividend"
    ]

    if any(term in name for term in excluded_terms):
        return False

    return "growth" in name


def category_is_full(selected, category):
    return (
        len(selected[category])
        >= TARGET_PER_CATEGORY
    )


def all_categories_full(selected):
    return all(
        category_is_full(
            selected,
            category
        )
        for category in selected
    )


def fund_house_limit_reached(
    selected,
    category,
    fund_house
):
    count = sum(
        1
        for fund in selected[category]
        if fund["fund_house"] == fund_house
    )

    return (
        count
        >= MAX_PER_FUND_HOUSE_PER_CATEGORY
    )


def main():
    schemes = load_schemes()

    selected = {
        "Equity": [],
        "Debt": [],
        "Hybrid": []
    }

    # Keep Growth schemes only.
    candidates = [
        scheme
        for scheme in schemes
        if is_growth_scheme(
            scheme.get(
                "schemeName",
                ""
            )
        )
    ]

    print(
        f"Loaded {len(schemes)} schemes."
    )

    print(
        f"Growth candidates: {len(candidates)}\n"
    )

    for index, scheme in enumerate(
        candidates,
        start=1
    ):

        if all_categories_full(selected):
            break

        scheme_code = scheme.get(
            "schemeCode"
        )

        scheme_name = scheme.get(
            "schemeName",
            ""
        )

        print(
            f"[{index}/{len(candidates)}] "
            f"{scheme_code} | {scheme_name}"
        )

        data = fetch_fund_details(
            scheme_code
        )

        if not data:
            continue

        metadata = data.get(
            "meta",
            {}
        )

        history = data.get(
            "data",
            []
        )

        scheme_category = metadata.get(
            "scheme_category",
            ""
        )

        main_category = get_main_category(
            scheme_category
        )

        if main_category is None:
            print(
                f"  SKIP - unsupported category: "
                f"{scheme_category}"
            )
            continue

        if category_is_full(
            selected,
            main_category
        ):
            print(
                f"  SKIP - {main_category} already full"
            )
            continue

        if not has_recent_nav(history):
            print(
                "  SKIP - latest NAV is stale"
            )
            continue

        if not has_one_year_history(history):
            print(
                "  SKIP - less than 1 year history"
            )
            continue

        fund_house = metadata.get(
            "fund_house",
            "Unknown"
        )

        if fund_house_limit_reached(
            selected,
            main_category,
            fund_house
        ):
            print(
                f"  SKIP - already selected enough "
                f"{fund_house} schemes in "
                f"{main_category}"
            )
            continue

        latest_nav = history[0]

        selected_fund = {
            "scheme_code": metadata.get(
                "scheme_code",
                scheme_code
            ),

            "scheme_name": metadata.get(
                "scheme_name",
                scheme_name
            ),

            "fund_house": fund_house,

            "scheme_type": metadata.get(
                "scheme_type"
            ),

            "scheme_category":
                scheme_category,

            "main_category":
                main_category,

            "latest_nav": float(
                latest_nav["nav"]
            ),

            "latest_nav_date":
                latest_nav["date"],

            "nav_record_count":
                len(history)
        }

        selected[
            main_category
        ].append(
            selected_fund
        )

        print(
            f"  SELECTED -> {main_category}"
        )

        print(
            "  Progress: "
            f"Equity "
            f"{len(selected['Equity'])}/"
            f"{TARGET_PER_CATEGORY} | "
            f"Debt "
            f"{len(selected['Debt'])}/"
            f"{TARGET_PER_CATEGORY} | "
            f"Hybrid "
            f"{len(selected['Hybrid'])}/"
            f"{TARGET_PER_CATEGORY}"
        )

        time.sleep(
            REQUEST_DELAY
        )

    final_funds = (
        selected["Equity"]
        + selected["Debt"]
        + selected["Hybrid"]
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
            final_funds,
            file,
            indent=2,
            ensure_ascii=False
        )

    print(
        "\n================================"
    )

    print(
        "SELECTION COMPLETE"
    )

    print(
        "================================"
    )

    print(
        f"Equity: "
        f"{len(selected['Equity'])}"
    )

    print(
        f"Debt: "
        f"{len(selected['Debt'])}"
    )

    print(
        f"Hybrid: "
        f"{len(selected['Hybrid'])}"
    )

    print(
        f"Total: "
        f"{len(final_funds)}"
    )

    print(
        f"\nSaved to: "
        f"{OUTPUT_FILE}"
    )

    if not all_categories_full(selected):

        print(
            "\nWARNING:"
        )

        print(
            "Could not find enough valid schemes "
            "for every category."
        )


if __name__ == "__main__":
    main()