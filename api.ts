import { BaseAPI } from "./base";
import { fetcher } from "./utils";

export enum ErrorCode {
  "global/unknown",
  "global/invalid-api-key",
  "global/account-inactive",
  "global/invalid-parameters",
  "global/object-does-not-exist",
  "instance-operations/launch/insufficient-capacity",
  "instance-operations/launch/file-system-in-wrong-region",
  "instance-operations/launch/file-systems-not-supported",
  "ssh-keys/key-in-use",
}

export interface Error {
  code: ErrorCode;
  message: string;
  suggestion: string | null;
}

export interface ErrorResponse {
  error: Error;
  field_errors: {
    [key: string]: Error;
  };
}

export interface InstanceType {
  name: string;
  description: string;
  price_cents_per_hour: string;
  specs: {
    vcpus: number;
    memory_gib: number;
    storage_gib: number;
  };
}

export interface Region {
  name: string;
  description: string;
}

export interface ListInstanceTypes {
  [key: string]: {
    instance_type: InstanceType;
    regions_with_capacity_available: Region[];
  };
}

export interface RunningInstance {
  id: string;
  name: string;
  ip: string;
  status: string;
  ssh_key_names: string[];
  file_system_names: string[];
  region: Region;
  instance_type: InstanceType;
  hostname: string;
  jupyter_token: string;
  jupyter_url: string;
}

export interface GetRunningInstance {}

export interface ListRunningInstances {
  [key: string]: RunningInstance;
}

export interface SSHKey {
  id: string;
  name: string;
  public_key: string;
}

export interface ListSSHKeys {
  [key: string]: SSHKey;
}

export interface LaunchInstanceConfiguration {
  region_name: string;
  instance_type_name: string;
  ssh_key_name: [string];
  file_system_names?: string[];
  quantity?: number;
  name: string | null;
}

export interface AddSSHKeyConfiguration {
  name: string;
  public_key: string;
}

export interface User {
  id: string;
  email: string;
  status: string;
}

export interface FileSystem {
  id: string;
  name: string;
  created: string;
  created_by: User;
  mount_point: string;
  region: Region;
  is_in_use: Boolean;
}

export class LambdaCloudAPI extends BaseAPI {
  async listInstanceTypes(): Promise<ListInstanceTypes> {
    return fetcher<ListInstanceTypes>(
      this.configuration,
      "/instance-types",
      "GET"
    );
  }

  async listRunningInstances(): Promise<ListRunningInstances> {
    return fetcher<ListRunningInstances>(
      this.configuration,
      "/instances",
      "GET"
    );
  }

  async getRunningInstance(id: string): Promise<GetRunningInstance> {
    return fetcher<GetRunningInstance>(
      this.configuration,
      `/instances/${id}`,
      "GET"
    );
  }

  async launchInstance(config: LaunchInstanceConfiguration): Promise<string[]> {
    return fetcher<string[]>(
      this.configuration,
      "/instance-operations/launch",
      "POST",
      JSON.stringify(config)
    );
  }

  async terminateInstances(instanceIds: string[] | string): Promise<string[]> {
    return fetcher<string[]>(
      this.configuration,
      "/instance-operations/terminate",
      "POST",
      JSON.stringify({ instance_ids: instanceIds })
    );
  }

  async restartInstances(instanceIds: string[] | string): Promise<string[]> {
    return fetcher<string[]>(
      this.configuration,
      "/instance-operations/restart",
      "POST",
      JSON.stringify({ instance_ids: instanceIds })
    );
  }

  async listSSHKeys(): Promise<ListSSHKeys> {
    return fetcher<ListSSHKeys>(this.configuration, "/ssh-keys", "GET");
  }

  async addSSHKey(config: AddSSHKeyConfiguration): Promise<SSHKey> {
    return fetcher<SSHKey>(
      this.configuration,
      "/ssh-keys",
      "POST",
      JSON.stringify(config)
    );
  }

  async deleteSSHKey(id: string): Promise<void> {
    return fetcher<void>(this.configuration, `/ssh-keys/${id}`, "DELETE");
  }

  async listFileSystems(): Promise<FileSystem[]> {
    return fetcher<FileSystem[]>(this.configuration, "/file-systems", "GET");
  }
}
