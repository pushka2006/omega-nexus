"""
Patch script to lift selectedAgentForBuild state in AgentsHub.jsx
"""
import os
import re

target_file = r"c:\Users\Pushkar\OneDrive\Documents\omega nexus\frontend\src\pages\AgentsHub.jsx"

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update WebsiteBuilderTrainingPanel props to accept externalSelectedAgent and onSelectAgent
old_panel_def = "function WebsiteBuilderTrainingPanel() {"
new_panel_def = "function WebsiteBuilderTrainingPanel({ externalSelectedAgent, onSelectAgent }) {"
if old_panel_def in content:
    content = content.replace(old_panel_def, new_panel_def)

# 2. Update useEffect or setSelectedAgentForGen initialization inside WebsiteBuilderTrainingPanel
old_state = "const [selectedAgentForGen, setSelectedAgentForGen] = useState(null);"
new_state = "const [selectedAgentForGen, setSelectedAgentForGen] = useState(externalSelectedAgent || null);\n  useEffect(() => { setSelectedAgentForGen(externalSelectedAgent); }, [externalSelectedAgent]);"

if old_state in content:
    content = content.replace(old_state, new_state)

# 3. Add selectedAgentForBuild state in main AgentsHub component
old_hub_state = "const [selected, setSelected] = useState(null);"
new_hub_state = "const [selected, setSelected] = useState(null);\n  const [selectedAgentForBuild, setSelectedAgentForBuild] = useState(null);"

if old_hub_state in content:
    content = content.replace(old_hub_state, new_hub_state)

# 4. Update WebsiteBuilderTrainingPanel rendering tag in main AgentsHub component
old_tag = "<WebsiteBuilderTrainingPanel />"
new_tag = "<WebsiteBuilderTrainingPanel externalSelectedAgent={selectedAgentForBuild} onSelectAgent={setSelectedAgentForBuild} />"

if old_tag in content:
    content = content.replace(old_tag, new_tag)

# 5. Update card button onClick to use setSelectedAgentForBuild
old_card_btn = "onClick={(e) => { e.stopPropagation(); setSelectedAgentForGen(a); }}"
new_card_btn = "onClick={(e) => { e.stopPropagation(); setSelectedAgentForBuild(a); }}"

if old_card_btn in content:
    content = content.replace(old_card_btn, new_card_btn)

# 6. Update modal close inside WebsiteBuilderTrainingPanel to also notify parent
old_close1 = "setSelectedAgentForGen(null)"
new_close1 = "setSelectedAgentForGen(null); onSelectAgent && onSelectAgent(null);"

if old_close1 in content:
    content = content.replace(old_close1, new_close1)

with open(target_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully fixed AgentsHub state wiring!")
