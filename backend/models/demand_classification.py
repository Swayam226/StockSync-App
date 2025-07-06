import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import sys
import os
import json

if len(sys.argv) < 2:
    print("Usage: python demand_classification.py <csv_file_path>")
    sys.exit(1)

input_path = sys.argv[1]

#Output directory 
output_dir = os.path.join(os.path.dirname(__file__), '../results')
os.makedirs(output_dir, exist_ok=True)

# Load and clean the data 
df = pd.read_csv(input_path)

df.columns = df.columns.str.strip().str.replace('\ufeff', '')

# Rename for convenience
df = df.rename(columns={
    'Number_of_products_sold': 'Units_Sold',
    'Revenue_generated': 'Revenue',
    'Product_type': 'Product_Type',
    'SKU': 'SKU'
})

# Drop rows with missing demand data
df = df.dropna(subset=['Units_Sold', 'Revenue'])

# Normalize or combine demand indicators
df['Demand_Score'] = (df['Units_Sold'] * 0.5) + (df['Revenue'] * 0.5)

# Define thresholds based on percentiles
low_thresh = df['Demand_Score'].quantile(0.33)
high_thresh = df['Demand_Score'].quantile(0.66)

def classify_demand(score):
    if score <= low_thresh:
        return "Low"
    elif score <= high_thresh:
        return "Medium"
    else:
        return "High"

# Apply classification
df['Demand_Level'] = df['Demand_Score'].apply(classify_demand)
df['Recycle_Recommendation'] = df['Demand_Level'] == "Low"

# Save results
output_json = os.path.join(output_dir, 'demand.json')
df[['SKU', 'Demand_Level', 'Recycle_Recommendation']].to_json(output_json, orient="records", indent=2)



print("Demand classification complete. Results saved.")
