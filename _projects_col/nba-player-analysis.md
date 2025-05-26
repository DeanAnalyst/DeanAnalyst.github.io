---
layout: project
title: "NBA Player Insights: EDA & Performance Prediction"
subtitle: "Uncovering Trends & Predicting Career Success with Python, SQL, and Machine Learning"
date: 2024-05-26 # Or your completion date
featured: true
thumbnail: /assets/images/nba_project/nba_thumbnail.png # Ensure this exists
skills:
  - Python
  - Pandas
  - NumPy
  - Matplotlib
  - Seaborn
  - SQL (pandasql)
  - Scikit-learn
  - Data Cleaning
  - EDA
  - Predictive Modeling
  - Data Visualization
github_repo_url: https://github.com/DeanAnalyst/nba-player-analysis # Your actual repo URL
# live_demo_url: # If applicable
---

<div class="scroll-reveal">
This project explores a rich dataset of NBA player statistics to perform an in-depth Exploratory Data Analysis (EDA), identify key performance drivers, and develop a machine learning model to predict career points per game. The analysis showcases a full data science workflow, from data wrangling and visualization to SQL querying and predictive modeling, using Python and its powerful ecosystem.
</div>

<div class="scroll-reveal">
    <h2>Project Objectives</h2>
    <ul>
        <li>To meticulously clean and preprocess raw NBA player statistics.</li>
        <li>To conduct comprehensive EDA to reveal patterns in player performance, draft outcomes, physical attributes, and origins (college/country).</li>
        <li>To demonstrate SQL proficiency for targeted data analysis within a Python environment using `pandasql`.</li>
        <li>To build and evaluate regression models predicting a player's career points per game (PTS) based on pre-NBA characteristics.</li>
        <li>To interpret model results, highlighting key predictive features and discussing limitations.</li>
    </ul>
</div>

<div class="scroll-reveal">
    <h2>1. Data Wrangling & Preparation</h2>
    <p>The foundation of any robust analysis is clean data. The initial phase involved loading the `PlayerIndex_nba_stats.csv` dataset (sourced from official NBA statistics) and systematically addressing data quality:</p>
    <ul>
        <li><strong>Handling Missing Data:</strong> Imputed missing values appropriately for both categorical (e.g., 'Unknown' for `POSITION`, `COLLEGE`) and numerical attributes (e.g., 0 for `PTS`, `REB`, `AST` for EDA purposes where missing implies no recorded stat).</li>
        <li><strong>Data Type Conversion:</strong> Transformed fields like player `HEIGHT` (e.g., "6-10") into numerical inches and `WEIGHT` into numeric pounds, handling non-standard entries.</li>
        <li><strong>Feature Engineering:</strong> Created composite features like `PLAYER_NAME` and a boolean `IS_UNDRAFTED` flag from draft information.</li>
    </ul>
    <pre><code class="language-python"># Example: Converting height to inches
def height_to_inches(height_str):
    if pd.isna(height_str) or not isinstance(height_str, str) or '-' not in height_str:
        return np.nan
    # ... (rest of function from your notebook) ...
    df['HEIGHT_INCHES'] = df['HEIGHT'].apply(height_to_inches)

# Example: Creating IS_UNDRAFTED flag

df['IS_UNDRAFTED'] = df['DRAFT_NUMBER'].isnull()
</code></pre>

</div>

<div class="scroll-reveal">
    <h2>2. Exploratory Data Analysis (EDA) - Key Insights</h2>
    <p>Visualizations were key to understanding the data's nuances. Some highlight findings include:</p>
    <ul>
        <li>
            <strong>Player Performance Landscape:</strong> Core stats (PTS, REB, AST) showed right-skewed distributions, with elite players significantly outperforming the average.
            <div class="training-plots">
                <div class="plot-container">
                    <img src="{{ '/assets/images/nba_project/career_pts_dist.png' | relative_url }}" alt="Distribution of Career Points">
                    <p><em>Career Points Distribution</em></p>
                </div>
                <div class="plot-container">
                    <img src="{{ '/assets/images/nba_project/career_pairplot_pts_reb_ast.png' | relative_url }}" alt="Pairplot of Career PTS, REB, AST">
                    <p><em>Correlations between PTS, REB, AST</em></p>
                </div>
            </div>
        </li>
        <li>
            <strong>Positional Variances:</strong> Guards excelled in assists, while Centers/Forwards dominated rebounds and height. Forward-Guards in this dataset showed high average points.
            <div class="training-plots">
                 <div class="plot-container">
                    <img src="{{ '/assets/images/nba_project/avg_pts_by_position_boxplot.png' | relative_url }}" alt="Points Distribution by Position">
                    <p><em>Points by Position</em></p>
                </div>
                <div class="plot-container">
                    <img src="{{ '/assets/images/nba_project/height_by_position_violinplot.png' | relative_url }}" alt="Height Distribution by Position">
                    <p><em>Height by Position</em></p>
                </div>
            </div>
        </li>
        <li>
            <strong>Draft Impact:</strong> Earlier draft picks (lower `DRAFT_NUMBER`) strongly correlated with higher career average points. First-round draftees averaged significantly more career PTS than later-round picks.
             <div class="training-plots">
                 <div class="plot-container" style="max-width: 600px;"> <!-- Wider plot for this one -->
                    <img src="{{ '/assets/images/nba_project/draft_vs_pts.png' | relative_url }}" alt="Draft Pick Number vs Career Points">
                    <p><em>Draft Pick vs. Career Points (Lower pick number is better)</em></p>
                </div>
                 <div class="plot-container">
                    <img src="{{ '/assets/images/nba_project/avg_pts_by_draft_round.png' | relative_url }}" alt="Average PTS by Draft Round">
                    <p><em>Average Career PTS by Draft Round</em></p>
                </div>
            </div>
        </li>
        <li>
            <strong>College & International Pipelines:</strong> Powerhouse NCAA programs (Kentucky, UCLA, Duke) are major talent sources. Internationally, Canada, France, and Serbia lead in representation, with players from Spain and Croatia showing strong scoring averages.
            <div class="training-plots">
                 <div class="plot-container">
                    <img src="{{ '/assets/images/nba_project/top_non_usa_countries.png' | relative_url }}" alt="Top 10 Non-USA Countries Producing NBA Players">
                    <p><em>Top Non-USA Countries by Player Count</em></p>
                </div>
                 <div class="plot-container">
                    <img src="{{ '/assets/images/nba_project/avg_pts_top_colleges.png' | relative_url }}" alt="Average Career PTS from Top 15 Colleges">
                    <p><em>Average Career PTS: Top 15 Colleges</em></p>
                </div>
            </div>
        </li>
    </ul>
