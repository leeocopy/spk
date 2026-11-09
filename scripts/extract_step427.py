import json

transcript_path = r'C:\Users\PC\.gemini\antigravity\brain\29fa61af-2f9c-4217-ab63-8bf624193ff7\.system_generated\logs\transcript_full.jsonl'
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        if '"step_index":427' in line or '"step_index": 427' in line:
            obj = json.loads(line)
            with open('scripts/original_component.txt', 'w', encoding='utf-8') as out:
                out.write(obj.get('content', ''))
            print('Successfully saved to scripts/original_component.txt')
            break

