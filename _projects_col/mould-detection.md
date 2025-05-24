---
layout: project # Uses the project.html layout
title: Automated Mould Detection & Risk Analytics
subtitle: Leveraging Deep Learning, SQL, and BI for Proactive Social Housing Management
date: 2023-06-01 # Date of project completion or dissertation
featured: true # Set to true to show on homepage if using that logic
thumbnail: /assets/images/mould_project/mould_thumbnail.jpg # Create this image!
skills:
  - Python
  - TensorFlow
  - Keras
  - CNNs
  - SQL (Conceptual)
  - Power BI (Conceptual)
  - Data Visualization
  - Machine Learning
  - ETL (Conceptual)
github_repo_url: https://github.com/yourusername/mould-detection-cnn # Replace with your actual repo URL
---

<!-- Optional main image for the project page -->
<!-- <img src="/assets/images/mould_project/mould_hero_image.jpg" alt="Mould Detection Project Overview" class="project-main-image scroll-reveal"> -->

<div class="scroll-reveal">
This project, originating from my MSc dissertation, addresses the critical issue of damp and mould in residential properties by developing an automated detection system. The goal is to enable proactive maintenance in the social housing sector, improving tenant well-being and operational efficiency.
</div>

<div class="scroll-reveal">
    <h2>The Challenge</h2>
    <p>Damp and mould are significant concerns in housing, posing health risks and leading to costly repairs if not addressed promptly. Manual inspection of thousands of property images is inefficient and slow. The challenge was to build a machine learning model capable of accurately identifying mould in images, forming the core of a larger data-driven solution.</p>
    <ul>
        <li><strong>Context:</strong> Impact on tenant health (referencing BBC, 2022), operational burden on housing providers.</li>
        <li><strong>Problem:</strong> Need for faster, scalable, and proactive mould identification.</li>
    </ul>
</div>

