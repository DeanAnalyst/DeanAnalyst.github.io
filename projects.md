---
layout: default
title: Projects
seo_title: Projects by Dean Bonsu | SQL, Python, Power BI
description: A collection of data science, analytics, and business intelligence projects by Dean Bonsu, showcasing technical skills and problem-solving abilities.
---

<h1>My Projects</h1>

<p>Below is a selection of projects where I've applied my skills in data analysis, machine learning, SQL, Python, and BI dashboarding to solve real-world problems and generate insights. Click on any project to learn more about the challenge, my approach, and the outcomes.</p>

<div class="project-grid" style="margin-top: 2rem;">
    {% assign sorted_projects = site.projects_col | sort: "date" | reverse %}
    {% for project_item in sorted_projects %}
        {% include project_card.html project_item=project_item %}
    {% endfor %}

    {% if site.projects_col.size == 0 %}
        <p><em>More projects coming soon! Check back later.</em></p>
    {% endif %}

</div>