</div>

<div class="scroll-reveal">
    <h2>3. SQL for Targeted Analysis (via `pandasql`)</h2>
    <p>To demonstrate versatile data retrieval, SQL queries were executed on Pandas DataFrames using `pandasql`. This allowed for analyses such as:</p>
    <ul>
        <li>Identifying Top 10 career scorers.</li>
        <li>Calculating average PTS by player position.</li>
        <li>Filtering for high-performing alumni from specific colleges (e.g., Duke players >15 career PPG).</li>
    </ul>
    <pre><code class="language-sql">-- Example: Duke Players with > 15 Career PPG
SELECT PLAYER_NAME, COLLEGE, PTS
FROM career_df
WHERE COLLEGE = 'Duke' AND PTS > 15
ORDER BY PTS DESC;
</code></pre>
    <p>This approach combines Python's analytical power with SQL's declarative querying strength.</p>
</div>

<div class="scroll-reveal">
    <h2>4. Predictive Modeling: Career Points Per Game (PTS)</h2>
    <p>A machine learning model was developed to predict a player's career average PTS using features like `DRAFT_NUMBER`, `DRAFT_ROUND`, `HEIGHT_INCHES`, `WEIGHT_LBS`, `POSITION`, and `COLLEGE`.</p>
    <ul>
        <li><strong>Preprocessing:</strong> Involved median imputation and StandardScaler for numerical features, and 'Unknown' imputation followed by OneHotEncoding for categorical features.</li>
        <li><strong>Models Evaluated:</strong> Linear Regression, Ridge Regression, Random Forest Regressor, and Gradient Boosting Regressor.</li>
        <li>
            <strong>Best Model Performance:</strong> The **Random Forest Regressor** yielded the most promising results:
            <ul>
                <li><strong>R-squared (R²):</strong> ≈ 0.252 (explaining about 25.2% of the variance in career PTS)</li>
                <li><strong>Root Mean Squared Error (RMSE):</strong> ≈ 3.99 points</li>
            </ul>
        </li>
        <li>
            <strong>Key Feature Importances (from Random Forest):</strong>
            <ol>
                <li>`DRAFT_NUMBER` (overwhelmingly most significant)</li>
                <li>`HEIGHT_INCHES`</li>
                <li>`WEIGHT_LBS`</li>
                <li>`DRAFT_ROUND`</li>
            </ol>
            <p>Specific positions and colleges also appeared, though their individual impact was more diffused.</p>
            <div class="training-plots">
                <div class="plot-container" style="max-width: 700px;">
                    <img src="{{ '/assets/images/nba_project/feature_importance_pts.png' | relative_url }}" alt="Top 20 Feature Importances for Predicting Career PTS">
                    <p><em>Top Feature Importances for Career PTS Prediction.</em></p>
                </div>
            </div>
        </li>
        <li><strong>Model Limitations:</strong> The model serves as an exploratory tool. Its predictive power is constrained by the inherent randomness in player development, uncaptured intangible factors (work ethic, injuries), and the granularity of predicting career averages.</li>
    </ul>
</div>

<div class="scroll-reveal">
    <h2>Dashboarding Potential with Power BI</h2>
    <p>The cleaned and analyzed dataset is ideal for developing interactive Power BI dashboards. Conceptual dashboards could include:</p>
    <ul>
        <li><strong>Player Profile Explorer:</strong> Deep dive into individual player stats and career trajectories.</li>
        <li><strong>Draft Class ROI Analysis:</strong> Evaluate draft success by position and pick number.</li>
        <li><strong>Geospatial Talent Mapping:</strong> Visualize player origins and performance hotspots.</li>
        <li><strong>"What-if" Predictive Scenarios:</strong> (Conceptual) Input player attributes to see model-based PTS predictions.</li>
    </ul>
    <!-- You could add a generic Power BI logo or a very simple mockup if you have one -->
</div>

<div class="scroll-reveal" style="margin-top: 2rem; text-align:center;">
    <a href="{{ page.github_repo_url }}" class="btn-primary" target="_blank" rel="noopener noreferrer" style="background-color:#333;">View Notebook & Code on GitHub »</a>
    <a href="https://deananalyst.github.io/nba-player-analysis/notebooks/nba_analysis.html" class="btn-primary" target="_blank" rel="noopener noreferrer" style="background-color:#555; margin-left:10px;">View HTML Notebook Preview »</a>
</div>
