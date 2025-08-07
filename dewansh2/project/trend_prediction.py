import pandas as pd
import numpy as np
import os
import json
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score

def train_prediction_model(stock_df, ticker_symbol):
    """
    Trains a highly accurate, hyperparameter-tuned RandomForest model.
    """
    try:
        import pandas_ta as ta
        stock_df.ta.macd(append=True)
        stock_df.ta.atr(append=True)
        stock_df.ta.stoch(append=True)
    except ImportError:
        print("Warning: pandas-ta not found. Run 'pip install pandas-ta' for best accuracy.")

    features = ['SMA_50', 'SMA_200', 'RSI_14', 'MACD_12_26_9', 'ATRr_14', 'STOCHk_14_3_3']
    features = [f for f in features if f in stock_df.columns]

    stock_df['future_5d_close'] = stock_df['Close'].shift(-5)
    stock_df['target'] = (stock_df['future_5d_close'] > stock_df['Close']).astype(int)
    model_data = stock_df.dropna()
    
    if model_data.empty or len(model_data) < 100:
        return None, []

    X = model_data[features]
    y = model_data['target']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    param_grid = {'n_estimators': [100, 200], 'max_depth': [10, 20, None]}
    rf = RandomForestClassifier(random_state=42, n_jobs=-1)
    grid_search = GridSearchCV(estimator=rf, param_grid=param_grid, cv=3, n_jobs=-1, verbose=0)
    
    grid_search.fit(X_train, y_train)
    best_model = grid_search.best_estimator_
    
    accuracy = accuracy_score(y_test, best_model.predict(X_test))
    print(f"Background training for {ticker_symbol} complete. Tuned Model Accuracy: {accuracy:.2f}")
    
    return best_model, features

def get_stock_analysis(ticker_symbol, df):
    """
    Generates the final analysis with trend, prediction, and a price target.
    """
    stock_df = df[df['Ticker'] == ticker_symbol].copy()
    if stock_df.empty: 
        return {"error": "Ticker not found"}
        
    stock_df['Date'] = pd.to_datetime(stock_df['Date'], dayfirst=True, errors='coerce')
    stock_df.sort_values('Date', inplace=True)
    
    # --- Calculate All Indicators ---
    stock_df['SMA_50'] = stock_df['Close'].rolling(window=50).mean()
    stock_df['SMA_200'] = stock_df['Close'].rolling(window=200).mean()
    delta = stock_df['Close'].diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(window=14).mean()
    avg_loss = loss.rolling(window=14).mean()
    stock_df['RSI_14'] = 100 - (100 / (1 + (avg_gain / avg_loss)))
    stock_df['BB_MID'] = stock_df['Close'].rolling(window=20).mean()
    stock_df['BB_STD'] = stock_df['Close'].rolling(window=20).std()
    stock_df['BB_UPPER'] = stock_df['BB_MID'] + 2 * stock_df['BB_STD']
    stock_df['BB_LOWER'] = stock_df['BB_MID'] - 2 * stock_df['BB_STD']

    # --- Train Model and Get Prediction ---
    prediction_model, features = train_prediction_model(stock_df.copy(), ticker_symbol)
    
    stock_df.dropna(subset=['SMA_50', 'SMA_200', 'RSI_14', 'BB_UPPER', 'BB_LOWER'], inplace=True)
    if stock_df.empty: 
        return {"error": "Not enough historical data for a full analysis"}

    latest_data = stock_df.iloc[-1]

    # --- Generate Analysis & Prediction based on the LAST day ---
    long_term_outlook = "Uptrend" if latest_data['SMA_50'] > latest_data['SMA_200'] else "Downtrend"
    short_term_prediction = "N/A"
    price_target = "N/A"
    
    if prediction_model and all(f in latest_data.index for f in features):
        features_for_pred = latest_data[features].to_frame().T
        prediction = prediction_model.predict(features_for_pred)
        
        if prediction[0] == 1:
            short_term_prediction = "Likely Up"
            target = latest_data['BB_UPPER']
            price_target = f"{max(0, target):.2f}"
        else:
            short_term_prediction = "Likely Down"
            target = latest_data['BB_LOWER']
            price_target = f"{max(0, target):.2f}"
    
    # --- Structure Final Output ---
    final_analysis = {
        "ticker": ticker_symbol,
        "last_updated_date": latest_data['Date'].strftime('%Y-%m-%d'),
        "last_close_price": f"{latest_data['Close']:.2f}",
        "long_term_outlook": long_term_outlook,
        "short_term_prediction_5D": short_term_prediction,
        "prediction_price_target": price_target
    }
    return final_analysis

# --- Main execution block ---
if __name__ == "__main__":
    # Corrected the filename as you requested
    file_path = "final_stock_data.csv"
    
    if not os.path.exists(file_path):
        print(f"Error: '{file_path}' not found.")
    else:
        full_df = pd.read_csv(file_path, parse_dates=['Date'])
        
        all_tickers = full_df['Ticker'].unique()
        print(f"Analyzing {len(all_tickers)} stocks from your complete dataset...\n")
        
        for ticker in all_tickers:
            print(f"--- Analysis for: {ticker} ---")
            analysis_result = get_stock_analysis(ticker, full_df)
            
            if "error" not in analysis_result:
                for key, value in analysis_result.items():
                    print(f"  {key.replace('_', ' ').title()}: {value}")
            else:
                print(f"  Could not generate analysis: {analysis_result['error']}")
            
            print("-" * 30 + "\n")