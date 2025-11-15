import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local')
  console.error('This script requires the service role key to create storage buckets')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createBucket() {
  console.log('🪣 Creating project-images storage bucket...\n')

  // Create the bucket
  const { data: bucket, error: createError } = await supabase
    .storage
    .createBucket('project-images', {
      public: true,
      fileSizeLimit: 5242880, // 5 MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    })

  if (createError) {
    if (createError.message.includes('already exists')) {
      console.log('✅ Bucket already exists')
    } else {
      console.error('❌ Error creating bucket:', createError.message)
      process.exit(1)
    }
  } else {
    console.log('✅ Bucket created successfully')
  }

  // Verify bucket exists
  const { data: buckets, error: listError } = await supabase
    .storage
    .listBuckets()

  if (listError) {
    console.error('❌ Error listing buckets:', listError.message)
    process.exit(1)
  }

  const projectImagesBucket = buckets.find(b => b.id === 'project-images')
  if (projectImagesBucket) {
    console.log('\n📋 Bucket details:')
    console.log(`   - ID: ${projectImagesBucket.id}`)
    console.log(`   - Name: ${projectImagesBucket.name}`)
    console.log(`   - Public: ${projectImagesBucket.public}`)
    console.log(`   - File size limit: ${projectImagesBucket.file_size_limit ? projectImagesBucket.file_size_limit / 1024 / 1024 + ' MB' : 'not set'}`)
    console.log(`   - Created: ${projectImagesBucket.created_at}`)
  }

  console.log('\n✅ Done! Storage bucket is ready.')
  console.log('\nNote: RLS policies for the bucket should be applied via the migration:')
  console.log('  supabase/migrations/017_project_images_storage.sql')
}

createBucket().catch(console.error)
