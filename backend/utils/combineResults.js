function combineResults(predictions, demand) {
    const demandMap = new Map();

    // Index demand data by SKU 
    demand.forEach(item => {
        demandMap.set(item.SKU, item);
    });

    // Combine matched results
    const combined = predictions.map(pred => {
        const demandData = demandMap.get(pred.SKU) || {};

        return {
            SKU: pred.SKU,
            Product_Type: pred.Product_Type || '',
            Predicted_Stock_Level: pred.Predicted_Stock_Level || null,
            Stockout_Risk: pred.Stockout_Risk || false,
            Demand_Level: demandData.Demand_Level || 'Unknown',
            Recycle_Recommendation: demandData.Recycle_Recommendation || false,
        };
    });

    return combined;
}

module.exports = combineResults;
