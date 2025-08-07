import pandas as pd
import numpy as np
import os

def analyze_stock_trends(ticker_symbol, df):
    """
    Analyzes a specific stock for market trends using technical indicators.
    """
    # --- Data Preparation ---
    df = df.copy()
    df['Date'] = pd.to_datetime(df['Date'], dayfirst=True, errors='coerce')
    stock_df = df[df['Ticker'] == ticker_symbol].copy()

    if stock_df.empty:
        print(f"No data found for ticker: {ticker_symbol}")
        return "[]"

    stock_df.sort_values('Date', inplace=True)


# This block prepares the raw data for analysis. It first creates a copy of the original 
# DataFrame to avoid modifying it. It then converts the 'Date' column into a proper 
# datetime format, which is crucial for time-series analysis. Finally, it filters the data 
# to only include the specific stock (ticker_symbol) you want to analyze and sorts the data by date.



# ----------------------
    # --- Technical Indicators ---
    stock_df['SMA_50'] = stock_df['Close'].rolling(window=50).mean()
    stock_df['SMA_200'] = stock_df['Close'].rolling(window=200).mean()

    # ** CORRECTED RSI CALCULATION **
    delta = stock_df['Close'].diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    
    avg_gain = gain.rolling(window=14).mean()
    avg_loss = loss.rolling(window=14).mean()

    rs = avg_gain / avg_loss
    stock_df['RSI_14'] = 100 - (100 / (1 + rs))
    # ** END OF CORRECTION **

    # Bollinger Bands 20
    stock_df['BB_MID'] = stock_df['Close'].rolling(window=20).mean()
    stock_df['BB_STD'] = stock_df['Close'].rolling(window=20).std()
    stock_df['BB_UPPER'] = stock_df['BB_MID'] + 2 * stock_df['BB_STD']
    stock_df['BB_LOWER'] = stock_df['BB_MID'] - 2 * stock_df['BB_STD']

# This is the core analysis part of your code. You're calculating four popular '
# 'technical indicators using pandas' powerful .rolling() function:

# SMA_50 & SMA_200 (Simple Moving Averages): These track the average closing price 
# over 50 and 200 days, respectively, to identify long-term trends.

# RSI (Relative Strength Index): This is a momentum indicator that measures the speed 
# and change of price movements over a 14-day window.

# Bollinger Bands: These measure a stock's volatility. The bands expand and contract 
# as volatility increases and decreases


#-------------------------

    # Drop rows missing any indicator
    stock_df.dropna(inplace=True)

    if stock_df.empty:
        print("Warning: DataFrame became empty after dropping NaN values. Check data length.")
        return "[]"

    # --- Apply rule-based trend and momentum logic ---
    def label_trend(row):
        return "Uptrend" if row['SMA_50'] > row['SMA_200'] else "Downtrend"

    def label_momentum(row):
        if row['RSI_14'] > 70:
            return "Overbought"
        elif row['RSI_14'] < 30:
            return "Oversold"
        else:
            return "Neutral"

    stock_df['Trend'] = stock_df.apply(label_trend, axis=1)
    stock_df['Momentum'] = stock_df.apply(label_momentum, axis=1)

    # --- Prepare final output ---
    out_cols = [
        "Date", "Ticker", "Open", "High", "Low", "Close", "Volume",
        "SMA_50", "SMA_200", "RSI_14", "BB_UPPER", "BB_MID", "BB_LOWER",
        "Trend", "Momentum"
    ]
    output = stock_df.tail(252)[out_cols]

    return output.to_json(orient='records', date_format='iso')

# --- Main execution block ---
if __name__ == "__main__":
    file_path = "final_stock_data.csv"
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
    else:
        full_df = pd.read_csv(file_path, parse_dates=['Date'])

        # Get all unique ticker symbols from the dataset
        unique_tickers = full_df['Ticker'].unique()

        # Analyze and print data for each ticker symbol
        for ticker_to_analyze in unique_tickers:
            print(f"--- Processed Data for {ticker_to_analyze} ---")
            processed_data_json = analyze_stock_trends(ticker_to_analyze, full_df)
            print(processed_data_json)
            print()  # Blank line for better separation
