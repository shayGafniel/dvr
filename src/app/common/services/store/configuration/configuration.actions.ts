import { Action } from '@ngrx/store';

import { Conf } from '../../configuration/configuration.model';

export enum ConfigurationActionTypes {
  GetConfigurationData = '[API] [Configuration] Get Configuration',
  GetConfigurationDataSuccess = '[API] [Configuration] Get Configuration Success',
  GetConfigurationDataFail = '[API] [Configuration] Get Configuration Fail',
  LoadConfigurationData = '[Configuration] Load Configuration',
}

export class GetConfigurationData implements Action {
  public readonly type = ConfigurationActionTypes.GetConfigurationData;

  public constructor() { }
}

export class GetConfigurationDataSuccess implements Action {
  public readonly type = ConfigurationActionTypes.GetConfigurationDataSuccess;
}

export class GetConfigurationDataFail implements Action {
  public readonly type = ConfigurationActionTypes.GetConfigurationDataFail;

  public constructor(public payload: any) {}
}

export class LoadConfigurationData implements Action {
  public readonly type = ConfigurationActionTypes.LoadConfigurationData;

  public constructor(public payload: Conf) {}
}

export type ConfigurationActions =
  | GetConfigurationData
  | GetConfigurationDataSuccess
  | GetConfigurationDataFail
  | LoadConfigurationData;
