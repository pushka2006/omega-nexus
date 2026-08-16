import sys
import shutil
import sqlite3
import json
import re
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(r"c:\Users\Pushkar\OneDrive\Documents\omega nexus\backend")))

from app.core.ultra_industry_engine import generate_ultra_industry_app

BASE_DIR = Path(r"c:\Users\Pushkar\OneDrive\Documents\omega nexus")
DEPLOYED_APPS_DIR = BASE_DIR / "backend" / "deployed_apps"
PUBLIC_APPS_DIR = BASE_DIR / "frontend" / "public" / "apps"
PUBLIC_DEPLOYED_DIR = BASE_DIR / "frontend" / "public" / "deployed"
BUILD_APPS_DIR = BASE_DIR / "frontend" / "build" / "apps"
BUILD_DEPLOYED_DIR = BASE_DIR / "frontend" / "build" / "deployed"

def main():
    slugs_to_generate = {}

    # 1. Collect from existing folders
    for d in DEPLOYED_APPS_DIR.iterdir():
        if d.is_dir():
            slug = d.name
            slugs_to_generate[slug] = slug.replace("-", " ").title()

    # 2. Collect from SQLite database
    db_path = BASE_DIR / "backend" / "db_store" / "omega_nexus.db"
    if db_path.exists():
        try:
            conn = sqlite3.connect(db_path)
            conn.row_factory = sqlite3.Row
            rows = conn.execute("SELECT * FROM projects").fetchall()
            for r in rows:
                pdict = json.loads(r["data"]) if ("data" in r.keys() and isinstance(r["data"], str)) else dict(r)
                pname = pdict.get("name") or pdict.get("title") or "Enterprise App"
                
                # Register all variations (raw id, stripped id, normalized name)
                raw_id = str(pdict.get("id") or "").replace("proj-", "")
                norm_name = re.sub(r"[^a-z0-9-]+", "", pname.lower().replace(" ", "-")) if hasattr(pname, 'lower') else ""
                
                if raw_id:
                    slugs_to_generate[raw_id] = pname
                if norm_name:
                    slugs_to_generate[norm_name] = pname
            conn.close()
        except Exception as e:
            print("DB read warning:", e)

    # 3. Always include special or common test slugs
    special_slugs = [
        "absolutely-below-copypasteready-master",
        "smart-city-ai-platform",
        "cybersecurity-threat-scanner",
        "quantum-trading-pro",
        "healthcare-ai-monitor",
        "e-commerce-ai-suite"
    ]
    for s in special_slugs:
        if s not in slugs_to_generate:
            slugs_to_generate[s] = s.replace("-", " ").title()

    print(f"[REBUILD] Generating Ultra-Tier Industry applications for {len(slugs_to_generate)} projects...")

    for slug, title in slugs_to_generate.items():
        if not slug:
            continue
        html_content = generate_ultra_industry_app(slug, title)

        # Write to backend deployed_apps
        backend_app_dir = DEPLOYED_APPS_DIR / slug
        backend_app_dir.mkdir(parents=True, exist_ok=True)
        index_file = backend_app_dir / "index.html"
        with open(index_file, "w", encoding="utf-8") as f:
            f.write(html_content)

        # Copy to frontend public and build directories (both /apps and /deployed)
        for target_base in [PUBLIC_APPS_DIR, PUBLIC_DEPLOYED_DIR, BUILD_APPS_DIR, BUILD_DEPLOYED_DIR]:
            dest_dir = target_base / slug
            dest_dir.mkdir(parents=True, exist_ok=True)
            shutil.copy2(index_file, dest_dir / "index.html")

    print(f"[SUCCESS] Successfully generated and synchronized all {len(slugs_to_generate)} Ultra-Tier Industry Applications across apps and deployed routes!")

if __name__ == "__main__":
    main()
