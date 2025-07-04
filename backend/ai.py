def suggest_priority(title: str):
    title = title.lower()
    if "urgent" in title or "important" in title or "immediate" in title:
        return "High"
    elif "later" in title or "someday" in title:
        return "Low"
    else:
        return "Medium"

def is_duplicate(title: str, existing_titles: list[str]) -> bool:
    return any(title.lower() in t.lower() or t.lower() in title.lower() for t in existing_titles)
