-- 只读诊断：在发生错误的API所连接的数据库执行。不会执行迁移或修改签到记录。
-- 2026-10-28后续日志已确认findCheckinRecord报HY000/1267排序规则冲突；
-- 本文件不能作为“缺迁移”的结论。后端已移除该查询的字符串CASE，线上复测待更新JAR。
SELECT DATABASE() AS current_database;

SELECT table_name, column_name, character_set_name, collation_name
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND ((table_name = 'activity_checkin' AND column_name = 'method')
    OR (table_name = 'admin_account' AND column_name = 'login_name'));

SELECT table_name
FROM information_schema.tables
WHERE table_schema = DATABASE()
  AND table_name IN ('activity_checkin', 'activity_checkin_code', 'checkin_token');

SELECT table_name, column_name, column_type, is_nullable
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND table_name IN ('activity_checkin', 'activity_checkin_code')
ORDER BY table_name, ordinal_position;

SELECT tc.table_name, tc.constraint_name, cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
  ON cc.constraint_schema = tc.constraint_schema
 AND cc.constraint_name = tc.constraint_name
WHERE tc.table_schema = DATABASE()
  AND tc.table_name = 'activity_checkin'
  AND tc.constraint_type = 'CHECK';

-- V24完整结构：activity_checkin_code存在；activity_checkin.operator_admin_id允许NULL；
-- method约束允许SELF_SCAN。需结合SQLState、vendorCode和失败接口判断，不直接重放V24。
