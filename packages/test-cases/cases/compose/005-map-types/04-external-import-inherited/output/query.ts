import {
  createMethodDefinition,
  createModuleDefinition,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createInterfaceImplementedDefinition,
  createImportedObjectDefinition,
  createTypeInfo,
  TypeInfo,
  createMapPropertyDefinition,
  createMapKeyDefinition,
  createScalarDefinition,
  createArrayDefinition,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  ...createTypeInfo(),
  objectTypes: [
    {
      ...createObjectDefinition({
        type: "CustomType",
      }),
      interfaces: [
        createInterfaceImplementedDefinition({
          type: "Base_ImportedBaseType"
        })
      ],
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
  ],
  moduleTypes: [
    {
      ...createModuleDefinition({ type: "Query" }),
      imports: [
        { type: "Base_ImportedBaseType" },
        { type: "Derived_ImportedDerivedType" },
        { type: "Derived_ImportedBaseType" },
      ],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            type: "query",
            name: "method1",
            return: createObjectPropertyDefinition({
              name: "method1",
              type: "Derived_ImportedDerivedType",
            }),
          }),
          arguments: [
          ],
        },
        {
          ...createMethodDefinition({
            type: "query",
            name: "method2",
            return: createObjectPropertyDefinition({
              name: "method2",
              type: "CustomType",
            }),
          }),
          arguments: [
          ],
        },
      ],
    },
  ],
  importedObjectTypes: [
    {
      ...createImportedObjectDefinition({
        uri: "base.eth",
        namespace: "Base",
        nativeType: "ImportedBaseType",
        type: "Base_ImportedBaseType"
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
      ...createImportedObjectDefinition({
        uri: "derived.eth",
        namespace: "Derived",
        nativeType: "ImportedDerivedType",
        type: "Derived_ImportedDerivedType"
      }),
      interfaces: [
        createInterfaceImplementedDefinition({
          type: "Derived_ImportedBaseType"
        })
      ],
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
    {
      ...createImportedObjectDefinition({
        uri: "derived.eth",
        namespace: "Derived",
        nativeType: "ImportedBaseType",
        type: "Derived_ImportedBaseType"
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
  ],
};
