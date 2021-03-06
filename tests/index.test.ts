import { validate, assertValid, defineSchema, Pure, ValidationError, combineSchema } from '../src/index'

it('validate', () => {
  const schema = defineSchema().string('name')

  expect(validate({ name: 'test' }, schema)).toBe(true)
  expect(validate({ name: 1 }, schema)).toBe(false)
})

it('assertValid', () => {
  const schema = defineSchema().string('name')

  expect(() => assertValid({ name: 'test' }, schema)).not.toThrow()
  expect(() => assertValid({ name: 1 }, schema)).toThrow(/string/)
  expect(() => assertValid({ name: 1 }, schema)).toThrow(ValidationError)
})

describe('defineSchema', () => {
  it('toJSONSchema', () => {
    const schema = defineSchema()
      .string('stringRequired')
      .string('stringOptional', {
        optional: true
      })
      .string('stringRequiredNullable', { nullable: true })
      .string('stringOptionalNullable', {
        optional: true,
        nullable: true
      })
      .number('numberRequired')
      .number('numberOptional', {
        optional: true
      })
      .number('numberRequiredNullable', { nullable: true })
      .number('numberOptionalNullable', {
        optional: true,
        nullable: true
      })
      .integer('integerRequired')
      .integer('integerOptional', {
        optional: true
      })
      .integer('integerRequiredNullable', {
        nullable: true
      })
      .integer('integerOptionalNullable', {
        optional: true,
        nullable: true
      })
      .boolean('booleanRequired')
      .boolean('booleanOptional', {
        optional: true
      })
      .boolean('booleanRequiredNullable', {
        nullable: true
      })
      .boolean('booleanOptionalNullable', {
        optional: true,
        nullable: true
      })
      .null('nullRequired')
      .null('nullOptional', {
        optional: true
      })
      .enum('enumStringRequired', 'string', ['a', 'b', 'c'])
      .enum('enumStringOptional', 'string', ['a', 'b', 'c'], { optional: true })
      .enum('enumStringRequiredNullable', 'string', ['a', 'b', 'c'], {
        nullable: true
      })
      .enum('enumStringOptionalNullable', 'string', ['a', 'b', 'c'], {
        optional: true,
        nullable: true
      })
      .enum('enumNumberRequired', 'number', [1, 2, 3])
      .enum('enumNumberOptional', 'number', [1, 2, 3], {
        optional: true
      })
      .enum('enumNumberRequiredNullable', 'number', [1, 2, 3], {
        nullable: true
      })
      .enum('enumNumberOptionalNullable', 'number', [1, 2, 3], {
        optional: true,
        nullable: true
      })
      .enum('enumIntegerRequired', 'number', [1, 2, 3])
      .enum('enumIntegerOptional', 'number', [1, 2, 3], {
        optional: true
      })
      .enum('enumIntegerRequiredNullable', 'number', [1, 2, 3], {
        nullable: true
      })
      .enum('enumIntegerOptionalNullable', 'number', [1, 2, 3], {
        optional: true,
        nullable: true
      })
      .array('arrayStringRequired', 'string')
      .array('arrayStringOptional', 'string', {}, { optional: true })
      .array('arrayStringRequiredNullable', 'string', {}, { nullable: true })
      .array(
        'arrayStringOptionalNullable',
        'string',
        {},
        {
          optional: true,
          nullable: true
        }
      )
      .array('arrayNumberRequired', 'number')
      .array('arrayNumberOptional', 'number', {}, { optional: true })
      .array('arrayNumberRequiredNullable', 'number', {}, { nullable: true })
      .array(
        'arrayNumberOptionalNullable',
        'number',
        {},
        {
          optional: true,
          nullable: true
        }
      )
      .array('arrayIntegerRequired', 'integer')
      .array('arrayIntegerOptional', 'integer', {}, { optional: true })
      .array('arrayIntegerRequiredNullable', 'integer', {}, { nullable: true })
      .array(
        'arrayIntegerOptionalNullable',
        'integer',
        {},
        {
          optional: true,
          nullable: true
        }
      )
      .array('arrayBooleanRequired', 'boolean')
      .array('arrayBooleanOptional', 'boolean', {}, { optional: true })
      .array('arrayBooleanRequiredNullable', 'boolean', {}, { nullable: true })
      .array(
        'arrayBooleanOptionalNullable',
        'boolean',
        {},
        {
          optional: true,
          nullable: true
        }
      )
      .array('arrayNullRequired', 'null')
      .array('arrayNullOptional', 'null', {}, { optional: true })
      .array('arrayNullRequiredNullable', 'null', {}, { nullable: true })
      .array(
        'arrayNullOptionalNullable',
        'null',
        {},
        {
          optional: true,
          nullable: true
        }
      )
      .array('arrayObjectRequired', 'object', defineSchema().string('a'))
      .array('arrayObjectOptional', 'object', defineSchema().string('a'), {
        optional: true
      })
      .array(
        'arrayObjectRequiredNullable',
        'object',
        defineSchema().string('a'),
        { nullable: true }
      )
      .array(
        'arrayObjectOptionalNullable',
        'object',
        defineSchema().string('a'),
        {
          optional: true,
          nullable: true
        }
      )
      .object('objectRequired', defineSchema().string('a'))
      .object('objectOptional', defineSchema().string('a'), { optional: true })
      .object('objectRequiredNullable', defineSchema().string('a'), {
        nullable: true
      })
      .object('objectOptionalNullable', defineSchema().string('a'), {
        optional: true,
        nullable: true
      })

    expect(schema.toJSONSchema()).toStrictEqual({
      type: 'object',
      properties: {
        stringRequired: {
          type: 'string'
        },
        stringOptional: {
          type: 'string'
        },
        stringRequiredNullable: {
          oneOf: [
            { type: 'string' },
            { type: 'null' }
          ]
        },
        stringOptionalNullable: {
          oneOf: [
            { type: 'string' },
            { type: 'null' }
          ]
        },
        numberRequired: {
          type: 'number'
        },
        numberOptional: {
          type: 'number'
        },
        numberRequiredNullable: {
          oneOf: [
            { type: 'number' },
            { type: 'null' }
          ]
        },
        numberOptionalNullable: {
          oneOf: [
            { type: 'number' },
            { type: 'null' }
          ]
        },
        integerRequired: {
          type: 'integer'
        },
        integerOptional: {
          type: 'integer'
        },
        integerRequiredNullable: {
          oneOf: [
            { type: 'integer' },
            { type: 'null' }
          ]
        },
        integerOptionalNullable: {
          oneOf: [
            { type: 'integer' },
            { type: 'null' }
          ]
        },
        booleanRequired: {
          type: 'boolean'
        },
        booleanOptional: {
          type: 'boolean'
        },
        booleanRequiredNullable: {
          oneOf: [
            { type: 'boolean' },
            { type: 'null' }
          ]
        },
        booleanOptionalNullable: {
          oneOf: [
            { type: 'boolean' },
            { type: 'null' }
          ]
        },
        nullRequired: {
          type: 'null'
        },
        nullOptional: {
          type: 'null'
        },
        enumStringRequired: {
          type: 'string',
          enum: ['a', 'b', 'c']
        },
        enumStringOptional: {
          type: 'string',
          enum: ['a', 'b', 'c']
        },
        enumStringRequiredNullable: {
          oneOf: [
            {
              type: 'string',
              enum: ['a', 'b', 'c']
            },
            { type: 'null' }
          ]
        },
        enumStringOptionalNullable: {
          oneOf: [
            {
              type: 'string',
              enum: ['a', 'b', 'c']
            },
            { type: 'null' }
          ]
        },
        enumNumberRequired: {
          type: 'number',
          enum: [1, 2, 3]
        },
        enumNumberOptional: {
          type: 'number',
          enum: [1, 2, 3]
        },
        enumNumberRequiredNullable: {
          oneOf: [
            {
              type: 'number',
              enum: [1, 2, 3]
            },
            { type: 'null' }
          ]
        },
        enumNumberOptionalNullable: {
          oneOf: [
            {
              type: 'number',
              enum: [1, 2, 3]
            },
            { type: 'null' }
          ]
        },
        enumIntegerRequired: {
          type: 'number',
          enum: [1, 2, 3]
        },
        enumIntegerOptional: {
          type: 'number',
          enum: [1, 2, 3]
        },
        enumIntegerRequiredNullable: {
          oneOf: [
            {
              type: 'number',
              enum: [1, 2, 3]
            },
            { type: 'null' }
          ]
        },
        enumIntegerOptionalNullable: {
          oneOf: [
            {
              type: 'number',
              enum: [1, 2, 3]
            },
            { type: 'null' }
          ]
        },
        arrayStringRequired: {
          type: 'array',
          items: { type: 'string' }
        },
        arrayStringOptional: {
          type: 'array',
          items: { type: 'string' }
        },
        arrayStringRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'string' }
            },
            { type: 'null' }
          ]
        },
        arrayStringOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'string' }
            },
            { type: 'null' }
          ]
        },
        arrayNumberRequired: {
          type: 'array',
          items: { type: 'number' }
        },
        arrayNumberOptional: {
          type: 'array',
          items: { type: 'number' }
        },
        arrayNumberRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'number' }
            },
            { type: 'null' }
          ]
        },
        arrayNumberOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'number' }
            },
            { type: 'null' }
          ]
        },
        arrayIntegerRequired: {
          type: 'array',
          items: { type: 'integer' }
        },
        arrayIntegerOptional: {
          type: 'array',
          items: { type: 'integer' }
        },
        arrayIntegerRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'integer' }
            },
            { type: 'null' }
          ]
        },
        arrayIntegerOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'integer' }
            },
            { type: 'null' }
          ]
        },
        arrayBooleanRequired: {
          type: 'array',
          items: { type: 'boolean' }
        },
        arrayBooleanOptional: {
          type: 'array',
          items: { type: 'boolean' }
        },
        arrayBooleanRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'boolean' }
            },
            { type: 'null' }
          ]
        },
        arrayBooleanOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'boolean' }
            },
            { type: 'null' }
          ]
        },
        arrayNullRequired: {
          type: 'array',
          items: { type: 'null' }
        },
        arrayNullOptional: {
          type: 'array',
          items: { type: 'null' }
        },
        arrayNullRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'null' }
            },
            { type: 'null' }
          ]
        },
        arrayNullOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'null' }
            },
            { type: 'null' }
          ]
        },
        arrayObjectRequired: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              a: { type: 'string' }
            },
            required: ['a']
          }
        },
        arrayObjectOptional: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              a: { type: 'string' }
            },
            required: ['a']
          }
        },
        arrayObjectRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  a: { type: 'string' }
                },
                required: ['a']
              }
            },
            { type: 'null' }
          ]
        },
        arrayObjectOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  a: { type: 'string' }
                },
                required: ['a']
              }
            },
            { type: 'null' }
          ]
        },
        objectRequired: {
          type: 'object',
          properties: {
            a: { type: 'string' }
          },
          required: ['a']
        },
        objectOptional: {
          type: 'object',
          properties: {
            a: { type: 'string' }
          },
          required: ['a']
        },
        objectRequiredNullable: {
          type: 'object',
          properties: {
            a: { type: 'string' }
          },
          required: ['a']
        },
        objectOptionalNullable: {
          type: 'object',
          properties: {
            a: { type: 'string' }
          },
          required: ['a']
        }
      },
      required: [
        'stringRequired',
        'stringRequiredNullable',
        'numberRequired',
        'numberRequiredNullable',
        'integerRequired',
        'integerRequiredNullable',
        'booleanRequired',
        'booleanRequiredNullable',
        'nullRequired',
        'enumStringRequired',
        'enumStringRequiredNullable',
        'enumNumberRequired',
        'enumNumberRequiredNullable',
        'enumIntegerRequired',
        'enumIntegerRequiredNullable',
        'arrayStringRequired',
        'arrayStringRequiredNullable',
        'arrayNumberRequired',
        'arrayNumberRequiredNullable',
        'arrayIntegerRequired',
        'arrayIntegerRequiredNullable',
        'arrayBooleanRequired',
        'arrayBooleanRequiredNullable',
        'arrayNullRequired',
        'arrayNullRequiredNullable',
        'arrayObjectRequired',
        'arrayObjectRequiredNullable',
        'objectRequired',
        'objectRequiredNullable'
      ]
    })

    type SchemaType = Pure<typeof schema>
    const testSchema: SchemaType = {
      stringRequired: 'a',
      stringRequiredNullable: null,
      numberRequired: 1,
      numberRequiredNullable: null,
      integerRequired: 1,
      integerRequiredNullable: null,
      booleanRequired: true,
      booleanRequiredNullable: null,
      nullRequired: null,
      enumStringRequired: 'a',
      enumStringRequiredNullable: null,
      enumNumberRequired: 1,
      enumNumberRequiredNullable: null,
      enumIntegerRequired: 1,
      enumIntegerRequiredNullable: null,
      arrayStringRequired: ['a'],
      arrayStringRequiredNullable: null,
      arrayNumberRequired: [1],
      arrayNumberRequiredNullable: null,
      arrayIntegerRequired: [1],
      arrayIntegerRequiredNullable: null,
      arrayBooleanRequired: [true],
      arrayBooleanRequiredNullable: null,
      arrayNullRequired: [null],
      arrayNullRequiredNullable: null,
      arrayObjectRequired: [{ a: 'a' }],
      arrayObjectRequiredNullable: null,
      objectRequired: { a: 'a' },
      objectRequiredNullable: null
    }

    // only type tesing
    expect(testSchema).toStrictEqual(testSchema)
  })

  it('omit', () => {
    const schema = defineSchema()
      .string('name')
      .string('phoneNumber')

    const omittedSchema = schema.omit('phoneNumber')

    expect(omittedSchema.toJSONSchema()).toStrictEqual({
      type: 'object',
      properties: {
        name: {
          type: 'string'
        }
      },
      required: ['name']
    })
  })

  it('omit multiple', () => {
    const schema = defineSchema()
      .string('name')
      .string('phoneNumber')
      .string('age')

    const omittedSchema = schema.omit('phoneNumber', 'age')

    expect(omittedSchema.toJSONSchema()).toStrictEqual({
      type: 'object',
      properties: {
        name: {
          type: 'string'
        }
      },
      required: ['name']
    })
  })

  it('pick', () => {
    const schema = defineSchema()
      .string('name')
      .string('phoneNumber')

    const pickedSchema = schema.pick('phoneNumber')

    expect(pickedSchema.toJSONSchema()).toStrictEqual({
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string'
        }
      },
      required: ['phoneNumber']
    })
  })

  it('pick multiple', () => {
    const schema = defineSchema()
      .string('name')
      .string('phoneNumber')
      .number('age')

    const pickedSchema = schema.pick('name', 'phoneNumber')

    expect(pickedSchema.toJSONSchema()).toStrictEqual({
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        phoneNumber: {
          type: 'string'
        }
      },
      required: ['name', 'phoneNumber']
    })
  })

  it('oneOf', () => {
    const schema = combineSchema.oneOf([
      defineSchema().const('type', 'email').string('email', {
        format: 'email'
      }),
      defineSchema().const('type', 'webhook').string('endpoint', {
        format: 'uri'
      })
    ] as const)

    const values: Pure<typeof schema>[] = [{
      type: 'email',
      email: 'test@example.com'
    }, {
      type: 'webhook',
      endpoint: 'https://example.com/test'
    }]

    // only type tesing
    expect(values).toStrictEqual(values)

    expect(schema.toJSONSchema()).toStrictEqual({
      oneOf: [
        {
          type: 'object',
          properties: {
            type: {
              const: 'email'
            },
            email: {
              type: 'string',
              format: 'email'
            }
          },
          required: [
            'type',
            'email'
          ]
        },
        {
          type: 'object',
          properties: {
            type: {
              const: 'webhook'
            },
            endpoint: {
              type: 'string',
              format: 'uri'
            }
          },
          required: [
            'type',
            'endpoint'
          ]
        }
      ]
    })

    expect(() => assertValid({}, schema)).toThrow(/is not exactly one/)
    expect(() => assertValid({
      type: 'email',
      email: 'invalid-format-email'
    }, schema)).toThrow(/is not exactly one/)
    expect(() => assertValid({
      type: 'email',
      email: 'valid-format-email@example.com'
    }, schema)).not.toThrow()
  })
})
