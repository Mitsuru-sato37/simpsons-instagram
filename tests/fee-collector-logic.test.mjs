import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pickNextOpenGame_, projectReceipts_ } = require('../fee-collector/Logic.js');
const codeGs = readFileSync(new URL('../fee-collector/Code.gs', import.meta.url), 'utf8');

const games = [
  { id: 'G1', status: '完了' },
  { id: 'G2', status: '予定' },
  { id: 'G3', status: '予定' },
  { id: 'G4', status: '中止' },
];

test('selects the first open game after the completed game', () => {
  assert.equal(pickNextOpenGame_(games, 'G2').id, 'G3');
});

test('falls back to the first open game', () => {
  assert.equal(pickNextOpenGame_(games, 'G3').id, 'G2');
  assert.equal(pickNextOpenGame_(games, 'missing').id, 'G2');
});

test('separates cancelled receipts', () => {
  const result = projectReceipts_([
    ['R1', 'G2', 'P1', '選手A', '2026/10/18 08:00', 300, '現金', '有効', ''],
    ['R2', 'G2', 'P2', '選手B', '2026/10/18 08:01', 300, 'PayPay', '取消', '画面から取消'],
  ], 'G2');

  assert.equal(result.active.length, 1);
  assert.equal(result.cancelled.length, 1);
  assert.equal(result.cancelled[0].status, '取消');
  assert.equal(result.byPlayer.P1.length, 1);
  assert.equal(result.byPlayer.P2.length, 1);
});

test('does not project active amount above the source row amount', () => {
  const result = projectReceipts_([
    ['R1', 'G2', 'P1', '選手A', '2026/10/18 08:00', 300, '現金', '有効', ''],
  ], 'G2');

  assert.equal(result.byPlayer.P1[0].amount, 300);
});

test('backend delegates receipt projection and returns cancelled state', () => {
  assert.match(codeGs, /projectReceipts_\(/);
  assert.match(codeGs, /cancelled:/);
});

test('game completion uses a script lock and next-open selection', () => {
  const completeGame = codeGs.slice(codeGs.indexOf('function completeGame'));
  assert.match(completeGame, /LockService\.getScriptLock\(\)/);
  assert.match(completeGame, /pickNextOpenGame_\(/);
});

test('payment path keeps the active-receipt recheck', () => {
  const recordPayment = codeGs.slice(
    codeGs.indexOf('function recordPayment'),
    codeGs.indexOf('function cancelReceipt')
  );
  assert.match(recordPayment, /getActiveReceipts_\(/);
  assert.match(recordPayment, /ALREADY_PAID/);
});
