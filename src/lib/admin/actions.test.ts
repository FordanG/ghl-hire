import assert from 'node:assert/strict';
import test from 'node:test';
import { parseAdminAction } from './actions';

const id = '3d327665-6df4-45f6-949a-22f22fe310df';

test('accepts an allowlisted job status change', () => {
  const result = parseAdminAction({ resource: 'jobs', id, action: 'set-status', value: 'closed' });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.value, 'closed');
});

test('accepts explicit boolean account suspension changes', () => {
  assert.equal(
    parseAdminAction({ resource: 'users', id, action: 'set-suspended', value: true }).ok,
    true
  );
});

test('rejects arbitrary tables and values', () => {
  assert.equal(
    parseAdminAction({ resource: 'admin_roles', id, action: 'set-status', value: 'admin' }).ok,
    false
  );
  assert.equal(
    parseAdminAction({ resource: 'jobs', id, action: 'set-status', value: 'deleted' }).ok,
    false
  );
});

test('rejects malformed resource identifiers', () => {
  assert.equal(
    parseAdminAction({ resource: 'tickets', id: 'not-a-uuid', action: 'set-status', value: 'closed' }).ok,
    false
  );
});
