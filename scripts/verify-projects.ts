import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyMigration() {
  console.log('🔍 Verifying projects migration...\n')

  // Check if projects table exists and can be queried
  console.log('1. Testing projects table...')
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .limit(1)

  if (projectsError) {
    console.error('❌ Projects table error:', projectsError.message)
  } else {
    console.log('✅ Projects table exists and is accessible')
  }

  // Check if application_projects table exists and can be queried
  console.log('\n2. Testing application_projects table...')
  const { data: appProjects, error: appProjectsError } = await supabase
    .from('application_projects')
    .select('*')
    .limit(1)

  if (appProjectsError) {
    console.error('❌ Application projects table error:', appProjectsError.message)
  } else {
    console.log('✅ Application projects table exists and is accessible')
  }

  // Check if storage bucket exists
  console.log('\n3. Testing storage bucket...')
  const { data: buckets, error: bucketsError } = await supabase
    .storage
    .listBuckets()

  if (bucketsError) {
    console.error('❌ Storage error:', bucketsError.message)
  } else {
    const projectImagesBucket = buckets.find(b => b.id === 'project-images')
    if (projectImagesBucket) {
      console.log('✅ project-images bucket exists')
      console.log(`   - Public: ${projectImagesBucket.public}`)
      console.log(`   - File size limit: ${projectImagesBucket.file_size_limit ? projectImagesBucket.file_size_limit / 1024 / 1024 + ' MB' : 'not set'}`)
    } else {
      console.error('❌ project-images bucket not found')
      return
    }
  }

  console.log('\n✅ All verification checks completed!')
}

verifyMigration().catch(console.error)
