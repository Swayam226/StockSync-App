import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import sys
import os

# Accept file path from Node.js 
if len(sys.argv) < 2:
    print("Usage: python random_forest_model.py <csv_file_path>")
    sys.exit(1)

csv_path = sys.argv[1]

#Output directory
results_dir = os.path.join(os.path.dirname(__file__), '../results')
os.makedirs(results_dir, exist_ok=True)

#Load and clean dataset
df = pd.read_csv(csv_path)
df.columns = df.columns.str.strip().str.replace('\ufeff', '')

df = df.rename(columns={
    'Number_of_products_sold': 'Units_Sold',
    'Stock_levels': 'Stock_Level',
    'Availability': 'Availability',
    'Order_quantities': 'Order_Quantities',
    'Lead_times': 'Lead_Times',
    'Production_volumes': 'Production_Volumes',
    'Price': 'Price',
    'Manufacturing_costs': 'Manufacturing_Costs',
    'Revenue_generated': 'Revenue',
    'Defect_rates': 'Defect_Rates',
    'Product_type': 'Product_Type',
})

required = [
    'Units_Sold', 'Availability', 'Order_Quantities', 'Lead_Times',
    'Production_Volumes', 'Price', 'Manufacturing_Costs', 'Revenue',
    'Defect_Rates', 'Stock_Level'
]
df = df.dropna(subset=required)

X = df[required[:-1]]
y = df['Stock_Level']

# === Step 4: Scale features and train model ===
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = RandomForestRegressor(n_estimators=200, max_depth=10, random_state=42)
model.fit(X_scaled, y)
y_pred_full = model.predict(X_scaled)

# === Step 5: Save results ===
results = df.copy()
results['Predicted_Stock_Level'] = y_pred_full
threshold = np.percentile(y_pred_full, 10)
results['Stockout_Risk'] = results['Predicted_Stock_Level'] < threshold

# Save JSON output
results_json_path = os.path.join(results_dir, 'predictions.json')
results[['SKU', 'Product_Type', 'Predicted_Stock_Level', 'Stockout_Risk']]\
    .to_json(results_json_path, orient='records', indent=2)

# Optional: save plots


print("Stock predictions saved to:", results_json_path)
