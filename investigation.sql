-- Fictional DDD practice dataset. SQLite. Safe to rerun.
CREATE TABLE IF NOT EXISTS payments (payment_id TEXT PRIMARY KEY, invoice_id TEXT, vendor TEXT, amount INTEGER);
INSERT OR IGNORE INTO payments VALUES
('PAY-001','INV-101','Neem Supplies',8500),
('PAY-002','INV-102','Kesar Print',6000),
('PAY-003','INV-103','Tara Systems',12000),
('PAY-004','INV-104','Neem Supplies',18000),
('PAY-005','INV-103','Tara Systems',12000),
('PAY-006','INV-105','Kesar Print',8000);
SELECT invoice_id,vendor,COUNT(*) AS entries,SUM(amount) AS total_paid FROM payments GROUP BY invoice_id,vendor HAVING COUNT(*) > 1;

