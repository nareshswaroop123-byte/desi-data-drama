"""DDD fictional practice case. Run beside payments.csv. No dependencies."""
import csv
from collections import defaultdict
from pathlib import Path
groups = defaultdict(list)
with Path(__file__).with_name("payments.csv").open(encoding="utf-8-sig", newline="") as source:
    for row in csv.DictReader(source):
        row["amount"] = int(row["amount"])
        groups[(row["invoice_id"], row["vendor"])].append(row)
for (invoice, vendor), rows in groups.items():
    if len(rows) > 1:
        total = sum(row["amount"] for row in rows)
        print(invoice, vendor, [row["payment_id"] for row in rows])
        print("Total paid:", total)
        if len({row["amount"] for row in rows}) == 1:
            print("Potential excess if one payment was due:", total - rows[0]["amount"])
        print("Verify invoice, bank references, reversals and instalments.")

