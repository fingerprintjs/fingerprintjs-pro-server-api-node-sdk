import openapiTS, { astToString } from 'openapi-typescript'
import * as fs from 'fs'
import * as yaml from 'yaml'

const schemaObject = yaml.parse(fs.readFileSync('resources/fingerprint-server-api.yaml', 'utf-8'))

// Function to resolve $ref paths
function getObjectByRef(refPath, schema) {
  if (!refPath.startsWith('#/')) {
    throw new Error('Only local $refs starting with "#/" are supported')
  }

  // Split the path into parts, e.g., "#/components/schemas/GeolocationCity" -> ["components", "schemas", "GeolocationCity"]
  const pathParts = refPath.slice(2).split('/')

  // Traverse the schema object based on path parts
  let current = schema
  for (const part of pathParts) {
    if (current[part] !== undefined) {
      current = current[part]
    } else {
      throw new Error(`Path not found: ${refPath}`)
    }
  }

  return current
}

try {
  const result = await openapiTS(schemaObject, {
    /**
     * Enhances generated documentation by propagating it from source object in schema to all properties that use it as $ref.
     * */
    transform: (schema) => {
      if (schema.type === 'object' && Boolean(schema.properties)) {
        Object.entries(schema.properties).forEach(([key, value]) => {
          if (value.$ref && !value.description) {
            const source = getObjectByRef(value.$ref, schemaObject)

            schema.properties[key] = {
              ...value,
              description: source?.description,
            }
          }
        })
      }
    },
  })

  fs.writeFileSync('./src/generatedApiTypes.ts', astToString(result))
} catch (e) {
  console.error(e)
  process.exit(1)
}
