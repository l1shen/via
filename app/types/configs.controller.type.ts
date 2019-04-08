import { Config, History } from '../entities'

export type DeploymentType = {
  config: Config,
  history: History,
}

export type Histories = {
  histories: Array<History>,
}

export type ConfigType = {
  config: Config,
}

export type Configs = {
  configs: Array<Config>,
}
