import json
import requests
import time

from config import MFAPI_BASE_URL


SCHEMES_FILE = "data/raw/schemes.json"


def load_schemes():
    with open(
        SCHEMES_FILE,
        "r",
        encoding="utf-8"
    ) as file:
        return json.load(file)


def fetch_fund(scheme_code):

    url = f"{MFAPI_BASE_URL}/{scheme_code}"

    try:
        response = requests.get(
            url,
            timeout=60
        )

        response.raise_for_status()

        return response.json()

    except requests.RequestException as error:
        print(f"Failed {scheme_code}: {error}")
        return None


def main():

    schemes = load_schemes()

    print(f"Loaded {len(schemes)} schemes.\n")

    # Pick schemes containing Growth.
    # This avoids testing ancient dividend variants first.
    growth_schemes = [
        scheme
        for scheme in schemes
        if "growth" in scheme["schemeName"].lower()
    ]

    print(
        f"Found {len(growth_schemes)} schemes "
        f"containing 'Growth'.\n"
    )

    # Inspect first 5 that return valid data
    successful = 0

    for scheme in growth_schemes:

        print("=" * 70)

        print("Code:", scheme["schemeCode"])
        print("Name:", scheme["schemeName"])

        data = fetch_fund(
            scheme["schemeCode"]
        )

        if not data:
            continue

        metadata = data.get("meta", {})
        history = data.get("data", [])

        print("\nMETADATA:")

        print(
            json.dumps(
                metadata,
                indent=2,
                ensure_ascii=False
            )
        )

        print(
            "\nNAV records:",
            len(history)
        )

        if history:
            print(
                "Latest NAV:",
                history[0]
            )

            print(
                "Oldest NAV:",
                history[-1]
            )

        successful += 1

        if successful == 5:
            break

        time.sleep(0.5)


if __name__ == "__main__":
    main()