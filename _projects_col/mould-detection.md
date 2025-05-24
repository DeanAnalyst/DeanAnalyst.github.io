---
layout: project # Uses the project.html layout
title: Automated Mould Detection & Risk Analytics
subtitle: Leveraging Deep Learning, SQL, and BI for Proactive Social Housing Management
date: 2023-06-01 # Date of project completion or dissertation
featured: true # Set to true to show on homepage if using that logic
thumbnail: /assets/images/mould_project/mould_thumbnail.png # Create this image!
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
# Add an excerpt for the project card if you want to override the auto-generated one
# excerpt: A deep learning solution for identifying mould in property images, with SQL & Power BI integration.
github_repo_url: https://github.com/DeanAnalyst/mould-detection-cnn # Replace with your actual repo URL
---

<!-- Main image for the project page (optional) -->
<img src="/assets/images/mould_project/mould_hero_image.png" alt="Mould Detection Project Overview" class="project-main-image">

This project, originating from my MSc dissertation, addresses the critical issue of damp and mould in residential properties by developing an automated detection system. The goal is to enable proactive maintenance in the social housing sector, improving tenant well-being and operational efficiency.

## The Challenge

Damp and mould are significant concerns in housing, posing health risks and leading to costly repairs if not addressed promptly. Manual inspection of thousands of property images is inefficient and slow. The challenge was to build a machine learning model capable of accurately identifying mould in images, forming the core of a larger data-driven solution.

- **Context:** Impact on tenant health (referencing BBC, 2022), operational burden on housing providers.
- **Problem:** Need for faster, scalable, and proactive mould identification.

## My Solution: An End-to-End Framework

The solution encompasses image analysis using Deep Learning, data management via SQL, and insightful reporting through Power BI.

### Phase 1: Data Acquisition & Preparation (Python)

- **Dataset:** My dissertation utilized a dataset of 7349 publicly sourced images (3681 with mould, 3668 clean). In a real-world scenario, this would be images from surveyor inspections.
- **Augmentation:** To improve model generalization and account for varying image quality, extensive data augmentation was performed using TensorFlow's `ImageDataGenerator`:
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

* **Sample Images:**
  <p>Below are a few examples from the dataset, illustrating typical 'clean' and 'mould-affected' scenarios encountered.</p>
  <div class="project-image-gallery">
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

### Phase 2: Model Development & Training (Python, TensorFlow/Keras)

- **Core Model:** A Convolutional Neural Network (CNN) based on the VGG-16 architecture, utilizing transfer learning with ImageNet weights. The top classification layers were replaced and fine-tuned for the mould detection task.

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

* **Training & Evaluation:** The model was trained for 100 epochs using the Adam optimizer and categorical crossentropy loss. Callbacks were used to save the best performing model based on validation accuracy.
  <div class="training-plots" style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 1rem; margin-bottom: 1.5rem; justify-content: space-around;">
      <div class="plot-container" style="flex: 1; min-width: 300px; max-width: 450px; text-align: center;">
          <h4 style="margin-bottom: 0.5rem;">Model Accuracy & Loss Curves</h4>
          <img src="{{ '/assets/images/mould_project/accuracy_plot.png' | relative_url }}" alt="Model Training Accuracy and Loss Curves" style="width:100%; border:1px solid #ddd; border-radius: 5px;">
          <p style="font-size:0.9em; color: #555; margin-top:5px;"><em>Accuracy and loss trends over training epochs for training and validation sets.</em></p>
      </div>
      <div class="plot-container" style="flex: 1; min-width: 300px; max-width: 400px; text-align: center;">
          <h4 style="margin-bottom: 0.5rem;">Normalized Confusion Matrix</h4>
          <img src="{{ '/assets/images/mould_project/confusion_matrix.png' | relative_url }}" alt="Normalized Confusion Matrix for Mould Detection" style="width:100%; border:1px solid #ddd; border-radius: 5px;">
          <p style="font-size:0.9em; color: #555; margin-top:5px;"><em>Performance on the test set, showing true vs. predicted labels.</em></p>
      </div>
  </div>
