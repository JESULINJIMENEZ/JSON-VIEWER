"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface JsonTreeProps {
  data: any
  level?: number
  label?: string
  isLast?: boolean
  path?: string
  onNodeSelect?: (path: string, value: any) => void
}

export function JsonTree({ data, level = 0, label, isLast = true, path = "", onNodeSelect }: JsonTreeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2)

  const currentPath = label !== undefined ? (path ? `${path}.${label}` : label) : path

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onNodeSelect) {
      onNodeSelect(currentPath, data)
    }
  }

  const isObject = data !== null && typeof data === "object"
  const isArray = Array.isArray(data)
  const isEmpty = isObject && Object.keys(data).length === 0

  const renderValue = () => {
    if (data === null) return <span className="text-gray-500">null</span>
    if (data === undefined) return <span className="text-gray-500">undefined</span>
    if (typeof data === "string") return <span className="text-green-600">"{data}"</span>
    if (typeof data === "number") return <span className="text-blue-600">{data}</span>
    if (typeof data === "boolean") return <span className="text-purple-600">{data.toString()}</span>
    if (isEmpty) return <span className="text-gray-500">{isArray ? "[]" : "{}"}</span>

    return null
  }

  const renderChildren = () => {
    if (!isObject || !isExpanded) return null

    const entries = Object.entries(data)

    return (
      <div className="ml-6 border-l border-gray-300 pl-3">
        {entries.map(([key, value], index) => (
          <JsonTree
            key={key}
            data={value}
            level={level + 1}
            label={key}
            isLast={index === entries.length - 1}
            path={currentPath}
            onNodeSelect={onNodeSelect}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn("my-1", !isLast && "mb-1")}>
      <div className="flex items-start hover:bg-gray-100 rounded px-1 cursor-pointer" onClick={handleNodeClick}>
        {isObject && !isEmpty ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleExpand()
            }}
            className="mr-1 p-1 hover:bg-gray-200 rounded focus:outline-none"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        ) : (
          <span className="w-5" />
        )}

        <div>
          {label !== undefined && (
            <span>
              <span className="text-red-600">"{label}"</span>
              <span className="mr-1">: </span>
            </span>
          )}

          {isObject && !isEmpty ? (
            <span>
              {isArray ? "[" : "{"}
              {!isExpanded && "..."}
              {!isExpanded && (isArray ? "]" : "}")}
            </span>
          ) : (
            renderValue()
          )}
        </div>
      </div>

      {renderChildren()}

      {isObject && !isEmpty && isExpanded && <div className="ml-5">{isArray ? "]" : "}"}</div>}
    </div>
  )
}

