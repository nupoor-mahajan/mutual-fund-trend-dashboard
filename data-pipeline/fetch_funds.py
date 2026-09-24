import json
import os
import time
import requests

from config import MFAPI_BASE_URL


RAW_DATA_DIRECTORY = "data/raw"
SCHEMES_FILE = os.path.join(
    RAW_DATA_DIRECTORY,
    "schemes.json"
)


def fetch_all_schemes(max_retries=3):

    print("Fetching mutual fund schemes from mfapi.in...")

    for attempt in range(1, max_retries + 1):

        try:
            print(f"Attempt {attempt}/{max_retries}")

            response = requests.get(
                MFAPI_BASE_URL,
                timeout=120
            )

            response.raise_for_status()

            schemes = response.json()

            print("API response received.")

            return schemes

        except requests.exceptions.Timeout:

            print("Request timed out.")

            if attempt < max_retries:
                print("Retrying in 5 seconds...\n")
                time.sleep(5)

        except requests.exceptions.RequestException as error:
            print("Request failed:")
            print(error)
            raise

    raise Exception(
        "mfapi.in did not respond after multiple attempts."
    )


def save_schemes(schemes):

    os.makedirs(
        RAW_DATA_DIRECTORY,
        exist_ok=True
    )

    with open(
        SCHEMES_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            schemes,
            file,
            indent=2,
            ensure_ascii=False
        )


def main():

    try:

        schemes = fetch_all_schemes()

        save_schemes(schemes)

        print(
            f"\nSuccessfully fetched {len(schemes)} schemes."
        )

        print(
            f"Saved to: {SCHEMES_FILE}"
        )

        print("\nFirst 10 schemes:\n")

        for scheme in schemes[:10]:

            print(
                f"{scheme['schemeCode']} | "
                f"{scheme['schemeName']}"
            )

    except Exception as error:

        print("\nFailed:")
        print(error)


if __name__ == "__main__":
    main()