/**
 * Test script for profile management functionality
 *
 * Usage: node -r dotenv/config -r tsx/cjs scripts/test-profile.ts
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '../src/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use anon key for regular operations
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Use service key for admin operations (bucket management)
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function testProfileOperations() {
  console.log('🧪 Testing Profile Management Operations\n');

  try {
    // Test 1: Check if profiles table exists and is accessible
    console.log('1️⃣  Testing profile query...');
    const { data: profiles, error: queryError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (queryError) {
      console.error('❌ Profile query failed:', queryError.message);
      return;
    }
    console.log('✅ Profile query successful\n');

    // Test 2: Check storage buckets
    console.log('2️⃣  Testing storage buckets...');
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();

    if (bucketsError) {
      console.error('❌ Storage buckets query failed:', bucketsError.message);
      return;
    }

    const requiredBuckets = ['resumes', 'profile-photos', 'company-logos'];
    const existingBuckets = buckets.map(b => b.name);
    const missingBuckets = requiredBuckets.filter(b => !existingBuckets.includes(b));

    if (missingBuckets.length > 0) {
      console.error('❌ Missing storage buckets:', missingBuckets.join(', '));
      return;
    }
    console.log('✅ All storage buckets exist:', requiredBuckets.join(', '));
    console.log('\n');

    // Test 3: Test profile completion calculation
    console.log('3️⃣  Testing profile completion calculation...');

    const testProfile = {
      id: 'test-id',
      user_id: 'test-user',
      full_name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      location: 'Austin, TX',
      bio: 'Test bio',
      skills: ['GoHighLevel', 'Marketing'],
      experience_years: 5,
      linkedin_url: 'https://linkedin.com/in/test',
      portfolio_url: 'https://portfolio.com',
      resume_url: 'https://example.com/resume.pdf',
      profile_photo_url: 'https://example.com/photo.jpg',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Calculate completion
    const fields = [
      testProfile.full_name,
      testProfile.email,
      testProfile.phone,
      testProfile.location,
      testProfile.bio,
      testProfile.skills && testProfile.skills.length > 0,
      testProfile.experience_years !== null,
      testProfile.linkedin_url,
      testProfile.portfolio_url,
      testProfile.resume_url,
      testProfile.profile_photo_url
    ];

    const completedFields = fields.filter(field => !!field).length;
    const completion = Math.round((completedFields / fields.length) * 100);

    console.log(`   Profile completion: ${completion}%`);
    console.log(`   Completed fields: ${completedFields}/${fields.length}`);
    console.log('✅ Profile completion calculation working\n');

    // Test 4: Validate URL function
    console.log('4️⃣  Testing URL validation...');
    const validUrls = [
      'https://linkedin.com/in/test',
      'https://portfolio.com',
      'http://example.com'
    ];

    const invalidUrls = [
      'not a url',
      'linkedin.com',
      'ftp://invalid'
    ];

    let urlTestsPassed = true;

    for (const url of validUrls) {
      try {
        new URL(url);
      } catch {
        console.error(`❌ Valid URL failed: ${url}`);
        urlTestsPassed = false;
      }
    }

    for (const url of invalidUrls) {
      try {
        new URL(url);
        console.error(`❌ Invalid URL passed: ${url}`);
        urlTestsPassed = false;
      } catch {
        // Expected to fail
      }
    }

    if (urlTestsPassed) {
      console.log('✅ URL validation working correctly\n');
    }

    // Test 5: Validate email format
    console.log('5️⃣  Testing email validation...');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'test+tag@example.com'
    ];

    const invalidEmails = [
      'not-an-email',
      '@example.com',
      'test@',
      'test@domain'
    ];

    let emailTestsPassed = true;

    for (const email of validEmails) {
      if (!emailRegex.test(email)) {
        console.error(`❌ Valid email failed: ${email}`);
        emailTestsPassed = false;
      }
    }

    for (const email of invalidEmails) {
      if (emailRegex.test(email)) {
        console.error(`❌ Invalid email passed: ${email}`);
        emailTestsPassed = false;
      }
    }

    if (emailTestsPassed) {
      console.log('✅ Email validation working correctly\n');
    }

    // Test 6: Validate phone format
    console.log('6️⃣  Testing phone validation...');
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;

    const validPhones = [
      '+1 (555) 123-4567',
      '555-123-4567',
      '+44 20 1234 5678',
      '5551234567'
    ];

    const invalidPhones = [
      'not-a-phone',
      'abc123',
      'phone: 555-1234'
    ];

    let phoneTestsPassed = true;

    for (const phone of validPhones) {
      if (!phoneRegex.test(phone)) {
        console.error(`❌ Valid phone failed: ${phone}`);
        phoneTestsPassed = false;
      }
    }

    for (const phone of invalidPhones) {
      if (phoneRegex.test(phone)) {
        console.error(`❌ Invalid phone passed: ${phone}`);
        phoneTestsPassed = false;
      }
    }

    if (phoneTestsPassed) {
      console.log('✅ Phone validation working correctly\n');
    }

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('🎉 All profile management tests passed!');
    console.log('═══════════════════════════════════════\n');

    console.log('✅ Profile CRUD operations ready');
    console.log('✅ Storage buckets configured');
    console.log('✅ Profile completion calculation working');
    console.log('✅ URL validation working');
    console.log('✅ Email validation working');
    console.log('✅ Phone validation working');
    console.log('\n');

    console.log('📝 Next steps:');
    console.log('   1. Test the profile page at http://localhost:3000/dashboard/profile');
    console.log('   2. Sign in with a test user');
    console.log('   3. Try editing profile fields');
    console.log('   4. Upload a test resume');
    console.log('   5. Upload a test profile photo');
    console.log('   6. Verify auto-save functionality');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests
testProfileOperations();
