---
layout: project
title: "Cryptocurrency Risk-Reward & Anomaly Analyzer"
subtitle: "Developing a Scoring System and Detecting Outliers in the Crypto Market using Python"
date: 2024-05-27 # Or your completion date
featured: true # Or false
thumbnail: /assets/images/crypto_project/crypto_thumbnail.jpg # IMPORTANT: Create this!
skills:
  - Python
  - Pandas
  - NumPy
  - Matplotlib
  - Seaborn
  - Scikit-learn
  - Plotly
  - Data Cleaning
  - Feature Engineering
  - Anomaly Detection
  - Data Visualization
  - Financial Data Analysis
github_repo_url: https://github.com/yourusDeanAnalystername/crypto_risk_reward_analyzer # Your actual repo URL
# Optional: Link to the interactive HTML plot if hosted (e.g., on GitHub Pages within the project repo)
interactive_plot_url: https://deananalyst.github.io/crypto_risk_reward_analyzer/notebooks/output/interactive_plots/risk_reward_profile.html # Example, if you enable Pages on the project repo
---

<div class="scroll-reveal">
This project dives into the volatile world of cryptocurrencies, aiming to develop a quantitative framework for assessing risk versus reward. Using Python and a suite of data science libraries, it involves data cleaning, feature engineering, the creation of a composite risk-reward scoring system, and the application of an Isolation Forest algorithm to detect anomalous crypto assets based on their fundamental characteristics.
</div>

<div class="scroll-reveal">
    <h2>Project Goals</h2>
    <ul>
        <li>To process and clean a raw cryptocurrency market dataset (`crypto_market_dataset.csv`).</li>
        <li>To engineer relevant features indicative of risk (e.g., market cap inverse, volatility, liquidity inverse) and reward/activity (e.g., 24h price change, volume, liquidity).</li>
        <li>To develop a weighted scoring system to quantify the risk and reward profiles of non-stablecoin cryptocurrencies.</li>
        <li>To perform Exploratory Data Analysis (EDA) on key features and the calculated scores.</li>
        <li>To implement an anomaly detection model (Isolation Forest) to identify cryptocurrencies with unusual fundamental profiles.</li>
        <li>To visualize the risk-reward landscape interactively using Plotly.</li>
    </ul>
</div>

<div class="scroll-reveal">
    <h2>1. Data Ingestion & Cleaning</h2>
    <p>The analysis began with loading the dataset. Key cleaning steps included:</p>
    <ul>
        <li>Converting 'Last Updated' to datetime objects.</li>
        <li>Handling missing '24h Change (%)' by imputation (e.g., with 0 after inspection).</li>
        <li>Ensuring critical numerical columns ('Current Price (USD)', 'Market Cap', 'Total Volume') were of the correct data type, coercing errors.</li>
        <li>Filtering out inactive or irrelevant entities (e.g., coins with zero market cap AND zero volume, specific non-traded tokenized funds).</li>
        <li>Filtering out assets with extremely low trading volume (e.g., < $100) to focus on actively traded cryptocurrencies.</li>
    </ul>
</div>

<div class="scroll-reveal">
    <h2>2. Feature Engineering</h2>
    <p>Several features were engineered to better capture risk and reward dynamics:</p>
    <ul>
        <li><strong>Log Transformations:</strong> Applied `np.log1p` to 'Market Cap', 'Total Volume', and 'Current Price (USD)' to handle skewed distributions and normalize scales.</li>
        <li><strong>Liquidity Ratio:</strong> Calculated as `Total Volume / Market Cap`.</li>
        <li><strong>Absolute 24h Change:</strong> Used as a proxy for recent volatility.</li>
        <li><strong>Stablecoin Identification:</strong> A heuristic approach was used to identify and exclude stablecoins (price near $1, low volatility) from the main risk-reward analysis.</li>
    </ul>
    <pre><code class="language-python"># Example: Liquidity Ratio
df['Liquidity Ratio'] = df['Total Volume'] / df['Market Cap']
df['Liquidity Ratio'].replace([np.inf, -np.inf], np.nan, inplace=True)
df['Liquidity Ratio'].fillna(0, inplace=True)

# Example: Stablecoin Heuristic

df['Is Stablecoin'] = (
(df['Current Price (USD)'] >= 0.97) &
(df['Current Price (USD)'] <= 1.03) &
(df['Absolute 24h Change'] < 0.5)
)
df_analysis = df[~df['Is Stablecoin']].copy() # Analyze non-stablecoins
</code></pre>

</div>

<div class="scroll-reveal">
    <h2>3. Risk-Reward Scoring Methodology</h2>
    <p>A composite Risk Score and Reward Score were calculated for each non-stablecoin crypto. Features were scaled using MinMaxScaler.</p>
    <ul>
        <li><strong>Risk Components (Higher score = Higher Risk):</strong>
            <ul>
                <li>Inverse Log Market Cap (scaled: smaller cap -> higher risk score)</li>
                <li>Absolute 24h Change (scaled: higher volatility -> higher risk score)</li>
                <li>Inverse Liquidity Ratio (scaled: lower liquidity -> higher risk score)</li>
            </ul>
        </li>
        <li><strong>Reward/Activity Components (Higher score = Higher Reward/Activity):</strong>
            <ul>
                <li>Positive 24h Change (scaled, negatives clipped to 0)</li>
                <li>Log Total Volume (scaled)</li>
                <li>Liquidity Ratio (scaled)</li>
            </ul>
        </li>
        <li><strong>Weighted Aggregation:</strong> Subjective weights were applied to these components to derive final Risk and Reward scores (e.g., `weights_risk = {'MarketCap': 0.4, 'Volatility': 0.4, 'Liquidity': 0.2}`).</li>
    </ul>
    <div class="training-plots">
        <div class="plot-container" style="max-width:600px;">
            <img src="{{ '/assets/images/crypto_project/risk_reward_score_distributions.png' | relative_url }}" alt="Distribution of Calculated Risk and Reward Scores">
            <p><em>Distributions of the calculated Risk and Reward Scores.</em></p>
        </div>
    </div>
