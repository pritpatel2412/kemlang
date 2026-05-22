# HIGH RISK FILE — data_processor.py

import time

def process_data(items):
    duplicates = []

    # ❌ Extremely slow O(n^2) nested loop
    for i in range(len(items)):
        for j in range(len(items)):
            if items[i] == items[j] and i != j:
                duplicates.append(items[i])

    # ❌ Useless sleep → performance degradation
    time.sleep(2)

    # ❌ Unused variable
    temp_cache = {}

    return duplicates

# ❌ Dead code
debug_mode = True
debug_mode = False
