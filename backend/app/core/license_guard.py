"""OMEGA NEXUS AI OS — Core License & Anti-Tamper Integrity Guard.
Enforces proprietary licensing, author attribution, and non-removability.
"""
import os
import sys
import hashlib
import logging
from pathlib import Path
from typing import Dict, Any

logger = logging.getLogger("nexus.license_guard")

AUTHOR_NAME = "Pushkar"
AUTHOR_GITHUB = "pushka2006"
AUTHOR_EMAIL = "pushkarbalyan14@gmail.com"
PROJECT_NAME = "OMEGA NEXUS AI OS"
EXPECTED_LICENSE_HASH = "ef5ea063b4a0efb04421f89ca38a9b6462889322cef652dfc6791b5fed8135c1"

REQUIRED_CLAUSES = [
    "PROPRIETARY SOURCE CODE & SOFTWARE LICENSE AGREEMENT",
    "Copyright (c) 2026 Pushkar (pushka2006)",
    "Author & Sole Copyright Holder: Pushkar (Contact: pushkarbalyan14@gmail.com)",
    "ALL RIGHTS RESERVED & STRICT PROHIBITION ON COPYING",
    "EXCLUSIVE AMENDMENT RIGHTS (LICENSE INTEGRITY & LOCK)",
    "NON-REMOVABILITY & COPYRIGHT MANAGEMENT INFORMATION",
    "RETROACTIVE APPLICATION & PRIOR ACCESS INCLUSION",
]


def find_license_path() -> Path:
    """Locate the root LICENSE file in repository tree."""
    candidates = [
        Path(__file__).resolve().parent.parent.parent.parent / "LICENSE",
        Path(__file__).resolve().parent.parent.parent / "LICENSE",
        Path.cwd() / "LICENSE",
        Path.cwd().parent / "LICENSE",
    ]
    for p in candidates:
        if p.exists() and p.is_file():
            return p
    return candidates[0]


def verify_license_integrity() -> Dict[str, Any]:
    """
    Validates existence, structure, author integrity, and non-tamper state of the LICENSE.
    Throws a RuntimeError or returns validation report.
    """
    lic_path = find_license_path()

    if not lic_path.exists():
        msg = (
            f"[FATAL LICENSE ERROR] LICENSE file is missing from {lic_path}. "
            "This software is strictly proprietary to Pushkar (pushka2006). "
            "Execution is forbidden without an intact LICENSE file."
        )
        logger.critical(msg)
        return {
            "valid": False,
            "error": "LICENSE_MISSING",
            "message": msg,
            "author": AUTHOR_NAME,
            "github": AUTHOR_GITHUB,
        }

    try:
        content = lic_path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        msg = f"[FATAL LICENSE ERROR] Unable to read LICENSE file: {e}"
        logger.critical(msg)
        return {
            "valid": False,
            "error": "LICENSE_UNREADABLE",
            "message": msg,
            "author": AUTHOR_NAME,
        }

    # Verify all required non-negotiable clauses
    missing_clauses = [clause for clause in REQUIRED_CLAUSES if clause not in content]
    if missing_clauses:
        msg = (
            f"[FATAL LICENSE ERROR] LICENSE file has been modified or corrupted. "
            f"Missing required proprietary clauses: {missing_clauses}. "
            "Modifying or stripping the license terms is illegal."
        )
        logger.critical(msg)
        return {
            "valid": False,
            "error": "LICENSE_TAMPERED",
            "message": msg,
            "missing_clauses": missing_clauses,
            "author": AUTHOR_NAME,
        }

    file_hash = hashlib.sha256(content.encode("utf-8")).hexdigest().lower()

    return {
        "valid": True,
        "author": AUTHOR_NAME,
        "author_github": AUTHOR_GITHUB,
        "author_email": AUTHOR_EMAIL,
        "project": PROJECT_NAME,
        "license_type": "Proprietary - All Rights Reserved",
        "license_path": str(lic_path),
        "sha256": file_hash,
        "retroactive_enforcement": True,
        "anti_tamper_active": True,
    }


def enforce_license_at_startup(strict: bool = True):
    """
    Enforces proprietary license validation during application boot.
    Terminates execution if the project is unauthorized or tampered with.
    """
    result = verify_license_integrity()
    if not result["valid"]:
        logger.critical("=" * 80)
        logger.critical("🛑 OMEGA NEXUS AI OS — PROPRIETARY LICENSE VIOLATION")
        logger.critical(result.get("message", "License validation failed."))
        logger.critical(f"Copyright Owner: {AUTHOR_NAME} (@{AUTHOR_GITHUB}) <{AUTHOR_EMAIL}>")
        logger.critical("Unauthorized copying, execution, or distribution is prohibited by law.")
        logger.critical("=" * 80)
        if strict:
            raise RuntimeError(
                f"License validation failed: {result.get('error')}. Execution halted."
            )
    else:
        logger.info(
            f"✓ Proprietary License verified for {PROJECT_NAME} (Copyright (c) 2026 {AUTHOR_NAME})."
        )
    return result
