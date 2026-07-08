import type { CheckResult } from '@/types';

const RECORDS_KEY = 'fact_check_records';

function getRecords(): CheckResult[] {
  const data = localStorage.getItem(RECORDS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveRecords(records: CheckResult[]) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export async function saveCheckRecord(record: Omit<CheckResult, 'id' | 'created_at'>) {
  const records = getRecords();
  const newRecord: CheckResult = {
    ...record,
    id: `check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
  };
  
  records.unshift(newRecord);
  if (records.length > 20) {
    records.pop();
  }
  
  saveRecords(records);
  return newRecord;
}

export async function getCheckRecords() {
  return getRecords();
}

export async function getCurrentUser() {
  const userId = localStorage.getItem('fact_check_current_user');
  if (!userId) return null;
  
  const users = JSON.parse(localStorage.getItem('fact_check_users') || '[]');
  return users.find((u: any) => u.id === userId) || null;
}