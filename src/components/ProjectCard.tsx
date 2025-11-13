'use client'

import { useState } from 'react'
import { ExternalLink, Edit2, Trash2, X } from 'lucide-react'
import type { Project } from '@/lib/actions/project-actions'

interface ProjectCardProps {
  project: Project
  onEdit?: (project: Project) => void
  onDelete?: (projectId: string) => void
  isSelectable?: boolean
  isSelected?: boolean
  onSelect?: (projectId: string, selected: boolean) => void
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
  isSelectable = false,
  isSelected = false,
  onSelect
}: ProjectCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!onDelete) return

    setIsDeleting(true)
    await onDelete(project.id)
    setIsDeleting(false)
    setShowDeleteConfirm(false)
  }

  const handleSelect = () => {
    if (onSelect) {
      onSelect(project.id, !isSelected)
    }
  }

  return (
    <div
      className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 ${
        isSelectable ? 'cursor-pointer' : ''
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={isSelectable ? handleSelect : undefined}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isSelectable && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={handleSelect}
                onClick={(e) => e.stopPropagation()}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            )}
            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mt-1"
            >
              View Project <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
        </div>

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(project)
                }}
                className="p-1 text-gray-500 hover:text-blue-600"
                title="Edit project"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteConfirm(true)
                }}
                className="p-1 text-gray-500 hover:text-red-600"
                title="Delete project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Image */}
      {project.image_url && (
        <div className="mb-3">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-48 object-cover rounded-md"
          />
        </div>
      )}

      {/* Description */}
      {project.description && (
        <p className="text-gray-700 text-sm mb-3 line-clamp-3">
          {project.description}
        </p>
      )}

      {/* Technologies */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Delete Project?</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{project.title}"? This action cannot be undone.
              This project will also be removed from any job applications where it was included.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
