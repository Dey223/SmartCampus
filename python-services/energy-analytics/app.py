from flask import Flask, request, jsonify
from flask_cors import CORS
from predictor import EnergyPredictor
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js integration

# Initialize predictor
predictor = EnergyPredictor()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'energy-analytics',
        'version': '1.0.0'
    })

@app.route('/api/predict', methods=['POST'])
def predict_energy():
    """
    Predict energy consumption based on historical data.
    
    Expected JSON body:
    {
        "historical_data": [
            {"timestamp": "2024-01-01T00:00:00", "value": 450.5},
            ...
        ],
        "prediction_days": 7  // optional, default 7
    }
    
    Returns:
    {
        "predictions": [...],
        "peaks": [...],
        "statistics": {...}
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'historical_data' not in data:
            return jsonify({'error': 'Missing historical_data in request'}), 400
        
        historical_data = data['historical_data']
        prediction_days = data.get('prediction_days', 7)
        
        # Validate input
        if not isinstance(historical_data, list) or len(historical_data) < 10:
            return jsonify({'error': 'Need at least 10 historical data points'}), 400
        
        # Train model
        predictor.train(historical_data)
        
        # Generate predictions
        predictions = predictor.predict_next_days(days=prediction_days)
        
        # Detect peaks
        peaks = predictor.detect_peaks(predictions)
        
        # Calculate statistics
        statistics = predictor.calculate_statistics(predictions)
        
        return jsonify({
            'success': True,
            'predictions': predictions,
            'peaks': peaks,
            'statistics': statistics,
            'metadata': {
                'historical_data_points': len(historical_data),
                'prediction_days': prediction_days,
                'generated_at': datetime.now().isoformat()
            }
        })
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_consumption():
    """
    Analyze historical consumption patterns.
    
    Expected JSON body:
    {
        "historical_data": [...]
    }
    """
    try:
        data = request.get_json()
        historical_data = data.get('historical_data', [])
        
        if len(historical_data) < 10:
            return jsonify({'error': 'Need at least 10 data points'}), 400
        
        # Calculate statistics
        import pandas as pd
        df = pd.DataFrame(historical_data)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        
        # Hourly averages
        hourly_avg = df.groupby('hour')['value'].mean().to_dict()
        
        # Daily averages
        daily_avg = df.groupby('day_of_week')['value'].mean().to_dict()
        
        # Overall statistics
        overall_stats = {
            'mean': float(df['value'].mean()),
            'median': float(df['value'].median()),
            'std': float(df['value'].std()),
            'min': float(df['value'].min()),
            'max': float(df['value'].max())
        }
        
        return jsonify({
            'success': True,
            'hourly_patterns': hourly_avg,
            'daily_patterns': daily_avg,
            'overall_statistics': overall_stats
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
