import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
from typing import List, Dict, Any

class EnergyPredictor:
    """
    Energy consumption predictor using Linear Regression.
    Analyzes historical data and predicts future consumption.
    """
    
    def __init__(self):
        self.model = LinearRegression()
        
    def prepare_data(self, historical_data: List[Dict[str, Any]]) -> tuple:
        """
        Prepare historical data for training.
        
        Args:
            historical_data: List of dicts with 'timestamp' and 'value' keys
            
        Returns:
            Tuple of (X, y) for training
        """
        if not historical_data:
            return None, None
            
        df = pd.DataFrame(historical_data)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
        
        # Extract features
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        df['day_of_year'] = df['timestamp'].dt.dayofyear
        
        # Features: hour, day_of_week, day_of_year
        X = df[['hour', 'day_of_week', 'day_of_year']].values
        y = df['value'].values
        
        return X, y
    
    def train(self, historical_data: List[Dict[str, Any]]):
        """Train the model on historical data."""
        X, y = self.prepare_data(historical_data)
        
        if X is None or len(X) < 10:
            raise ValueError("Insufficient data for training (need at least 10 data points)")
        
        self.model.fit(X, y)
        
    def predict_next_days(self, days: int = 7, start_date: datetime = None) -> List[Dict[str, Any]]:
        """
        Predict energy consumption for the next N days.
        
        Args:
            days: Number of days to predict
            start_date: Starting date for predictions (default: tomorrow)
            
        Returns:
            List of predictions with timestamp and predicted value
        """
        if start_date is None:
            start_date = datetime.now() + timedelta(days=1)
        
        predictions = []
        
        # Generate hourly predictions for each day
        for day in range(days):
            current_date = start_date + timedelta(days=day)
            
            for hour in range(24):
                prediction_time = current_date.replace(hour=hour, minute=0, second=0, microsecond=0)
                
                # Prepare features
                features = np.array([[
                    hour,
                    prediction_time.weekday(),
                    prediction_time.timetuple().tm_yday
                ]])
                
                # Predict
                predicted_value = self.model.predict(features)[0]
                
                predictions.append({
                    'timestamp': prediction_time.isoformat(),
                    'value': max(0, float(predicted_value))  # Ensure non-negative
                })
        
        return predictions
    
    def detect_peaks(self, predictions: List[Dict[str, Any]], threshold_percentile: int = 90) -> List[Dict[str, Any]]:
        """
        Detect peak consumption periods.
        
        Args:
            predictions: List of predictions
            threshold_percentile: Percentile threshold for peak detection
            
        Returns:
            List of peak periods
        """
        values = [p['value'] for p in predictions]
        threshold = np.percentile(values, threshold_percentile)
        
        peaks = [
            {
                'timestamp': p['timestamp'],
                'value': p['value'],
                'severity': 'high' if p['value'] > threshold * 1.1 else 'medium'
            }
            for p in predictions
            if p['value'] >= threshold
        ]
        
        return peaks
    
    def calculate_statistics(self, predictions: List[Dict[str, Any]]) -> Dict[str, float]:
        """Calculate statistics from predictions."""
        values = [p['value'] for p in predictions]
        
        return {
            'mean': float(np.mean(values)),
            'median': float(np.median(values)),
            'std': float(np.std(values)),
            'min': float(np.min(values)),
            'max': float(np.max(values)),
            'total': float(np.sum(values))
        }
