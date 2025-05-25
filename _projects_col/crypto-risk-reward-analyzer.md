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
github_repo_url: https://github.com/DeanAnalyst/crypto_risk_reward_analyzer # Your actual repo URL
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
</div>
<div class="scroll-reveal">
    <h2>Key Insights & Recommendations</h2>
    <p>This analysis of cryptocurrency market data yielded several notable findings and potential areas for further consideration for investors or analysts in this space:</p>

    <ul>
        <li>
            <strong>Dominance of Fundamentals in Risk Profiling:</strong>
            The engineered risk score, heavily influenced by inverse market capitalization and volatility (Absolute 24h Change), effectively highlights that smaller, more volatile assets are inherently perceived as riskier. This aligns with traditional financial intuition. The interactive scatter plot visually confirms this, with many smaller-cap coins clustering towards higher risk scores.
        </li>
        <li>
            <strong>Activity Metrics as Reward Proxies:</strong>
            Metrics like Log Total Volume and recent positive 24h Change served as useful (though simplified) proxies for reward or positive market activity. Assets in the "High Reward" quadrants often exhibited significant recent trading volume or price appreciation.
            <em>Recommendation: For a more robust reward metric, incorporating longer-term price performance (e.g., 30-day, 90-day returns) or momentum indicators could be beneficial.</em>
        </li>
        <li>
            <strong>The "Low Risk, High Reward" Quadrant - A Target for Due Diligence:</strong>
            Cryptocurrencies appearing in this quadrant (e.g., names like Alpaca Finance, Sign from the notebook's sample output) warrant deeper investigation. While the model flags them based on current data, further due diligence into their project fundamentals, team, tokenomics, and roadmap is crucial before considering any investment.
            <em>Opinion: This quadrant often contains established projects experiencing positive momentum or undervalued newer projects beginning to gain traction.</em>
        </li>
        <li>
            <strong>Anomaly Detection as a Flag for Scrutiny:</strong>
            The Isolation Forest identified several anomalies.
            <ul>
                <li><strong>Major Caps as "Anomalies":</strong> Coins like Bitcoin and Ethereum were flagged, primarily due to their extremely high market capitalizations, which are outliers compared to the vast majority of the dataset. This is an expected outcome and validates that the model picks up on extreme values.</li>
                <li><strong>High Volatility/Liquidity Outliers:</strong> Other anomalies (e.g., Virtuals Protocol, Pudgy Penguins from the notebook's sample output) often exhibited extreme recent price changes or unusual liquidity ratios compared to their market cap.
                <em>Recommendation: Anomalies are not inherently "bad" or "good" but serve as flags for further investigation. An unusually high liquidity ratio for a small-cap coin, for instance, might indicate wash trading or a very recent surge in interest that needs to be understood.</em></li>
            </ul>
        </li>
        <li>
            <strong>Limitations of Heuristic Scoring:</strong>
            The risk-reward scores are based on a defined set of heuristics and subjective weights.
            <em>Opinion: While useful for a comparative overview, these scores should not be the sole basis for investment decisions. The crypto market is influenced by many qualitative factors (community sentiment, regulatory news, technological breakthroughs) not captured in this quantitative model.</em>
        </li>
        <li>
            <strong>Stablecoins - A Different Breed:</strong>
            The decision to exclude stablecoins from the primary risk-reward analysis was important, as their price stability and different utility function would skew the scoring intended for speculative assets. Their separate identification is key.
        </li>
        <li>
            <strong>Market Cap Tiers for Context:</strong>
            Categorizing coins by market cap tiers (Micro, Small, Mid, Large, Mega) provides essential context when interpreting risk and reward. A "high risk" score for a micro-cap coin might be expected, whereas the same score for a large-cap coin would be more concerning.
            <em>Recommendation: When using the interactive plot, filtering by Market Cap Tier can help compare similar-sized projects more effectively.</em>
        </li>
        <li>
            <strong>Potential for Portfolio Construction:</strong>
            (Conceptual) This type of risk-reward framework, if further refined, could serve as an initial screening tool for constructing a diversified crypto portfolio, balancing exposure across different risk profiles.
        </li>
    </ul>
    <p><strong>Overall Recommendation:</strong> This analytical approach provides a structured way to sift through a large number of crypto assets. However, any insights or scores generated should be used as a starting point for deeper, qualitative research rather than definitive investment advice. The dynamic nature of the crypto market necessitates continuous monitoring and model adaptation.</p>

</div>

<div class="scroll-reveal" style="margin-top: 2rem; text-align:center;">
    <a href="{{ page.github_repo_url }}" class="btn-primary" target="_blank" rel="noopener noreferrer" style="background-color:#333;">View Notebook & Code on GitHub »</a>
</div>
