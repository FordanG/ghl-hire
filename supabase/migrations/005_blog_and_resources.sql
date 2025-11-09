-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    tags TEXT[],
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    views_count INTEGER DEFAULT 0,
    reading_time_minutes INTEGER,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('guide', 'template', 'tool', 'video', 'course', 'ebook')),
    url TEXT,
    file_url TEXT,
    thumbnail_url TEXT,
    category TEXT NOT NULL,
    tags TEXT[],
    is_premium BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Comments Table
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);

CREATE INDEX idx_resources_slug ON resources(slug);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_type ON resources(resource_type);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_published_at ON resources(published_at DESC);

CREATE INDEX idx_blog_comments_post_id ON blog_comments(blog_post_id);
CREATE INDEX idx_blog_comments_profile_id ON blog_comments(profile_id);
CREATE INDEX idx_blog_comments_parent_id ON blog_comments(parent_comment_id);

-- Triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at
    BEFORE UPDATE ON blog_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for Blog Posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published blog posts are viewable by everyone"
    ON blog_posts FOR SELECT
    USING (status = 'published');

CREATE POLICY "Authors can view their own blog posts"
    ON blog_posts FOR SELECT
    USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authors can create blog posts"
    ON blog_posts FOR INSERT
    WITH CHECK (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authors can update their own blog posts"
    ON blog_posts FOR UPDATE
    USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authors can delete their own blog posts"
    ON blog_posts FOR DELETE
    USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for Resources
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published resources are viewable by everyone"
    ON resources FOR SELECT
    USING (status = 'published');

CREATE POLICY "Authors can view their own resources"
    ON resources FOR SELECT
    USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authors can create resources"
    ON resources FOR INSERT
    WITH CHECK (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authors can update their own resources"
    ON resources FOR UPDATE
    USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authors can delete their own resources"
    ON resources FOR DELETE
    USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for Blog Comments
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved comments are viewable by everyone"
    ON blog_comments FOR SELECT
    USING (is_approved = true);

CREATE POLICY "Users can view their own comments"
    ON blog_comments FOR SELECT
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authenticated users can create comments"
    ON blog_comments FOR INSERT
    WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own comments"
    ON blog_comments FOR UPDATE
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own comments"
    ON blog_comments FOR DELETE
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
