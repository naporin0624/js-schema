/* eslint-disable no-redeclare */
import { Combine, Field, FieldBuilder, SchemaDefinition, SchemaIdentity, ObjectSchema } from './interfaces'
import { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import * as JSONSchema from 'jsonschema'
export { ValidationError } from 'jsonschema'

interface GenericOptions {
  optional?: boolean;
  nullable?: boolean;
}

export type DirtyProps<T> = { [P in keyof T]?: unknown }
export type Pure<T> = T extends SchemaIdentity<infer X> ? X : never
export type Dirty<T extends SchemaIdentity<any>> = DirtyProps<Pure<T>>

function createContext <C> (properties: JSONSchema7['properties'] = {}, required: string[] = []): SchemaDefinition<C> {
  const schema: JSONSchema7 = {
    type: 'object',
    properties,
    required
  }

  function orNull (schema: JSONSchema7Definition, nullable: boolean): JSONSchema7Definition {
    if (!nullable) {
      return schema
    }
    return {
      oneOf: [schema, {
        type: 'null'
      }]
    }
  }

  function extractOptional <T extends GenericOptions> (options: T): Exclude<T, 'optional' | 'nullable'> {
    const opts = { ...options }
    if ('optional' in opts) {
      delete opts.optional
    }
    if ('nullable' in opts) {
      delete opts.nullable
    }
    return opts as any
  }

  function _string (name: string, options?: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: orNull({
        type: 'string',
        ...extractOptional(options || {})
      }, options?.nullable ?? false)
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _number (name: string, options?: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: orNull({
        type: 'number',
        ...extractOptional(options || {})
      }, options?.nullable ?? false)
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _integer (name: string, options?: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: orNull({
        type: 'integer',
        ...extractOptional(options || {})
      }, options?.nullable ?? false)
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _boolean (name: string, options: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: orNull({
        type: 'boolean',
        ...extractOptional(options || {})
      }, options?.nullable ?? false)
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _null (name: string, options: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: {
        type: 'null',
        ...extractOptional(options || {})
      }
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _const (name: string, value: any, options?: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: orNull({
        const: value,
        ...extractOptional(options || {})
      }, options?.nullable ?? false)
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _enum (name: string, type: string, values: any[], options: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: orNull({
        type,
        enum: values,
        ...extractOptional(options || {})
      } as JSONSchema7Definition, options?.nullable ?? false)
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _array (name: string, type: string, options: any = {}, arrayOptions: GenericOptions = {}): any {
    return createContext({
      ...properties,
      [name]: orNull({
        type: 'array',
        items: {
          type,
          ...(options.toJSONSchema ? options.toJSONSchema() : options)
        },
        ...extractOptional(arrayOptions)
      }, arrayOptions?.nullable ?? false)
    }, [...required, ...(arrayOptions?.optional ? [] : [name])])
  }

  function _object (name: string, options: any, objectOptions: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: orNull({
        type: 'object',
        ...(options.toJSONSchema ? options.toJSONSchema() : options),
        ...extractOptional(objectOptions)
      }, options?.nullable ?? false)
    }, [...required, ...(objectOptions?.optional ? [] : [name])])
  }

  function _omit (...names: string[]): any {
    const p = { ...properties }
    for (const name of names) {
      delete p[name]
    }
    return createContext(p, required.filter((r) => !names.includes(r)))
  }

  function _pick (...names: string[]): any {
    return createContext(names.reduce((current, n) => ({
      ...current,
      [n]: properties[n]
    }), {}), required.filter((r) => names.includes(r)))
  }

  function _extend (context: SchemaDefinition<any>): any {
    const schema = context.toJSONSchema()
    return createContext({
      ...properties,
      ...schema.properties
    }, [...(schema.required || []), ...required])
  }

  const definition = {
    identical: () => definition,
    string: _string as any,
    number: _number as any,
    integer: _integer as any,
    boolean: _boolean as any,
    null: _null as any,
    const: _const as any,
    enum: _enum as any,
    array: _array as any,
    object: _object as any,
    omit: _omit as any,
    pick: _pick as any,
    extend: _extend as any,
    toJSONSchema (): JSONSchema7 {
      return { ...schema }
    }
  }

  return definition
}

export function defineSchema (): SchemaDefinition<unknown> {
  return createContext()
}

function _oneOf (schemaList: SchemaDefinition<unknown>[]): any {
  return {
    toJSONSchema (): JSONSchema7 {
      return {
        oneOf: schemaList.map((schema) => schema.toJSONSchema())
      }
    }
  }
}

export const combineSchema: Combine = {
  oneOf: _oneOf as any
}

export function validate <T> (input: DirtyProps<T>, schema: SchemaIdentity<T>, options?: JSONSchema.Options): input is T {
  const result = JSONSchema.validate(input, schema.toJSONSchema(), {
    ...options,
    throwError: false
  })
  return result.valid
}

export function assertValid <T> (input: DirtyProps<T>, schema: SchemaIdentity<T>, options?: JSONSchema.Options): asserts input is T {
  JSONSchema.validate(input, schema.toJSONSchema(), {
    ...options,
    throwError: true
  })
}

export const field: FieldBuilder = new Proxy({} as FieldBuilder, {
  get (_, key) {
    return (...args: any[]) => {
      const type = (key === 'array') ? `${args[0]}[]` : key.toString()
      return {
        type,
        args,
        nullable: () => {
          return (field as any)[type.replace(/@*$/, '@')](...args)
        },
        nonnullable: () => {
          return (field as any)[type.replace(/@+$/, '')](...args)
        }
      }
    }
  }
})

export function defineObjectSchema <
  T extends Record<string, Field<any>>,
  U extends Record<string, Field<any>>
> (fields: T, optionalFields?: U): SchemaDefinition<ObjectSchema<T, U>> {
  const mergedFields: Record<string, Field<unknown>> = {}

  for (const [key, field] of Object.entries(fields)) {
    mergedFields[key] = field
  }

  for (const [key, field] of Object.entries(optionalFields ?? {})) {
    mergedFields[key] = {
      ...field,
      options: {
        ...(field.options ?? {}),
        optional: true
      }
    }
  }

  return Object.keys(mergedFields).reduce((b, key) => {
    const { type, args, options } = (mergedFields as any)[key] as { type: string; args: any[]; options?: any }
    const nullable = type.endsWith('@')
    const optional = Boolean(options?.optional)
    const rawType = type.replace(/@+$/, '')
    const method = rawType.endsWith('[]') ? 'array' : rawType
    const fn = (b as any)[method] as (...args: any[]) => any
    const overrideOption = (args: any[], index: number, nullable: boolean, optional: boolean) => {
      args[index] = {
        ...(args[index] ?? {}),
        nullable,
        optional
      }
      return args
    }

    if (rawType === 'object') {
      args[0] = defineObjectSchema(args[0])
    }

    if (rawType === 'object[]') {
      args[1] = defineObjectSchema(args[1])
    }

    const maps = {
      0: ['string', 'number', 'integer', 'boolean', 'null'],
      1: ['const', 'object'],
      2: ['enum', 'string[]', 'number[]', 'integer[]', 'boolean[]', 'null[]', 'object[]']
    }

    for (const [index, keys] of Object.entries(maps)) {
      if (keys.includes(rawType)) {
        const i = parseInt(index)
        return fn(key, ...overrideOption(args, i, nullable, optional))
      }
    }
    throw new Error(`unsupported type: ${rawType}`)
  }, defineSchema()) as any
}
