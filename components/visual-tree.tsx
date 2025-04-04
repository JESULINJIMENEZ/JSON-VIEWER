"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface VisualTreeProps {
  data: any
  onNodeSelect?: (path: string, value: any) => void
}

export function VisualTree({ data, onNodeSelect }: VisualTreeProps) {
  return (
    <div className="min-w-[500px]">
      <TreeNode data={data} label="root" path="root" onNodeSelect={onNodeSelect} isRoot={true} />
    </div>
  )
}

interface TreeNodeProps {
  data: any
  label: string
  path: string
  onNodeSelect?: (path: string, value: any) => void
  isRoot?: boolean
  isLast?: boolean
}

function TreeNode({ data, label, path, onNodeSelect, isRoot = false, isLast = true }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const isObject = data !== null && typeof data === "object"
  const isArray = Array.isArray(data)

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onNodeSelect) {
      onNodeSelect(path, data)
    }

    if (isObject) {
      setIsExpanded(!isExpanded)
    }
  }

  const getNodeColor = () => {
    if (isArray) return "bg-blue-100 border-blue-300 hover:bg-blue-200"
    if (isObject) return "bg-purple-100 border-purple-300 hover:bg-purple-200"
    if (typeof data === "string") return "bg-green-100 border-green-300 hover:bg-green-200"
    if (typeof data === "number") return "bg-yellow-100 border-yellow-300 hover:bg-yellow-200"
    if (typeof data === "boolean") return "bg-red-100 border-red-300 hover:bg-red-200"
    return "bg-gray-100 border-gray-300 hover:bg-gray-200"
  }

  const getNodeLabel = () => {
    if (isArray) return `${label} [${data.length}]`
    if (isObject) return `${label} {${Object.keys(data).length}}`
    return `${label}: ${JSON.stringify(data)}`
  }

  const renderChildren = () => {
    if (!isObject || !isExpanded) return null

    const entries = Object.entries(data)

    return (
      <ul
        className={cn(
          "pl-8 relative",
          !isLast &&
            "before:absolute before:top-0 before:bottom-0 before:left-0 before:border-l-2 before:border-gray-300",
        )}
      >
        {entries.map(([key, value], index) => (
          <li
            key={key}
            className={cn(
              "relative pt-2",
              "before:absolute before:top-0 before:left-0 before:w-8 before:h-6 before:border-l-2 before:border-b-2 before:border-gray-300 before:rounded-bl-lg",
            )}
          >
            <TreeNode
              data={value}
              label={key}
              path={`${path}.${key}`}
              onNodeSelect={onNodeSelect}
              isLast={index === entries.length - 1}
            />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div>
      <div
        className={cn("inline-block px-3 py-1 rounded-md border cursor-pointer transition-colors", getNodeColor())}
        onClick={handleNodeClick}
      >
        <span className="font-medium">{getNodeLabel()}</span>
      </div>
      {renderChildren()}
    </div>
  )
}

