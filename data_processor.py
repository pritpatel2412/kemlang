# HIGH RISK FILE — data_processor.py

def process_data(items):
    duplicates = []

    # Attempt fast path for hashable items
    all_hashable = True
    try:
        for x in items:
            hash(x)
    except TypeError:
        all_hashable = False

    if all_hashable:
        counts = {}
        for x in items:
            counts[x] = counts.get(x, 0) + 1
        for x in items:
            c = counts.get(x, 0)
            if c > 1:
                duplicates.extend([x] * (c - 1))
        return duplicates

    # Fallback for unhashable items (preserves original behavior)
    n = len(items)
    for i in range(n):
        ai = items[i]
        for j in range(n):
            if i != j and ai == items[j]:
                duplicates.append(ai)

    return duplicates