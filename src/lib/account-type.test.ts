import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveAccountType, signupTypeFromMetadata } from './account-type';

test('a single record decides the account type', () => {
  assert.equal(resolveAccountType({ hasProfile: true, hasCompany: false }), 'jobseeker');
  assert.equal(resolveAccountType({ hasProfile: false, hasCompany: true }), 'employer');
  assert.equal(resolveAccountType({ hasProfile: false, hasCompany: false }), null);
});

test('an account with both records that posted a job is an employer', () => {
  assert.equal(
    resolveAccountType({ hasProfile: true, hasCompany: true, signupType: 'jobseeker', companyJobCount: 2 }),
    'employer'
  );
});

test('an account with both records that signed up as an employer is an employer', () => {
  assert.equal(
    resolveAccountType({ hasProfile: true, hasCompany: true, signupType: 'employer' }),
    'employer'
  );
});

test('a job seeker with an unused company stays a job seeker', () => {
  assert.equal(
    resolveAccountType({ hasProfile: true, hasCompany: true, signupType: 'jobseeker', companyJobCount: 0 }),
    'jobseeker'
  );
});

test('signup type prefers role over the older user_type key', () => {
  assert.equal(signupTypeFromMetadata({ role: 'employer', user_type: 'jobseeker' }), 'employer');
  assert.equal(signupTypeFromMetadata({ user_type: 'employer' }), 'employer');
  assert.equal(signupTypeFromMetadata(null), undefined);
});
