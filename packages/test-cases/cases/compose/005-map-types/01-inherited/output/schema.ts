import {
  createArrayDefinition,
  createInterfaceImplementedDefinition,
  createMapKeyDefinition,
  createMapPropertyDefinition,
  createMethodDefinition,
  createModuleDefinition,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createScalarDefinition,
  createTypeInfo,
  TypeInfo,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  ...createTypeInfo(),
  objectTypes: [
    {
      ...createObjectDefinition({
        type: "BaseType",
      }),
      properties: [
        {
          ...createMapPropertyDefinition({
            name: "requiredMap",
            type: "Map<String, Int>",
            key: createMapKeyDefinition({
              name: "requiredMap",
              type: "String",
              required: true,
            }),
            value: createScalarDefinition({
              name: "requiredMap",
              type: "Int",
              required: true,
            }),
            required: true,
          }),
        },
      ],
    },
    {
      ...createObjectDefinition({
        type: "InheritedType",
        interfaces: [
          createInterfaceImplementedDefinition({
            type: "BaseType",
          }),
        ],
      }),
      properties: [
        {
          ...createMapPropertyDefinition({
            name: "mapOfValueArr",
            type: "Map<String, [Int]>",
            key: createMapKeyDefinition({
              name: "mapOfValueArr",
              type: "String",
              required: true,
            }),
            value: createArrayDefinition({
              name: "mapOfValueArr",
              type: "[Int]",
              item: createScalarDefinition({
                name: "mapOfValueArr",
                type: "Int",
                required: true,
              }),
              required: true,
            }),
            required: true,
          }),
        },
        {
          ...createMapPropertyDefinition({
            name: "requiredMap",
            type: "Map<String, Int>",
            key: createMapKeyDefinition({
              name: "requiredMap",
              type: "String",
              required: true,
            }),
            value: createScalarDefinition({
              name: "requiredMap",
              type: "Int",
              required: true,
            }),
            required: true,
          }),
        },
      ],
    },
  ],
  moduleTypes: [
    {
      ...createModuleDefinition({ type: "Query" }),
      imports: [],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            type: "query",
            name: "method",
            return: createMapPropertyDefinition({
              name: "method",
              type: "Map<String, Int>",
              key: createMapKeyDefinition({
                name: "method",
                type: "String",
                required: true,
              }),
              value: createScalarDefinition({
                name: "method",
                type: "Int",
                required: true,
              }),
              required: true,
            }),
            arguments: [
              {
                ...createMapPropertyDefinition({
                  name: "map",
                  type: "Map<String, Int>",
                  key: createMapKeyDefinition({
                    name: "map",
                    type: "String",
                    required: true,
                  }),
                  value: createScalarDefinition({
                    name: "map",
                    type: "Int",
                    required: true,
                  }),
                  required: true,
                }),
              },
              {
                ...createObjectPropertyDefinition({
                  name: "other",
                  type: "InheritedType",
                  required: true,            
                })
              }
            ],
          }),
        },
      ],
    },
    {
      ...createModuleDefinition({ type: "Mutation" }),
      imports: [],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            type: "mutation",
            name: "method",
            return: createMapPropertyDefinition({
              name: "method",
              type: "Map<String, Int>",
              key: createMapKeyDefinition({
                name: "method",
                type: "String",
                required: true,
              }),
              value: createScalarDefinition({
                name: "method",
                type: "Int",
                required: true,
              }),
              required: true,
            }),
            arguments: [
              {
                ...createMapPropertyDefinition({
                  name: "map",
                  type: "Map<String, Int>",
                  key: createMapKeyDefinition({
                    name: "map",
                    type: "String",
                    required: true,
                  }),
                  value: createScalarDefinition({
                    name: "map",
                    type: "Int",
                    required: true,
                  }),
                  required: true,
                }),
              },
              {
                ...createObjectPropertyDefinition({
                  name: "other",
                  type: "InheritedType",
                  required: true,            
                })
              }
            ],
          }),
        },
      ],
    },
  ],
};
