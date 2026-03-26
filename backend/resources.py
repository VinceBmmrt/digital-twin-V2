from pypdf import PdfReader
import json
import os

# ✅ Chemin absolu basé sur l'emplacement de resources.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Read LinkedIn PDF
try:
    reader = PdfReader(os.path.join(BASE_DIR, "data", "cv.pdf"))
    cv = ""
    for page in reader.pages:
        text = page.extract_text()
        if text:
            cv += text
except FileNotFoundError:
    cv = "cv profile not available"

# Read other data files
with open(os.path.join(BASE_DIR, "data", "summary.txt"), "r", encoding="utf-8") as f:
    summary = f.read()

with open(os.path.join(BASE_DIR, "data", "style.txt"), "r", encoding="utf-8") as f:
    style = f.read()

with open(os.path.join(BASE_DIR, "data", "github.txt"), "r", encoding="utf-8") as f:
    github = f.read()

with open(os.path.join(BASE_DIR, "data", "facts.json"), "r", encoding="utf-8") as f:
    facts = json.load(f)