* **Key Result:** Achieved approximately **96-98% validation accuracy** , demonstrating strong predictive capability for distinguishing mould-affected areas from clean ones.
* **Interpretability (Class Activation Maps - CAMs):** To understand what the model learned and to ensure it was focusing on relevant image features, Class Activation Maps were generated. These maps highlight the regions in an image that were most influential for the model's prediction.
  ```python
  # Conceptual CAM generation (key part from your code)
   last_conv_layer = model.get_layer('block5_conv3') # For VGG16
   new_model = Model(model.input, last_conv_layer.output)
  # ... logic to calculate weighted sum of feature maps ...
   cam = cv2.resize(cam, (224, 224))
   cam = np.maximum(cam, 0)
   cam /= cam.max()
  ```
  <p>Below are examples showing the CAM overlay on both a 'clean' image and a 'mould-affected' image. The warmer colors (red/yellow) indicate areas of higher importance for the model's decision.</p>
  <div class="cam-examples" style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 1rem; margin-bottom: 1.5rem; justify-content: space-around;">
      <div class="cam-container" style="flex: 1; min-width: 250px; max-width: 350px; text-align: center;">
          <h4 style="margin-bottom: 0.5rem;">CAM on a Mould-Affected Image</h4>
          <img src="{{ '/assets/images/mould_project/CAM_mould1.png' | relative_url }}" alt="Class Activation Map for Mouldy Image" style="width:100%; border:1px solid #ddd; border-radius: 5px;">
          <p style="font-size:0.9em; color: #555; margin-top:5px;"><em>Model correctly focuses on the mouldy patches.</em></p>
      </div>
      <div class="cam-container" style="flex: 1; min-width: 250px; max-width: 350px; text-align: center;">
          <h4 style="margin-bottom: 0.5rem;">CAM on a Clean Image</h4>
          <img src="{{ '/assets/images/mould_project/CAM_clean1.png' | relative_url }}" alt="Class Activation Map for Clean Image" style="width:100%; border:1px solid #ddd; border-radius: 5px;">
          <p style="font-size:0.9em; color: #555; margin-top:5px;"><em>For a clean image, the activation is typically more diffuse or focuses on textures that are not mould.</em></p>
      </div>
  </div>

### Phase 3: Data Storage & Management (SQL - Conceptual Design)

To operationalize this, model predictions and associated metadata would be stored in a relational database (e.g., Oracle, PostgreSQL). This allows for querying, trend analysis, and integration with other business systems.

- **Conceptual Schema:**
  - `Properties` (PropertyID PK, Address, etc.)
  - `Inspections` (InspectionID PK, PropertyID FK, Date)
  - `Images` (ImageID PK, InspectionID FK, FilePath)
  - `Mould_Predictions` (PredictionID PK, ImageID FK, Class, Confidence, Timestamp)
- **Example SQL Query:**
  ```sql
  -- Find properties with recent high-confidence mould detection
  SELECT p.Address, i.InspectionDate, mp.ConfidenceScore
  FROM Properties p
  JOIN Inspections i ON p.PropertyID = i.PropertyID
  JOIN Images img ON i.InspectionID = img.InspectionID
  JOIN Mould_Predictions mp ON img.ImageID = mp.ImageID
  WHERE mp.PredictionClass = 'Mould' AND mp.ConfidenceScore > 0.90
    AND i.InspectionDate > DATE('now', '-30 days')
  ORDER BY mp.ConfidenceScore DESC;
  ```

### Phase 4: Visualization & Reporting (Power BI - Conceptual Design)

Data from the SQL database would feed interactive Power BI dashboards for housing managers, enabling:

- **Risk Monitoring:** KPIs on mould prevalence, high-risk properties, geographical hotspots (map visualization).
- **Operational Insights:** Tracking time from detection to remediation, effectiveness of interventions.
- **Strategic Planning:** Identifying trends, informing preventative maintenance strategies.
- **Example DAX (Conceptual):**
  - `TotalHighRiskMouldProperties = CALCULATE(DISTINCTCOUNT(Properties[PropertyID]), Mould_Predictions[PredictionClass] = "Mould", Mould_Predictions[ConfidenceScore] > 0.90)`
- **Visual Concept:**
  - (Embed a mockup image of the Power BI dashboard: `![Power BI Mockup](/assets/images/mould_project/powerbi_mockup.png)`). If no mockup, describe key visuals.

## Outcomes & Impact

- **Proactive Maintenance:** Shifts from reactive repairs to early, preventative interventions.
- **Improved Tenant Well-being:** Reduces health risks associated with mould.
- **Cost Savings:** Minimizes costs of extensive damage and long-term repairs.
- **Efficient Resource Allocation:** Directs survey and maintenance teams effectively.
- **Data-Driven Decisions:** Empowers housing providers with comprehensive insights for strategy and compliance.

---

<p style="margin-top: 2rem;">
    {% if page.github_repo_url %}
        <a href="{{ page.github_repo_url }}" class="btn-primary" target="_blank" rel="noopener noreferrer" style="margin-right:10px; background-color:#333;">View Code on GitHub »</a>
    {% endif %}
    <a href="{{ '/assets/docs/UP2091348_Dissertation.pdf' | relative_url }}" class="btn-primary" target="_blank" rel="noopener noreferrer" style="background-color:#555;">Read Full Dissertation (PDF) »</a>
</p>
