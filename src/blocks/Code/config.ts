import type { Block } from 'payload'

export const Code: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      type: 'select',
      admin: {
        description:
          '這個區塊是給開發人員放程式碼或嵌入碼用的，一般內容編輯不需要用到。這裡選擇程式碼的語言，決定顏色標示的方式。',
      },
      defaultValue: 'typescript',
      options: [
        {
          label: 'Typescript',
          value: 'typescript',
        },
        {
          label: 'Javascript',
          value: 'javascript',
        },
        {
          label: 'CSS',
          value: 'css',
        },
      ],
    },
    {
      name: 'code',
      type: 'code',
      admin: {
        description:
          '貼上程式碼或嵌入用的代碼。這是技術性欄位，多數客戶不會用到，如果不確定可以略過這個區塊。',
      },
      label: false,
      required: true,
    },
  ],
}
