/**
 * Script to set up Supabase Storage buckets
 *
 * Usage: node -r dotenv/config -r tsx/cjs scripts/setup-storage.ts
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '../src/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('   Get it from: https://supabase.com/dashboard/project/_/settings/api');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function setupStorageBuckets() {
  console.log('🪣 Setting up Supabase Storage Buckets\n');

  try {
    // Check existing buckets
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error('❌ Failed to list buckets:', listError.message);
      return;
    }

    const existingBucketNames = existingBuckets.map(b => b.name);
    console.log('📦 Existing buckets:', existingBucketNames.join(', ') || 'none\n');

    // Bucket configurations
    const bucketsToCreate = [
      {
        id: 'resumes',
        name: 'Resumes',
        public: false,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
      },
      {
        id: 'profile-photos',
        name: 'Profile Photos',
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      },
      {
        id: 'company-logos',
        name: 'Company Logos',
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
      }
    ];

    // Create buckets
    for (const bucket of bucketsToCreate) {
      if (existingBucketNames.includes(bucket.id)) {
        console.log(`⏭️  Bucket "${bucket.id}" already exists`);
        continue;
      }

      console.log(`📦 Creating bucket: ${bucket.id}...`);

      const { data, error } = await supabase.storage.createBucket(bucket.id, {
        public: bucket.public,
        fileSizeLimit: bucket.fileSizeLimit,
        allowedMimeTypes: bucket.allowedMimeTypes
      });

      if (error) {
        console.error(`❌ Failed to create bucket "${bucket.id}":`, error.message);
        continue;
      }

      console.log(`✅ Bucket "${bucket.id}" created successfully`);
      console.log(`   - Public: ${bucket.public}`);
      console.log(`   - Size limit: ${bucket.fileSizeLimit / 1024 / 1024}MB`);
      console.log(`   - Allowed types: ${bucket.allowedMimeTypes.join(', ')}\n`);
    }

    // Verify all buckets exist
    const { data: finalBuckets, error: finalListError } = await supabase.storage.listBuckets();

    if (finalListError) {
      console.error('❌ Failed to verify buckets:', finalListError.message);
      return;
    }

    const finalBucketNames = finalBuckets.map(b => b.name);
    const allBucketsExist = bucketsToCreate.every(b => finalBucketNames.includes(b.id));

    if (allBucketsExist) {
      console.log('═══════════════════════════════════════');
      console.log('✅ All storage buckets are ready!');
      console.log('═══════════════════════════════════════\n');

      console.log('📝 Storage buckets configured:');
      bucketsToCreate.forEach(b => {
        console.log(`   - ${b.id} (${b.public ? 'public' : 'private'})`);
      });

      console.log('\n📝 Next steps:');
      console.log('   1. Run: node -r dotenv/config -r tsx/cjs scripts/test-profile.ts');
      console.log('   2. Visit http://localhost:3000/dashboard/profile');
      console.log('   3. Test file uploads\n');
    } else {
      console.error('❌ Not all buckets were created successfully');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run setup
setupStorageBuckets();
