---
layout: default
title: Home
seo_title: Dean Bonsu | Data & BI Developer Portfolio
description: Welcome to Dean Bonsu's portfolio. Discover projects showcasing SQL, Python, Power BI, and Data Science skills applied to real-world challenges.
---

<section class="hero-section">
    <div class="container">
        <h1>Dean Bonsu</h1>
        <p class="hero-subtitle">MSc Data Science & Analytics | BA Economics</p>
        <p>Transforming complex data into actionable insights and impactful visualizations. Specializing in SQL, Python, and Power BI to drive data-driven decision-making.</p>
        <a href="{{ '/projects.html' | relative_url }}" class="btn-primary">Explore My Work</a>
    </div>
</section>

<section class="featured-projects-section">
    <div class="container">
        <h2>Featured Projects</h2>
        <div class="project-grid">
            {% assign featured_projects = site.projects_col | where_exp: "item", "item.featured == true" | sort: "date" | reverse %}
            {% if featured_projects.size == 0 %}
                {% assign featured_projects = site.projects_col | sort: "date" | reverse | limit: 3 %}
            {% endif %}

            {% for project_item in featured_projects %}
                {% include project_card.html project_item=project_item %}
            {% endfor %}
        </div>
        {% if site.projects_col.size > 3 or featured_projects.size < site.projects_col.size %}
        <div style="text-align: center; margin-top: 2rem;">
            <a href="{{ '/projects.html' | relative_url }}" class="btn-primary" style="background-color: #6c757d;">View All Projects</a>
        </div>
        {% endif %}
    </div>

</section>