</div>

<div class="scroll-reveal">
    <h2>4. Exploratory Data Analysis (EDA) & Visualization</h2>
    <p>EDA focused on understanding the distributions of engineered features and the relationships between them for non-stablecoins.</p>
    <div class="training-plots">
        <div class="plot-container">
            <img src="{{ '/assets/images/crypto_project/eda_feature_distributions.png' | relative_url }}" alt="Distributions of Key Features for Non-Stablecoins">
            <p><em>Distributions of features like Log Market Cap, Log Volume, etc.</em></p>
        </div>
        <div class="plot-container">
            <img src="{{ '/assets/images/crypto_project/eda_correlation_heatmap.png' | relative_url }}" alt="Correlation Matrix of Key Features">
            <p><em>Correlation Matrix for features used in scoring.</em></p>
        </div>
    </div>
</div>

<div class="scroll-reveal">
    <h2>5. Anomaly Detection with Isolation Forest</h2>
    <p>An Isolation Forest model was trained on fundamental characteristics (`Absolute 24h Change`, `Liquidity Ratio`, `Market Cap Log`) to identify outliers or anomalies in the dataset.</p>
    <ul>
        <li>Features were scaled using MinMaxScaler before fitting the model.</li>
        <li>A contamination factor (e.g., 0.03 or 3%) was set to define the expected proportion of outliers.</li>
        <li>Detected anomalies were then examined, with examples including major cryptocurrencies (due to extreme market caps) or assets with unusual recent volatility or liquidity profiles.</li>
    </ul>
    <pre><code class="language-python"># Example: Isolation Forest Setup
from sklearn.ensemble import IsolationForest
features_for_anomaly = ['Absolute 24h Change', 'Liquidity Ratio', 'Market Cap Log']
X_anomaly = df_analysis[features_for_anomaly].copy()
X_anomaly.fillna(X_anomaly.median(), inplace=True) # Impute NaNs
scaler_anomaly = MinMaxScaler()
X_anomaly_scaled = scaler_anomaly.fit_transform(X_anomaly)

iso_forest = IsolationForest(n_estimators=100, contamination=0.03, random_state=42)
df_analysis['Anomaly_Pred_IF'] = iso_forest.fit_predict(X_anomaly_scaled)
df_analysis['Is_Anomaly_IF'] = (df_analysis['Anomaly_Pred_IF'] == -1)
</code></pre>

<p>The notebook details the top anomalous coins identified by the model, sorted by market cap.</p>

</div>

<div class="scroll-reveal">
    <h2>6. Interactive Risk-Reward Visualization (Plotly)</h2>
    <p>A key output is an interactive scatter plot created with Plotly, visualizing each cryptocurrency based on its calculated Risk and Reward Scores. This allows for dynamic exploration:</p>
    <ul>
        <li>Markers are sized by Log Market Cap.</li>
        <li>Colors indicate whether an asset was flagged as an anomaly by the Isolation Forest.</li>
        <li>Hovering over a point reveals detailed information (Name, Symbol, Price, Market Cap, Scores, etc.).</li>
        <li>Quadrant lines based on mean risk and reward scores help categorize assets (e.g., Low Risk/High Reward).</li>
    </ul>
    <p style="text-align:center; margin-top:1rem;">
        <!-- Option 1: Embed the HTML directly if your CSP allows and it's not too complex -->
        <iframe src="{{ page.interactive_plot_url }}" width="100%" height="750px" style="border:1px solid #ddd;"></iframe>
        <!-- Option 2: Screenshot and link to the HTML file -->
        <a href="{{ page.interactive_plot_url | default: '#' }}" target="_blank" rel="noopener noreferrer">
            <img src="{{ '/assets/images/crypto_project/risk_reward_profile_static.png' | relative_url }}" alt="Crypto Risk vs Reward Profile Scatter Plot" style="max-width:700px; border:1px solid #ddd; border-radius:5px;">
        </a><br>
        <a href="{{ page.interactive_plot_url | default: '#' }}" class="btn-primary" target="_blank" rel="noopener noreferrer" style="margin-top:0.5rem;">View Interactive Risk-Reward Plot »</a>
    </p>
    <p style="text-align:center; font-size:0.9em; color: #555;"><em>Click image or button to view the interactive Plotly chart (opens HTML file).</em></p>
</div>

<div class="scroll-reveal" style="margin-top: 2rem; text-align:center;">
    <a href="{{ page.github_repo_url }}" class="btn-primary" target="_blank" rel="noopener noreferrer" style="background-color:#333;">View Notebook & Code on GitHub »</a>
</div>
