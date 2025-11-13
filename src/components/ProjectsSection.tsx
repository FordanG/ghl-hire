'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Upload } from 'lucide-react'
import ProjectCard from './ProjectCard'
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  type Project,
  type CreateProjectData
} from '@/lib/actions/project-actions'
import { toast } from 'sonner'

interface ProjectsSectionProps {
  profileId: string
}

export default function ProjectsSection({ profileId }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState<CreateProjectData>({
    title: '',
    description: '',
    url: '',
    technologies: []
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [techInput, setTechInput] = useState('')

  useEffect(() => {
    loadProjects()
  }, [profileId])

  const loadProjects = async () => {
    setIsLoading(true)
    const { projects: data, error } = await getProjects(profileId)
    if (error) {
      toast.error('Failed to load projects')
      console.error(error)
    } else {
      setProjects(data || [])
    }
    setIsLoading(false)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || '',
      url: project.url || '',
      technologies: project.technologies || []
    })
    setImagePreview(project.image_url || null)
    setShowForm(true)
  }

  const handleDelete = async (projectId: string) => {
    const { success, error } = await deleteProject(projectId)
    if (error) {
      toast.error(error)
    } else {
      toast.success('Project deleted successfully')
      setProjects(projects.filter(p => p.id !== projectId))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddTechnology = () => {
    if (techInput.trim() && formData.technologies!.length < 10) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), techInput.trim()]
      })
      setTechInput('')
    }
  }

  const handleRemoveTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies!.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Project title is required')
      return
    }

    setIsSaving(true)

    try {
      // Upload image if provided
      let imageUrl = editingProject?.image_url || null
      if (imageFile) {
        const { url, error } = await uploadProjectImage(profileId, imageFile)
        if (error) {
          toast.error(error)
          setIsSaving(false)
          return
        }
        imageUrl = url
      }

      const projectData = {
        ...formData,
        image_url: imageUrl ?? undefined
      }

      if (editingProject) {
        // Update existing project
        const { project, error } = await updateProject(editingProject.id, projectData)
        if (error) {
          toast.error(error)
        } else {
          toast.success('Project updated successfully')
          setProjects(projects.map(p => p.id === editingProject.id ? project! : p))
          resetForm()
        }
      } else {
        // Create new project
        const { project, error } = await createProject(profileId, projectData)
        if (error) {
          toast.error(error)
        } else {
          toast.success('Project added successfully')
          setProjects([...projects, project!])
          resetForm()
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error(error)
    }

    setIsSaving(false)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      technologies: []
    })
    setImageFile(null)
    setImagePreview(null)
    setEditingProject(null)
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
        {!showForm && projects.length < 5 && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Showcase up to 5 projects. You can select up to 3 to include when applying for jobs.
      </p>

      {/* Project Form */}
      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., GoHighLevel CRM Dashboard"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your project, your role, and the impact..."
              />
            </div>

            {/* URL */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                Project URL
              </label>
              <input
                type="url"
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com or https://github.com/..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Image
              </label>
              {imagePreview && (
                <div className="mb-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500">
                <Upload className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">
                JPEG, PNG, WebP, or SVG (max 5MB)
              </p>
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technologies
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTechnology()
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., React, Node.js, PostgreSQL"
                  disabled={formData.technologies!.length >= 10}
                />
                <button
                  type="button"
                  onClick={handleAddTechnology}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  disabled={formData.technologies!.length >= 10}
                >
                  Add
                </button>
              </div>
              {formData.technologies!.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.technologies!.map((tech, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Max 10 technologies
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Grid */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No projects yet. Add your first project to showcase your work!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {projects.length >= 5 && (
        <p className="text-sm text-gray-600 mt-4 text-center">
          You've reached the maximum of 5 projects. Delete a project to add a new one.
        </p>
      )}
    </div>
  )
}
