INSERT INTO settings(key,value) VALUES('gate_q','九月一号是什么纪念日') ON CONFLICT(key) DO NOTHING;
INSERT INTO settings(key,value) VALUES('gate_a','领证纪念日') ON CONFLICT(key) DO NOTHING;
