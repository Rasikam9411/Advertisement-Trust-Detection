import boto3
import csv
import io
import json

s3 = boto3.client("s3")
BUCKET = "rasika-ad-analytics"
OUTPUT_FILE = "results/ad_detection_result.csv"

def lambda_handler(event, context):
    ads = [
        ["A101", "Nike", 120, 24, 90],
        ["A102", "Unknown Brand", 90, 8, 40],
        ["A103", "Apple", 250, 65, 95],
        ["A104", "Unknown Brand", 30, 2, 25]
    ]

    famous_brands = {
        "nike", "apple", "adidas", "samsung",
        "amazon", "microsoft", "coca-cola"
    }

    columns = [
        "Ad ID", "Brand Name", "Clicks", "Conversions",
        "Reputation", "Famous Brand", "Ad Status"
    ]
    results = []

    for ad_id, brand, clicks, conversions, reputation in ads:
        famous = brand.lower() in famous_brands
        status = "Fake Ad" if conversions <= 2 or reputation < 70 else "Trusted Ad"

        results.append({
            "Ad ID": ad_id,
            "Brand Name": brand,
            "Clicks": clicks,
            "Conversions": conversions,
            "Reputation": reputation,
            "Famous Brand": "Yes" if famous else "No",
            "Ad Status": status
        })

    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=columns)
    writer.writeheader()
    writer.writerows(results)

    s3.put_object(
        Bucket=BUCKET,
        Key=OUTPUT_FILE,
        Body=buffer.getvalue().encode("utf-8"),
        ContentType="text/csv"
    )

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({
            "message": "Advertisement analysis completed",
            "results": results,
            "s3_location": f"s3://{BUCKET}/{OUTPUT_FILE}"
        })
    }
