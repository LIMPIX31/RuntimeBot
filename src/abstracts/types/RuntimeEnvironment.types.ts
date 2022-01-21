export type RunStatus = 'success' | 'warn' | 'error' | 'idle' | 'inProgress'

export enum GlobalStages {
  SETTING_UP_ENVIRONMENT = 'SETTING_UP_ENVIRONMENT',
  INSTALLING_DEPENDENCIES = 'INSTALLING_DEPENDENCIES',
  VALIDATING = 'VALIDATING',
  COMPILING = 'COMPILING',
  IDLING_RUN = 'IDLING_RUN',
  CLEARING = 'CLEARING',
  CLOSED = 'CLOSED',
  RUNNING = 'RUNNING'
}