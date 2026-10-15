# Advertisement Trust Detection System

A demonstration project using Python, AWS Lambda, API Gateway and Amazon S3.

## Features
- Advertisement results displayed in a webpage table
- Sample trusted/fake labels using illustrative rules
- CSV download from the webpage
- Lambda source code that stores CSV results in Amazon S3

## Files
- `index.html`: dashboard layout
- `style.css`: styling
- `app.js`: table rendering and optional API connection
- `lambda_function.py`: AWS Lambda function
- `README.md`: project details

## Important
The webpage initially shows sample data. To use live AWS results, set `API_URL` in `app.js` to your deployed API Gateway `/ask` endpoint and configure API Gateway CORS. The Lambda execution role needs permission to write to the configured S3 results path.

This demonstration uses sample data and rule-based classification. It is not a trained machine-learning model.
