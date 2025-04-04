"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Copy, Check } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { EnhancedJsonTree } from "@/components/enhanced-json-tree"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateTypeScript } from "@/lib/generate-typescript"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"

export default function Home() {
  const [jsonInput, setJsonInput] = useState("")
  const [parsedJson, setParsedJson] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<{ path: string; value: any } | null>(null)
  const [typeScript, setTypeScript] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleVisualize = () => {
    try {
      if (!jsonInput.trim()) {
        setError("Please enter JSON data")
        setParsedJson(null)
        return
      }

      const parsed = JSON.parse(jsonInput)
      setParsedJson(parsed)
      setError(null)
      setSelectedNode(null)

      // Generate TypeScript interfaces
      const generatedTS = generateTypeScript(parsed)
      setTypeScript(generatedTS)
    } catch (err) {
      setError("Invalid JSON format. Please check your input.")
      setParsedJson(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sampleJson = `{
  "company": {
    "name": "Acme Inc.",
    "founded": 1985,
    "active": true,
    "departments": [
      {
        "name": "Engineering",
        "employees": 50,
        "roles": ["Developer", "QA", "DevOps"]
      },
      {
        "name": "Marketing",
        "employees": 20,
        "roles": ["Content", "Social Media", "SEO"]
      }
    ],
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "zipcode": "12345"
    }
  }
}`

  return (
    <main className="container mx-auto py-8 px-4 max-w-7xl">
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-900 dark:to-slate-800 text-white rounded-t-lg flex flex-row items-center justify-between">
          <CardTitle className="text-3xl font-bold">JSON Tree Visualizer</CardTitle>
          <div className="flex items-center gap-2">
            {mounted && (
              <div className="text-sm mr-2">
                Current theme: {theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light"}
              </div>
            )}
            <ThemeToggle />
          </div>
        </CardHeader>
        <CardContent className="p-6 dark:bg-slate-950">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - JSON Input */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold dark:text-white">Input your JSON</h2>
                  <Button variant="outline" size="sm" onClick={() => setJsonInput(sampleJson)}>
                    Load Sample
                  </Button>
                </div>
                <Textarea
                  placeholder='{"example": {"nested": {"data": "value"}}}'
                  className="min-h-[400px] font-mono text-sm bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
              </div>

              <Button
                onClick={handleVisualize}
                className="w-full bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                Visualize JSON
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Right Column - Tree Visualization */}
            {parsedJson && (
              <Card className="border border-slate-200 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <CardHeader className="bg-slate-100 py-3 px-4 border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                  <CardTitle className="text-lg font-medium dark:text-white">JSON Tree Visualization</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-4 overflow-auto max-h-[400px]">
                    <EnhancedJsonTree
                      data={parsedJson}
                      onNodeSelect={(path, value) => setSelectedNode({ path, value })}
                    />
                  </div>

                  {selectedNode && (
                    <div className="border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                      <h3 className="font-medium text-slate-800 mb-2 dark:text-white">Selected Node Details</h3>
                      <div className="bg-white p-3 rounded-md border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-700">
                        <p className="text-sm mb-1 dark:text-slate-300">
                          <span className="font-medium text-slate-700 dark:text-slate-200">Path:</span>{" "}
                          <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded dark:bg-slate-800">
                            {selectedNode.path}
                          </span>
                        </p>
                        <p className="text-sm mb-1 dark:text-slate-300">
                          <span className="font-medium text-slate-700 dark:text-slate-200">Type:</span>{" "}
                          <span className="text-blue-600 dark:text-blue-400">
                            {Array.isArray(selectedNode.value) ? "array" : typeof selectedNode.value}
                          </span>
                        </p>
                        {typeof selectedNode.value !== "object" || selectedNode.value === null ? (
                          <p className="text-sm dark:text-slate-300">
                            <span className="font-medium text-slate-700 dark:text-slate-200">Value:</span>{" "}
                            <span className="font-mono">{JSON.stringify(selectedNode.value)}</span>
                          </p>
                        ) : (
                          <>
                            <p className="text-sm mb-1 dark:text-slate-300">
                              <span className="font-medium text-slate-700 dark:text-slate-200">Content:</span>{" "}
                              {Array.isArray(selectedNode.value)
                                ? `Array with ${selectedNode.value.length} items`
                                : `Object with ${Object.keys(selectedNode.value).length} properties`}
                            </p>
                            <pre className="bg-slate-50 p-2 rounded-md overflow-auto max-h-[200px] text-xs font-mono border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                              {JSON.stringify(selectedNode.value, null, 2)}
                            </pre>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* TypeScript Interface Section */}
          {parsedJson && (
            <div className="mt-6">
              <Card className="border border-slate-200 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <CardHeader className="bg-slate-100 py-3 px-4 border-b border-slate-200 flex flex-row items-center justify-between dark:bg-slate-800 dark:border-slate-700">
                  <CardTitle className="text-lg font-medium dark:text-white">TypeScript Interface</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(typeScript)} className="h-8">
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-b-lg overflow-auto max-h-[400px] font-mono text-sm dark:bg-[#1a1a1a]">
                    <pre className="typescript-code">{typeScript}</pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

