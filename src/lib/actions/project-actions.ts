// @ts-nocheck
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Project = {
  id: string
  profile_id: string
  title: string
  description: string | null
  url: string | null
  image_url: string | null
  technologies: string[]
  display_order: number
  created_at: string
  updated_at: string
}

export type CreateProjectData = {
  title: string
  description?: string
  url?: string
  image_url?: string
  technologies?: string[]
}

export type UpdateProjectData = Partial<CreateProjectData> & {
  display_order?: number
}

/**
 * Get all projects for a profile
 */
export async function getProjects(profileId: string): Promise<{ projects: Project[] | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('profile_id', profileId)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return { projects: null, error: error.message }
    }

    return { projects: data as Project[], error: null }
  } catch (error) {
    console.error('Unexpected error fetching projects:', error)
    return { projects: null, error: 'Failed to fetch projects' }
  }
}

/**
 * Create a new project
 */
export async function createProject(
  profileId: string,
  data: CreateProjectData
): Promise<{ project: Project | null; error: string | null }> {
  try {
    const supabase = await createClient()

    // Validate title is provided
    if (!data.title || data.title.trim() === '') {
      return { project: null, error: 'Project title is required' }
    }

    // Check if profile has reached max projects (5)
    const { data: existingProjects, error: countError } = await supabase
      .from('projects')
      .select('id', { count: 'exact' })
      .eq('profile_id', profileId)

    if (countError) {
      console.error('Error counting projects:', countError)
      return { project: null, error: 'Failed to validate project limit' }
    }

    if (existingProjects && existingProjects.length >= 5) {
      return { project: null, error: 'Maximum of 5 projects allowed per profile' }
    }

    // Create the project
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        profile_id: profileId,
        title: data.title.trim(),
        description: data.description?.trim() || null,
        url: data.url?.trim() || null,
        image_url: data.image_url || null,
        technologies: data.technologies || [],
        display_order: existingProjects?.length || 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return { project: null, error: error.message }
    }

    revalidatePath('/dashboard/profile')
    return { project: project as Project, error: null }
  } catch (error) {
    console.error('Unexpected error creating project:', error)
    return { project: null, error: 'Failed to create project' }
  }
}

/**
 * Update an existing project
 */
export async function updateProject(
  projectId: string,
  data: UpdateProjectData
): Promise<{ project: Project | null; error: string | null }> {
  try {
    const supabase = await createClient()

    // Build update object
    const updates: any = {}

    if (data.title !== undefined) {
      if (!data.title || data.title.trim() === '') {
        return { project: null, error: 'Project title cannot be empty' }
      }
      updates.title = data.title.trim()
    }

    if (data.description !== undefined) {
      updates.description = data.description?.trim() || null
    }

    if (data.url !== undefined) {
      updates.url = data.url?.trim() || null
    }

    if (data.image_url !== undefined) {
      updates.image_url = data.image_url || null
    }

    if (data.technologies !== undefined) {
      updates.technologies = data.technologies
    }

    if (data.display_order !== undefined) {
      updates.display_order = data.display_order
    }

    if (Object.keys(updates).length === 0) {
      return { project: null, error: 'No fields to update' }
    }

    const { data: project, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      return { project: null, error: error.message }
    }

    revalidatePath('/dashboard/profile')
    return { project: project as Project, error: null }
  } catch (error) {
    console.error('Unexpected error updating project:', error)
    return { project: null, error: 'Failed to update project' }
  }
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    // Get the project's image_url before deleting
    const { data: project } = await supabase
      .from('projects')
      .select('image_url')
      .eq('id', projectId)
      .single()

    // Delete the project
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) {
      console.error('Error deleting project:', error)
      return { success: false, error: error.message }
    }

    // Delete the image from storage if it exists
    if (project?.image_url) {
      const imagePath = project.image_url.split('/').pop()
      if (imagePath) {
        await supabase.storage
          .from('project-images')
          .remove([imagePath])
      }
    }

    revalidatePath('/dashboard/profile')
    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error deleting project:', error)
    return { success: false, error: 'Failed to delete project' }
  }
}

/**
 * Upload project image to Supabase Storage
 */
export async function uploadProjectImage(
  profileId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = await createClient()

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { url: null, error: 'File size must be less than 5MB' }
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return { url: null, error: 'File must be JPEG, PNG, WebP, or SVG' }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${profileId}/${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading image:', error)
      return { url: null, error: error.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(data.path)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error('Unexpected error uploading image:', error)
    return { url: null, error: 'Failed to upload image' }
  }
}

/**
 * Get projects attached to an application
 */
export async function getApplicationProjects(
  applicationId: string
): Promise<{ projects: Project[] | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('application_projects')
      .select(`
        project_id,
        projects (*)
      `)
      .eq('application_id', applicationId)

    if (error) {
      console.error('Error fetching application projects:', error)
      return { projects: null, error: error.message }
    }

    // Extract projects from the nested structure
    const projects = data
      ?.map((item: any) => item.projects)
      .filter(Boolean) as Project[]

    return { projects, error: null }
  } catch (error) {
    console.error('Unexpected error fetching application projects:', error)
    return { projects: null, error: 'Failed to fetch application projects' }
  }
}

/**
 * Attach projects to an application (max 3)
 */
export async function attachProjectsToApplication(
  applicationId: string,
  projectIds: string[]
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    // Validate max 3 projects
    if (projectIds.length > 3) {
      return { success: false, error: 'Maximum of 3 projects can be attached to an application' }
    }

    // Delete existing attachments
    await supabase
      .from('application_projects')
      .delete()
      .eq('application_id', applicationId)

    // Insert new attachments
    if (projectIds.length > 0) {
      const inserts = projectIds.map(projectId => ({
        application_id: applicationId,
        project_id: projectId
      }))

      const { error } = await supabase
        .from('application_projects')
        .insert(inserts)

      if (error) {
        console.error('Error attaching projects:', error)
        return { success: false, error: error.message }
      }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error attaching projects:', error)
    return { success: false, error: 'Failed to attach projects' }
  }
}

/**
 * Reorder projects for a profile
 */
export async function reorderProjects(
  profileId: string,
  projectIdsInOrder: string[]
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    // Update display_order for each project
    const updates = projectIdsInOrder.map((projectId, index) =>
      supabase
        .from('projects')
        .update({ display_order: index })
        .eq('id', projectId)
        .eq('profile_id', profileId)
    )

    await Promise.all(updates)

    revalidatePath('/dashboard/profile')
    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error reordering projects:', error)
    return { success: false, error: 'Failed to reorder projects' }
  }
}