<div class="scroll-reveal">
    <h2>My Solution: An End-to-End Framework</h2>
    <p>The solution encompasses image analysis using Deep Learning, data management via SQL, and insightful reporting through Power BI.</p>

    <div class="scroll-reveal"> <!-- Phase 1 Reveal -->
        <h3>Phase 1: Data Acquisition & Preparation (Python)</h3>
        <ul>
            <li><strong>Dataset:</strong> My dissertation utilized a dataset of 7349 publicly sourced images (3681 with mould, 3668 clean). In a real-world application, this would be images from surveyor inspections.</li>
            <li><strong>Augmentation:</strong> To improve model generalization and account for varying image quality, extensive data augmentation was performed using TensorFlow's `ImageDataGenerator`:
                ```python
                # From your provided code
                train_datagen = ImageDataGenerator(
                    preprocessing_function=preprocess_input, # from VGG16
                    rotation_range=90,
                    shear_range=0.2,
                    zoom_range=0.3,
                    horizontal_flip=True,
                    vertical_flip=True
                )
                # ... train_gen setup ...
                ```
            </li>
            <li><strong>Sample Images:</strong>
                <p>Below are a few examples from the dataset, illustrating typical 'clean' and 'mould-affected' scenarios encountered.</p>
                <div class="project-image-gallery"> <!-- Using class from style.scss -->
                    <div class="gallery-row">
                        <div class="gallery-column">
                            <p class="column-title">Clean Examples:</p>
                            <img src="{{ '/assets/images/mould_project/clean_bathroom_ex.jpeg' | relative_url }}" alt="Clean Bathroom Example">
                            <img src="{{ '/assets/images/mould_project/clean_bedroom_ex.jpeg' | relative_url }}" alt="Clean Bedroom Example">
                        </div>
                        <div class="gallery-column">
                            <p class="column-title">Mould-Affected Examples:</p>
                            <img src="{{ '/assets/images/mould_project/mould_room_ex.jpeg' | relative_url }}" alt="Mouldy Room Example">
                            <img src="{{ '/assets/images/mould_project/mould_wall_ex.jpeg' | relative_url }}" alt="Mouldy Wall Example">
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div> <!-- End Phase 1 Reveal -->

    <div class="scroll-reveal"> <!-- Phase 2 Reveal -->
        <h3>Phase 2: Model Development & Training (Python, TensorFlow/Keras)</h3>
        <ul>
            <li><strong>Core Model:</strong> A Convolutional Neural Network (CNN) based on the VGG-16 architecture, utilizing transfer learning with ImageNet weights. The top classification layers were replaced and fine-tuned for the mould detection task.
                ```python
                # From your provided code
                from keras.applications.vgg16 import VGG16
                from keras.models import Model
                from keras.layers import Flatten, Dense, Dropout

                base_model = VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
                for layer in base_model.layers: # Freeze base layers
                    layer.trainable = False

                x = base_model.output
                x = Flatten()(x)
                x = Dense(256, activation='relu')(x)
                x = Dropout(0.5)(x)
                predictions = Dense(2, activation='softmax')(x) # For categorical_crossentropy

                model = Model(inputs=base_model.input, outputs=predictions)
                model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
                ```
            </li>
            <li><strong>Training & Evaluation:</strong> The model was trained for 100 epochs using the Adam optimizer and categorical crossentropy loss. Callbacks were used to save the best performing model based on validation accuracy.
                <div class="training-plots"> <!-- Using class from style.scss -->
                    <div class="plot-container">
                        <h4 style="margin-bottom: 0.5rem;">Model Accuracy & Loss Curves</h4>
                        <img src="{{ '/assets/images/mould_project/accuracy_plot.png' | relative_url }}" alt="Model Training Accuracy and Loss Curves">
                        <p style="font-size:0.9em; color: #555; margin-top:5px;"><em>Accuracy and loss trends over training epochs for training and validation sets.</em></p>
                    </div>
                    <div class="plot-container">
                        <h4 style="margin-bottom: 0.5rem;">Normalized Confusion Matrix</h4>
                        <img src="{{ '/assets/images/mould_project/confusion_matrix.png' | relative_url }}" alt="Normalized Confusion Matrix for Mould Detection">
                        <p style="font-size:0.9em; color: #555; margin-top:5px;"><em>Performance on the test set, showing true vs. predicted labels.</em></p>
                    </div>
                </div>
            </li>
            <li><strong>Key Result:</strong> Achieved approximately **96-98% validation accuracy** (confirm from your plots and saved model performance), demonstrating strong predictive capability for distinguishing mould-affected areas from clean ones.</li>
            <li><strong>Interpretability (Class Activation Maps - CAMs):</strong> To understand what the model learned and to ensure it was focusing on relevant image features, Class Activation Maps were generated. These maps highlight the regions in an image that were most influential for the model's prediction.
                ```python
                # Conceptual CAM generation (key part from your code)
                # last_conv_layer = model.get_layer('block5_conv3') # For VGG16
                # new_model = Model(model.input, last_conv_layer.output)
                # # ... logic to calculate weighted sum of feature maps ...
                # cam = cv2.resize(cam, (224, 224))
                # cam = np.maximum(cam, 0)
                # cam /= cam.max()
                ```
                <p>Below are examples showing the CAM overlay on both a 'clean' image and a 'mould-affected' image. The warmer colors (red/yellow) indicate areas of higher importance for the model's decision.</p>
                <div class="cam-examples"> <!-- Using class from style.scss -->
                    <div class="cam-container">
                        <h4 style="margin-bottom: 0.5rem;">CAM on a Mould-Affected Image</h4>
                        <img src="{{ '/assets/images/mould_project/CAM_mould1.png' | relative_url }}" alt="Class Activation Map for Mouldy Image">
                        <p style="font-size:0.9em; color: #555; margin-top:5px;"><em>Model correctly focuses on the mouldy patches.</em></p>
                    </div>
                    <div class="cam-container">
                        <h4 style="margin-bottom: 0.5rem;">CAM on a Clean Image</h4>
                        <img src="{{ '/assets/images/mould_project/CAM_clean1.png' | relative_url }}" alt="Class Activation Map for Clean Image">
                        <p style="font-size:0.9em; color: #555; margin-top:5px;"><em>For a clean image, the activation is typically more diffuse or focuses on textures that are not mould.</em></p>
                    </div>
                </div>
            </li>
        </ul>
    </div> <!-- End Phase 2 Reveal -->

    <div class="scroll-reveal"> <!-- Phase 3 Reveal -->
        <h3>Phase 3: Data Storage & Management (SQL - Conceptual Design)</h3>
        <p>To operationalize this, model predictions and associated metadata would be stored in a relational database (e.g., Oracle, PostgreSQL). This allows for querying, trend analysis, and integration with other business systems.</p>
        <ul>
            <li><strong>Conceptual Schema Highlights:</strong>
                <ul>
                    <li>`Fact_Properties` (PropertyID PK, Address, etc.)</li>
                    <li>`Fact_Inspections` (InspectionID PK, PropertyID FK, Date)</li>
                    <li>`Fact_Images` (ImageID PK, InspectionID FK, FilePath)
                    <li>`Dim_ML_Models` (ModelID PK, ModelVersion, Accuracy)</li>
                    <li>`Fact_Mould_Predictions` (PredictionID PK, ImageID FK, ModelID FK, Class, Confidence, Timestamp)</li>
                </ul>
                 (Full schema available in the project's GitHub repository).
            </li>
            <li><strong>Example SQL Query:</strong>
                ```sql
                -- Find properties with recent high-confidence mould detection
                SELECT p.Address, i.InspectionDate, mp.ConfidenceScore
                FROM Fact_Properties p
                JOIN Fact_Inspections i ON p.PropertyID = i.PropertyID
                JOIN Fact_Images img ON i.InspectionID = img.InspectionID
                JOIN Fact_Mould_Predictions mp ON img.ImageID = mp.ImageID
                WHERE mp.PredictedClass = 'Mould' AND mp.ConfidenceScore > 0.90
                  AND i.InspectionDate > DATE('now', '-30 days') -- Example for SQLite
                ORDER BY mp.ConfidenceScore DESC;
                ```
            </li>
        </ul>
    </div> <!-- End Phase 3 Reveal -->

    <div class="scroll-reveal"> <!-- Phase 4 Reveal -->
        <h3>Phase 4: Visualization & Reporting (Power BI - Conceptual Design)</h3>
        <p>Data from the SQL database would feed interactive Power BI dashboards for housing managers, enabling:</p>
        <ul>
            <li><strong>Risk Monitoring:</strong> KPIs on mould prevalence, high-risk properties, geographical hotspots (map visualization).</li>
            <li><strong>Operational Insights:</strong> Tracking time from detection to remediation, effectiveness of interventions.</li>
            <li><strong>Strategic Planning:</strong> Identifying trends, informing preventative maintenance strategies.</li>
            <li><strong>Example DAX (Conceptual):</strong>
                <pre><code>TotalHighRiskMouldProperties =

CALCULATE(
DISTINCTCOUNT(Fact_Properties[PropertyID]),
Fact_Mould_Predictions[PredictedClass] = "Mould",
Fact_Mould_Predictions[ConfidenceScore] > 0.90
)</code></pre>
</li>
<li><strong>Visual Concept:</strong>
<!-- Embed a mockup image of the Power BI dashboard -->
<img src="{{ '/assets/images/mould_project/powerbi_mockup.png' | relative_url }}" alt="Power BI Dashboard Mockup for Mould Analytics" style="width:100%; max-width:700px; margin:1rem auto; display:block; border:1px solid #ddd; border-radius:5px;">
<p style="text-align:center; font-size:0.9em; color: #555;"><em>Conceptual Power BI dashboard showing key metrics and visualizations.</em></p>
</li>
</ul>
</div> <!-- End Phase 4 Reveal -->

</div> <!-- End of My Solution Framework scroll-reveal -->

<div class="scroll-reveal">
    <h2>Outcomes & Impact</h2>
    <ul>
        <li><strong>Proactive Maintenance:</strong> Enables early identification and intervention, shifting from reactive to proactive.</li>
        <li><strong>Improved Tenant Well-being:</strong> Reduces health risks associated with mould exposure.</li>
        <li><strong>Cost Savings:</strong> Minimizes costs associated with extensive mould damage and lengthy repairs.</li>
        <li><strong>Efficient Resource Allocation:</strong> Directs surveyors and maintenance teams to highest-priority areas.</li>
        <li><strong>Data-Driven Strategy:</strong> Provides housing organizations with robust data for strategic planning and compliance reporting.</li>
    </ul>
</div>

<div class="scroll-reveal" style="margin-top: 2rem; text-align:center;">
    {% if page.github_repo_url %}
        <a href="{{ page.github_repo_url }}" class="btn-primary" target="_blank" rel="noopener noreferrer" style="margin-right:10px; background-color:#333;">View Code on GitHub »</a>
    {% endif %}
    <a href="{{ '/assets/docs/UP2091348_Dissertation.pdf' | relative_url }}" class="btn-primary" target="_blank" rel="noopener noreferrer" style="background-color:#555;">Read Full Dissertation (PDF) »</a>
</div>
