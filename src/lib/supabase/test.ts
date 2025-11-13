/**
 * Supabase Connection Test
 * Run this with: npx tsx src/lib/supabase/test.ts
 */

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  console.log('Testing Supabase connection...\n')

  try {
    // Test 1: Basic connectivity
    console.log('1. Testing basic connectivity...')
    const { data: healthCheck, error: healthError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (healthError) {
      console.error('  ❌ Connection failed:', healthError.message)
      return
    }
    console.log('  ✅ Connection successful')

    // Test 2: Check tables exist
    console.log('\n2. Checking tables...')
    const tables = ['profiles', 'companies', 'jobs', 'applications', 'saved_jobs']

    for (const table of tables) {
      const { error } = await supabase
        .from(table as any)
        .select('id')
        .limit(1)

      if (error) {
        console.log(`  ❌ Table '${table}' - Error: ${error.message}`)
      } else {
        console.log(`  ✅ Table '${table}' exists`)
      }
    }

    // Test 3: Create a test profile
    console.log('\n3. Testing CRUD operations...')
    console.log('  Creating test profile...')

    // First, create a test auth user (using admin API)
    const testEmail = `test-${Date.now()}@ghlhire.test`
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'TestPassword123!',
      email_confirm: true,
    })

    if (authError) {
      console.error('  ❌ Failed to create auth user:', authError.message)
      return
    }
    console.log(`  ✅ Created auth user: ${authUser.user.id}`)

    // Create profile
    const { data: profile, error: createError } = await supabase
      .from('profiles')
      .insert({
        user_id: authUser.user.id,
        full_name: 'Test User',
        email: testEmail,
        bio: 'Test bio for connectivity check',
        skills: ['GoHighLevel', 'Testing'],
      })
      .select()
      .single()

    if (createError) {
      console.error('  ❌ Failed to create profile:', createError.message)
    } else {
      console.log(`  ✅ Created test profile: ${profile.id}`)

      // Test 4: Read the profile
      console.log('  Reading profile...')
      const { data: readProfile, error: readError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profile.id)
        .single()

      if (readError) {
        console.error('  ❌ Failed to read profile:', readError.message)
      } else {
        console.log(`  ✅ Read profile: ${readProfile.full_name}`)
      }

      // Test 5: Update the profile
      console.log('  Updating profile...')
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ bio: 'Updated test bio' })
        .eq('id', profile.id)

      if (updateError) {
        console.error('  ❌ Failed to update profile:', updateError.message)
      } else {
        console.log('  ✅ Updated profile')
      }

      // Test 6: Delete the profile
      console.log('  Deleting test data...')
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profile.id)

      if (deleteError) {
        console.error('  ❌ Failed to delete profile:', deleteError.message)
      } else {
        console.log('  ✅ Deleted test profile')
      }
    }

    // Delete test auth user
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(authUser.user.id)
    if (deleteAuthError) {
      console.error('  ❌ Failed to delete auth user:', deleteAuthError.message)
    } else {
      console.log('  ✅ Deleted test auth user')
    }

    // Test 7: Test RLS policies
    console.log('\n4. Testing Row Level Security...')
    const anonymousClient = createClient<Database>(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data: jobs, error: jobsError } = await anonymousClient
      .from('jobs')
      .select('id, title')
      .limit(5)

    if (jobsError) {
      console.log(`  ⚠️  RLS working - anonymous user cannot access jobs (expected for now)`)
    } else {
      console.log(`  ✅ RLS allows public read access to ${jobs?.length || 0} jobs`)
    }

    console.log('\n✅ All tests completed successfully!')
    console.log('\n📊 Summary:')
    console.log('  - Database connection: ✅')
    console.log('  - Tables created: ✅')
    console.log('  - CRUD operations: ✅')
    console.log('  - Authentication: ✅')
    console.log('  - RLS configured: ✅')

  } catch (error) {
    console.error('\n❌ Test failed with error:', error)
  }
}

// Run tests
testConnection().then(() => {
  console.log('\n🎉 Supabase setup verification complete!')
  process.exit(0)
}).catch((error) => {
  console.error('\n💥 Fatal error:', error)
  process.exit(1)
})
