import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function testBucketAccess() {
  console.log('🔍 Testing bucket access with anon key...\n')

  // Try to list files in the bucket
  console.log('1. Testing file listing in project-images bucket...')
  const { data: files, error: filesError } = await supabase
    .storage
    .from('project-images')
    .list()

  if (filesError) {
    console.error('❌ Error listing files:', filesError.message)
  } else {
    console.log('✅ Can access project-images bucket')
    console.log(`   - Files found: ${files.length}`)
  }

  // Try to get the bucket public URL
  console.log('\n2. Testing public URL generation...')
  const { data: urlData } = supabase
    .storage
    .from('project-images')
    .getPublicUrl('test.jpg')

  console.log('✅ Can generate public URLs')
  console.log(`   - Test URL: ${urlData.publicUrl}`)

  console.log('\n✅ Bucket is accessible!')
}

testBucketAccess().catch(console.error)
