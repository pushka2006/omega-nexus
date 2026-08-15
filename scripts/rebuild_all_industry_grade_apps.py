"""
Rebuild all 42 applications using the Industry-Grade Application Generator Engine.
"""

import os
import sys
import shutil
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(r"c:\Users\Pushkar\OneDrive\Documents\omega nexus\backend")))

from app.core.industry_grade_engine import generate_industry_grade_app

BASE_DIR = Path(r"c:\Users\Pushkar\OneDrive\Documents\omega nexus")
DEPLOYED_APPS_DIR = BASE_DIR / "backend" / "deployed_apps"
PUBLIC_APPS_DIR = BASE_DIR / "frontend" / "public" / "apps"
BUILD_APPS_DIR = BASE_DIR / "frontend" / "build" / "apps"

def main():
    app_dirs = [d for d in DEPLOYED_APPS_DIR.iterdir() if d.is_dir()]
    print(f"[REBUILD] Rebuilding {len(app_dirs)} applications with Industry-Grade architecture...")

    for app_dir in app_dirs:
        slug = app_dir.name
        title = slug.replace("-", " ").title()
        index_file = app_dir / "index.html"

        html_content = generate_industry_grade_app(slug, title)

        with open(index_file, "w", encoding="utf-8") as f:
            f.write(html_content)

        # Copy to frontend public and build directories
        for target_base in [PUBLIC_APPS_DIR, BUILD_APPS_DIR]:
            dest_dir = target_base / slug
            dest_dir.mkdir(parents=True, exist_ok=True)
            shutil.copy2(index_file, dest_dir / "index.html")

    print(f"[SUCCESS] Rebuilt and synchronized all {len(app_dirs)} applications to true Industry Grade!")

if __name__ == "__main__":
    main()
