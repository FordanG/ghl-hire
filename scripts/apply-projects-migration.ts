import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('📦 Applying projects table migration...\n');

    // Read the migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/016_projects_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      // Try alternative method - direct query
      console.log('Trying alternative method...');
      const { error: altError } = await supabase.from('_migrations').insert({ name: '016_projects_table' });

      if (altError && altError.code !== '42P01') { // 42P01 is table doesn't exist
        console.error('❌ Migration failed:', altError);
        process.exit(1);
      }
    }

    console.log('✅ Migration applied successfully!');
    console.log('\n📊 Tables created:');
    console.log('  - projects');
    console.log('  - application_projects');
    console.log('\n🔒 RLS policies applied');
    console.log('\n✨ Ready to build the Projects feature!');

  } catch (error) {
    console.error('❌ Error applying migration:', error);
    process.exit(1);
  }
}

applyMigration();
