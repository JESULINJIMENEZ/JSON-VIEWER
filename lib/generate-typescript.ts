/**
 * Generates TypeScript interfaces from a JSON object
 */
export function generateTypeScript(json: any, rootName = "Root"): string {
  const interfaces: Map<string, string> = new Map()
  const typeCache: Map<string, string> = new Map()

  function getTypeName(name: string): string {
    // Capitalize first letter and make singular if it ends with 's'
    let typeName = name.charAt(0).toUpperCase() + name.slice(1)
    if (typeName.endsWith("s") && typeName.length > 1) {
      typeName = typeName.slice(0, -1)
    }
    return typeName + "Type"
  }

  function getTypeFromValue(value: any, path = ""): string {
    if (value === null) return "null"
    if (value === undefined) return "undefined"

    const type = typeof value

    if (type === "string") return "string"
    if (type === "number") return "number"
    if (type === "boolean") return "boolean"

    if (Array.isArray(value)) {
      if (value.length === 0) return "any[]"

      // For arrays, we'll check the first item to determine the type
      // This assumes all items in the array have the same structure
      const firstItem = value[0]
      const itemType = getTypeFromValue(firstItem, `${path}Item`)

      return `${itemType}[]`
    }

    if (type === "object") {
      const typeName = getTypeName(path.split(".").pop() || rootName)
      const objHash = hashObject(value)

      // Check if we've already processed an object with this structure
      if (typeCache.has(objHash)) {
        return typeCache.get(objHash)!
      }

      // Store this type in the cache
      typeCache.set(objHash, typeName)

      // Generate the interface
      interfaces.set(typeName, generateInterface(value, typeName, path))

      return typeName
    }

    return "any"
  }

  function generateInterface(obj: any, interfaceName: string, parentPath = ""): string {
    let result = `interface ${interfaceName} {\n`

    for (const [key, value] of Object.entries(obj)) {
      const path = parentPath ? `${parentPath}.${key}` : key
      const type = getTypeFromValue(value, path)
      result += `  ${key}: ${type};\n`
    }

    result += "}"
    return result
  }

  // Helper function to create a hash of an object's structure
  function hashObject(obj: any): string {
    if (obj === null || obj === undefined) return String(obj)
    if (typeof obj !== "object") return typeof obj

    if (Array.isArray(obj)) {
      if (obj.length === 0) return "empty-array"
      // For arrays, we only hash the first item's structure
      return `array-of-${hashObject(obj[0])}`
    }

    // For objects, create a sorted string of property names and their types
    const props = Object.keys(obj)
      .sort()
      .map((key) => {
        const val = obj[key]
        const type = typeof val
        if (type === "object" && val !== null) {
          return `${key}:${hashObject(val)}`
        }
        return `${key}:${type}`
      })

    return `{${props.join(",")}}`
  }

  // Start with the root object
  const rootType = getTypeFromValue(json, rootName)

  // If the root is an object, it will be in the interfaces Map
  // Otherwise, we need to create a simple type alias
  if (typeof json === "object" && json !== null && !Array.isArray(json)) {
    // The root interface is already in the interfaces Map
  } else {
    interfaces.set(`${rootName}Type`, `type ${rootName}Type = ${rootType};`)
  }

  // Convert the Map to an array and return as a string
  return Array.from(interfaces.values()).join("\n\n")
}

