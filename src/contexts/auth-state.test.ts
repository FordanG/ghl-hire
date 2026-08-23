import assert from 'node:assert/strict';
import test from 'node:test';
import { deferAuthStateWork } from './auth-state';

test('defers Supabase work until after the auth callback returns', async () => {
  let scheduledWork: (() => void) | undefined;
  let workStarted = false;

  const result = deferAuthStateWork(
    async () => {
      workStarted = true;
    },
    {
      schedule: (callback) => {
        scheduledWork = callback;
      },
    }
  );

  assert.equal(result, undefined);
  assert.equal(workStarted, false);
  assert.ok(scheduledWork);

  scheduledWork();
  await Promise.resolve();

  assert.equal(workStarted, true);
});

test('reports deferred failures without rejecting the auth callback', async () => {
  let scheduledWork: (() => void) | undefined;
  let reportedError: unknown;
  const failure = new Error('profile lookup failed');

  deferAuthStateWork(
    async () => {
      throw failure;
    },
    {
      schedule: (callback) => {
        scheduledWork = callback;
      },
      onError: (error) => {
        reportedError = error;
      },
    }
  );

  assert.ok(scheduledWork);
  scheduledWork();
  await Promise.resolve();
  await Promise.resolve();

  assert.equal(reportedError, failure);
});
