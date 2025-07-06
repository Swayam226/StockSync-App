# combined_models.py

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
import sys
import os
import json

print("=== COMBINED MODEL SCRIPT START ===")

if len(sys.argv) < 2:
    print("Usage: python combined_models.py <csv_file_path>")
    sys.exit(1)

input_path = sys.argv[1]
print("Input path received:", input_path)

# Output directory
output_dir = os.path.join(os.path.dirname(__file__), '../results')
output_dir = os.path.abspath(output_dir)
print("Output directory resolved to:", output_dir)
os.makedirs(output_dir, exist_ok=True)

# === Load and clean dataset ===
df = pd.read_csv(input_path)
df.columns = df.columns.str.strip().str.replace('\ufeff', '')
print("Columns read:", df.columns.tolist())

# Rename common columns
df = df.rename(columns={
    'Number_of_products_sold': 'Units_Sold',
    'Revenue_generated': 'Revenue',
    'Product_type': 'Product_Type',
    'SKU': 'SKU',
    'Stock_levels': 'Stock_Level',
    'Availability': 'Availability',
    'Order_quantities': 'Order_Quantities',
    'Lead_times': 'Lead_Times',
    'Production_volumes': 'Production_Volumes',
    'Price': 'Price',
    'Manufacturing_costs': 'Manufacturing_Costs',
    'Defect_rates': 'Defect_Rates'
})

### ====== MODEL 1: Random Forest Stock Prediction ======

print("Running Random Forest Stock Prediction...")
required = [
    'Units_Sold', 'Availability', 'Order_Quantities', 'Lead_Times',
    'Production_Volumes', 'Price', 'Manufacturing_Costs', 'Revenue',
    'Defect_Rates', 'Stock_Level'
]
df_rf = df.dropna(subset=required)
X = df_rf[required[:-1]]
y = df_rf['Stock_Level']

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = RandomForestRegressor(n_estimators=200, max_depth=10, random_state=42)
model.fit(X_scaled, y)
y_pred_full = model.predict(X_scaled)

# Save Random Forest Results
df_rf['Predicted_Stock_Level'] = y_pred_full
threshold = np.percentile(y_pred_full, 10)
df_rf['Stockout_Risk'] = df_rf['Predicted_Stock_Level'] < threshold

rf_results = df_rf[['SKU', 'Product_Type','Stock_Level','Predicted_Stock_Level', 'Stockout_Risk']]
rf_json_path = os.path.join(output_dir, 'predictions.json')
rf_results.to_json(rf_json_path, orient='records', indent=2)

print(f"Random Forest results saved to: {rf_json_path}")


print("Running Demand Classification...")
df_demand = df.dropna(subset=['Units_Sold', 'Revenue'])
df_demand['Demand_Score'] = (df_demand['Units_Sold'] * 0.5) + (df_demand['Revenue'] * 0.5)

low_thresh = df_demand['Demand_Score'].quantile(0.33)
high_thresh = df_demand['Demand_Score'].quantile(0.66)

def classify_demand(score):
    if score <= low_thresh:
        return "Low"
    elif score <= high_thresh:
        return "Medium"
    else:
        return "High"

df_demand['Demand_Level'] = df_demand['Demand_Score'].apply(classify_demand)
df_demand['Recycle_Recommendation'] = df_demand['Demand_Level'] == "Low"

demand_results = df_demand[['SKU', 'Demand_Level', 'Recycle_Recommendation']]
demand_json_path = os.path.join(output_dir, 'demand.json')
demand_results.to_json(demand_json_path, orient='records', indent=2)

print(f"Demand classification results saved to: {demand_json_path}")

### COMBINE 

print("Combining both model results...")

# Load both results as lists of dicts
with open(rf_json_path, 'r') as f:
    rf_data = json.load(f)

with open(demand_json_path, 'r') as f:
    demand_data = json.load(f)

#  DataFrames 
df_rf_json = pd.DataFrame(rf_data)
df_demand_json = pd.DataFrame(demand_data)

# Merge on SKU (inner join)
combined_df = pd.merge(df_rf_json, df_demand_json, on='SKU', how='outer')

# Save final combined results
final_json_path = os.path.join(output_dir, 'final_combined_results.json')
combined_df.to_json(final_json_path, orient='records', indent=2)

print(f"Final combined results saved to: {final_json_path}")



print("COMBINED MODEL SCRIPT END ")
