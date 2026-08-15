"""
Test script to verify 36 AI agent training and website generation capability.
"""
import sys
import os
import json

if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Ensure python path includes backend
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.deploy_engine import generate_custom_prompt_website, write_app_files, slugify
from app.core.agent_trainer import agent_trainer


async def run_tests():
    print("==================================================")
    print("1. Testing 36-Agent Full-Stack Training Pipeline")
    print("==================================================")
    
    report = await agent_trainer.train_all_fullstack()
    print(f"✅ Training Status: {report.get('ok')}")
    print(f"✅ Metrics: {json.dumps(report.get('metrics'), indent=2)}")
    print(f"✅ Top Capabilities: {report.get('capabilities_unlocked')[:4]}")

    print("\n==================================================")
    print("2. Testing Custom Website Generation for 5 Prompts")
    print("==================================================")

    test_prompts = [
        ("Task Board", "Task Management Kanban board for engineering teams", "cyber"),
        ("MedBook", "Doctor Appointment & Medical Booking Portal", "emerald"),
        ("ChefAI", "AI Recipe & Meal Planner with nutrition tracker", "gold"),
        ("QuantWallet", "Crypto & Quant Trading Portfolio Tracker", "purple"),
        ("DevShowcase", "Personal AI Developer Showcase Portfolio", "cyber")
    ]

    for name, prompt, theme in test_prompts:
        slug = slugify(name)
        print(f"\n[Prompt] '{prompt}' | Theme: '{theme}'")
        
        # 1. Generate HTML
        html = generate_custom_prompt_website(prompt, name, theme)
        assert "<!DOCTYPE html>" in html, f"Failed generating DOCTYPE for {name}"
        assert "36 AI AGENTS" in html, f"Missing 36 AI Agents badge for {name}"
        assert "window.NexusDB" in html, f"Missing window.NexusDB engine for {name}"
        assert "app-canvas-chart" in html, f"Missing Canvas chart for {name}"
        print(f"  --> Generated HTML ({len(html):,} chars) — Validated OK")

        # 2. Write app files to disk
        app_dir = write_app_files(slug, html, name, prompt)
        print(f"  --> App directory created: {app_dir}")

        index_file = os.path.join(app_dir, "index.html")
        app_jsx = os.path.join(app_dir, "frontend", "App.jsx")
        routes_py = os.path.join(app_dir, "backend", "routes.py")
        schema_sql = os.path.join(app_dir, "database", "schema.sql")
        manifest_json = os.path.join(app_dir, "project_manifest.json")

        for fpath, fname in [(index_file, "index.html"), (app_jsx, "App.jsx"), (routes_py, "routes.py"), (schema_sql, "schema.sql"), (manifest_json, "project_manifest.json")]:
            assert os.path.exists(fpath), f"Missing generated file {fname} at {fpath}"
            fsize = os.path.getsize(fpath)
            print(f"      ✓ {fname} ({fsize:,} bytes)")

    print("\n==================================================")
    print("🎉 ALL 36-AGENT WEBSITE GENERATION TESTS PASSED!")
    print("==================================================")


if __name__ == "__main__":
    import asyncio
    asyncio.run(run_tests())
