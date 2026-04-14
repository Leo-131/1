# -*- coding: utf-8 -*-
"""Build complete v8.0.3 HTML from reference browser data"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Read the extracted HTML content (we saved it earlier via browser)
try:
    with open('ref_content.txt', 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
except:
    content = None

# Check what we have in index_tail - it has the complete JS ending
with open('index_tail.html', 'r', encoding='utf-8', errors='replace') as f:
    tail_content = f.read()

# Check if tail has the full JS
has_closing_script = '</script>' in tail_content
has_closing_body = '</body>' in tail_content
has_closing_html = '</html>' in tail_content
print(f'Tail has closing script: {has_closing_script}')
print(f'Tail has closing body: {has_closing_body}')
print(f'Tail has closing html: {has_closing_html}')

# The tail ends with the modal-box construction but is cut off
# We need to complete the JS that was truncated
# The modal overlay and remaining functions need to be added

# Let's check what's at the end of the main file
with open('index.html', 'r', 'utf-8', errors='replace') as f:
    main_content = f.read()

# Find the actual last function that was complete
last_complete = main_content.rfind('async function loadData')
print(f'loadData found at: {last_complete}')

# Check what functions exist
funcs = ['showSection', 'showToast', 'loadData', 'renderPipeline', 
         'filterContacts', 'toggleExpand', 'setPlatform', 'loadAnalytics',
         'renderAnalytics', 'loadTemplates', 'renderTemplates',
         'generateMessage', 'copyMessage', 'exportData', 'escapeHtml',
         '_sl', 'toggleLangDropdown', 'askAI', 'sendAI',
         'startPomodoro', 'pausePomodoro', 'resetPomodoro', 
         'openAutoGLM', 'copyScript', 'addCount', 'renderAutoProgress',
         'addAutoLog', 'clearAutoLogs', 'quickAddAll', 'applyQuickAdd',
         'addNewTask', 'toggleTaskById', 'deleteTask', 'loadTasks', 'saveTasks']
for fn in funcs:
    idx = main_content.find('function ' + fn)
    if idx < 0:
        idx = tail_content.find('function ' + fn)
    print(f'{fn}: {"MAIN" if idx >= 0 and idx < len(main_content) else ("TAIL" if idx >= 0 else "MISSING")} (at {idx})')

print(f'\nMain ends at: {repr(main_content[-100:])}')
