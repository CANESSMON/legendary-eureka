import csv
import json
import os

input_file = r"c:\Users\Asus\Downloads\job-portal\data\IN.txt"
output_file = r"c:\Users\Asus\Downloads\job-portal\frontend\src\data\cities.json"

cities = []
with open(input_file, 'r', encoding='utf-8') as f:
    reader = csv.reader(f, delimiter='\t')
    for row in reader:
        if len(row) > 14 and row[6] == 'P':
            try:
                pop = int(row[14])
                if pop > 50000:
                    cities.append({
                        "name": row[2], 
                        "population": pop
                    })
            except ValueError:
                pass

cities.sort(key=lambda x: x["population"], reverse=True)
top_cities = [c["name"] for c in cities[:1000]]

seen = set()
unique_cities = []
for c in top_cities:
    if c not in seen:
        unique_cities.append(c)
        seen.add(c)

os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(unique_cities, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(unique_cities)} cities.")
