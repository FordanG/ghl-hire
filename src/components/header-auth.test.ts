import assert from 'node:assert/strict';
import test from 'node:test';
import { getHeaderAuthView } from './header-auth';

test('shows the signed-out controls when there is no session', () => {
  assert.deepEqual(
    getHeaderAuthView({ loading: false, userType: null, userEmail: null }),
    { state: 'signed-out' }
  );
});

test('gives an authenticated job seeker a visible label and dashboard destination', () => {
  const view = getHeaderAuthView({
    loading: false,
    userType: 'jobseeker',
    userEmail: 'gabrieljohnfordan@gmail.com',
    profileName: 'Gabriel John Fordan',
  });

  assert.equal(view.state, 'signed-in');
  if (view.state !== 'signed-in') return;

  assert.equal(view.accountLabel, 'Gabriel John Fordan');
  assert.equal(view.dashboardHref, '/dashboard');
  assert.equal(view.isEmployer, false);
});

test('uses the email as a visible fallback while account data loads', () => {
  const view = getHeaderAuthView({
    loading: false,
    userType: null,
    userEmail: 'member@example.com',
  });

  assert.equal(view.state, 'signed-in');
  if (view.state !== 'signed-in') return;

  assert.equal(view.accountLabel, 'member@example.com');
  assert.equal(view.dashboardHref, '/dashboard');
});
