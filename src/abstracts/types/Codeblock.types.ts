export const ProgrammingLanguages = ['js', 'ts'] as const
export type ProgrammingLanguage = typeof ProgrammingLanguages[number]
export type CodeblockTags = { [key: string]: any }
