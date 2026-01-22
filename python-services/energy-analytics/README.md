# Energy Analytics Python Service

Service d'analyse et de prédiction de la consommation énergétique utilisant Machine Learning.

## 🚀 Démarrage Rapide

### Installation

```bash
cd python-services/energy-analytics
pip install -r requirements.txt
```

### Lancement

```bash
python app.py
```

Le service sera accessible sur `http://localhost:5000`

## 📡 API Endpoints

### 1. Health Check
```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "energy-analytics",
  "version": "1.0.0"
}
```

### 2. Predict Energy Consumption
```bash
POST /api/predict
```

**Request Body:**
```json
{
  "historical_data": [
    {"timestamp": "2024-01-01T00:00:00", "value": 450.5},
    {"timestamp": "2024-01-01T01:00:00", "value": 420.3}
  ],
  "prediction_days": 7
}
```

**Response:**
```json
{
  "success": true,
  "predictions": [
    {"timestamp": "2024-01-08T00:00:00", "value": 445.2}
  ],
  "peaks": [
    {"timestamp": "2024-01-08T14:00:00", "value": 890.5, "severity": "high"}
  ],
  "statistics": {
    "mean": 456.7,
    "median": 450.2,
    "std": 120.5,
    "min": 200.0,
    "max": 900.0,
    "total": 76512.0
  }
}
```

### 3. Analyze Consumption Patterns
```bash
POST /api/analyze
```

## 🧠 Algorithme

Le service utilise **Linear Regression** (scikit-learn) avec les features suivantes :
- Heure de la journée (0-23)
- Jour de la semaine (0-6)
- Jour de l'année (1-365)

## 🐳 Docker

Le service est automatiquement inclus dans `docker-compose.yml`.

## 🔧 Technologies

- **Flask** - Web framework
- **pandas** - Data manipulation
- **scikit-learn** - Machine Learning
- **numpy** - Numerical computations
