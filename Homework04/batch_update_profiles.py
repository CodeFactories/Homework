import os
import json
import shutil
import re
import time
from datetime import datetime

# Replacement maps
REPLACEMENTS = {
    "enabled": {"status": "enabled", "since": "2024-10-01"},
    "disabled": {"status": "disabled", "since": "2024-10-01"},
    "manage_users": {"permission": "manage_users", "granted_at": "2024-10-05", "level": "full"},
    "view_content": {"permission": "view_content", "granted_at": "2024-09-25", "level": "read-only"},
}

# Email Replacement Map
EMAIL_REPLACEMENT = {
    "@company.com": "@newcompany.com"
}

# Function to replace emails
def replace_email(email):
    for old_domain, new_domain in EMAIL_REPLACEMENT.items():
        if email.endswith(old_domain):
            return email.replace(old_domain, new_domain)
    return email

# Function to apply value replacements
def apply_replacements(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, str):
                # Apply predefined replacements to string values
                if value in REPLACEMENTS:
                    data[key] = REPLACEMENTS[value]
            elif isinstance(value, list):
                # Recursively apply replacements to list elements
                for idx, item in enumerate(value):
                    value[idx] = apply_replacements(item)
            elif isinstance(value, dict):
                data[key] = apply_replacements(value)
    elif isinstance(data, list):
        # Recursively apply replacements to list elements
        for idx, item in enumerate(data):
            data[idx] = apply_replacements(item)
    return data

# Function to process each user profile JSON file
def process_profile(file_path, output_dir):
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)

        # Replace email if present
        if 'email' in data:
            data['email'] = replace_email(data['email'])

        # Apply value replacements to the JSON data
        data = apply_replacements(data)

        # Create output directory structure
        relative_path = os.path.relpath(file_path, 'user_profiles')
        output_path = os.path.join(output_dir, relative_path)
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # Write the modified data to the output directory
        with open(output_path, 'w') as outfile:
            json.dump(data, outfile, indent=4)

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

# Main function to copy the structure and process files
def process_profiles(input_dir, output_dir):
    # Copy the directory structure from input_dir to output_dir
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir_with_timestamp = f"{output_dir}_updated_{timestamp}"

    # Create the output directory
    if os.path.exists(output_dir_with_timestamp):
        shutil.rmtree(output_dir_with_timestamp)
    os.makedirs(output_dir_with_timestamp)

    # Traverse the directory structure and process each JSON file
    for dirpath, dirnames, filenames in os.walk(input_dir):
        for filename in filenames:
            if filename.endswith('.json'):
                file_path = os.path.join(dirpath, filename)
                process_profile(file_path, output_dir_with_timestamp)

    print(f"Profile data has been processed and saved to {output_dir_with_timestamp}")

# Command line entry point
if __name__ == "__main__":
    input_dir = 'user_profiles'  # Directory containing the original profiles
    output_dir = 'user_profiles_updated'  # Base directory for the output
    process_profiles(input_dir, output_dir)
