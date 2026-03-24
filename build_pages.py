import os
import shutil
import re

# The pages to generate SEO subdirectories for
pages = {
    "architecture": "Architecture",
    "design": "Design",
    "about-piotr-piotrowski": "About Piotr Piotrowski (The Large P)",
    "research": "Research"
}

# Read the root index.html
with open("index.html", "r", encoding="utf-8") as f:
    html_content = f.read()

# For each page, create a directory and an index.html file that uses ../ for assets
for folder_name, page_title in pages.items():
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)
    
    # We replace the asset paths so they point one directory up
    # styles.css -> ../styles.css
    # script.js -> ../script.js
    # imagemap.js -> ../imagemap.js
    # elementScaler.js -> ../elementScaler.js
    # assets/... -> ../assets/...
    
    modified_html = html_content
    # Use relative paths from subdirectory up one level
    modified_html = re.sub(r'href="styles.css"', 'href="../styles.css"', modified_html)
    modified_html = re.sub(r'src="script.js"', 'src="../script.js"', modified_html)
    modified_html = re.sub(r'src="imagemap.js"', 'src="../imagemap.js"', modified_html)
    modified_html = re.sub(r'src="elementScaler.js"', 'src="../elementScaler.js"', modified_html)
    modified_html = re.sub(r'src="assets/', 'src="../assets/', modified_html)
    
    # Inject SEO title
    seo_title = f"{page_title} - The Virtual Gallery"
    modified_html = re.sub(r'<title>.*?</title>', f'<title>{seo_title}</title>', modified_html)
    
    # Write the sub-index file
    sub_index_path = os.path.join(folder_name, "index.html")
    with open(sub_index_path, "w", encoding="utf-8") as f:
        f.write(modified_html)

print("Generated SEO physical subdirectories.")
