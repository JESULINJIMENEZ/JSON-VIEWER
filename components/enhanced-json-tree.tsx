"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronRight, Square, Database, List, Type, Hash, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedJsonTreeProps {
  data: any
  level?: number
  label?: string
  isLast?: boolean
  path?: string
  onNodeSelect?: (path: string, value: any) => void
}

export function EnhancedJsonTree({
  data,
  level = 0,
  label,
  isLast = true,
  path = "root",
  onNodeSelect,
}: EnhancedJsonTreeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2)

  const currentPath = label !== undefined ? (path ? `${path}.${label}` : label) : path

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
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

  const getTypeIcon = () => {
    if (isArray) return <List className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    if (isObject) return <Database className="h-4 w-4 text-purple-600 dark:text-purple-400" />
    if (typeof data === "string") return <Type className="h-4 w-4 text-green-600 dark:text-green-400" />
    if (typeof data === "number") return <Hash className="h-4 w-4 text-amber-600 dark:text-amber-400" />
    if (typeof data === "boolean") {
      return data ? (
        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <X className="h-4 w-4 text-red-600 dark:text-red-400" />
      )
    }
    return <Square className="h-4 w-4 text-gray-600 dark:text-gray-400" />
  }

  const getNodeColor = () => {
    if (isArray) return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
    if (isObject) return "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950"
    if (typeof data === "string") return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
    if (typeof data === "number") return "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950"
    if (typeof data === "boolean")
      return data
        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950"
        : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
    return "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
  }

  const renderValue = () => {
    if (data === null) return <span className="text-gray-500 dark:text-gray-400 italic">null</span>
    if (data === undefined) return <span className="text-gray-500 dark:text-gray-400 italic">undefined</span>
    if (typeof data === "string") return <span className="text-green-600 dark:text-green-400">"{data}"</span>
    if (typeof data === "number") return <span className="text-amber-600 dark:text-amber-400">{data}</span>
    if (typeof data === "boolean")
      return (
        <span className={data ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
          {data.toString()}
        </span>
      )
    if (isEmpty)
      return <span className="text-gray-500 dark:text-gray-400 italic">{isArray ? "Empty Array" : "Empty Object"}</span>

    return null
  }

  const renderChildren = () => {
    if (!isObject || !isExpanded) return null

    const entries = Object.entries(data)

    return (
      <div className={cn("ml-5 pl-4 border-l-2 border-slate-200 dark:border-slate-700", level > 0 && "mt-1")}>
        {entries.map(([key, value], index) => (
          <EnhancedJsonTree
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
    <div className={cn("my-1.5", !isLast && "mb-2")}>
      <div
        className={cn(
          "flex items-center rounded-md transition-colors cursor-pointer",
          "hover:bg-slate-100 dark:hover:bg-slate-800",
        )}
        onClick={handleNodeClick}
      >
        <div className="flex items-center min-w-0 flex-1">
          {isObject && !isEmpty ? (
            <button
              onClick={toggleExpand}
              className={cn(
                "mr-1 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none transition-colors",
                "flex items-center justify-center",
              )}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              )}
            </button>
          ) : (
            <span className="w-6" />
          )}

          <span className="mr-1.5 flex-shrink-0">{getTypeIcon()}</span>

          <div className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
            {label !== undefined && (
              <span>
                <span
                  className={cn(
                    "font-medium",
                    isArray ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300",
                  )}
                >
                  {label}
                </span>
                <span className="mx-1 text-slate-400 dark:text-slate-500">:</span>
              </span>
            )}

            {isObject && !isEmpty ? (
              <span className={cn("px-1.5 py-0.5 text-xs rounded-md border font-mono", getNodeColor())}>
                {isArray ? `Array(${Object.keys(data).length})` : `Object(${Object.keys(data).length})`}
                {!isExpanded && "..."}
              </span>
            ) : (
              <span className="font-mono dark:text-slate-300">{renderValue()}</span>
            )}
          </div>
        </div>
      </div>

      {renderChildren()}
    </div>
  )
}

