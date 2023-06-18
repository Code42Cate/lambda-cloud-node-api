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

export interface Instance {
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

export interface SSHKey {
  id: string;
  name: string;
  public_key: string;
}

export interface SSHKeyWithPrivateKey extends SSHKey {
  private_key: string;
}

export interface LaunchInstanceConfiguration {
  region_name: string;
  instance_type_name: string;
  ssh_key_names: [string];
  file_system_names?: string[];
  quantity?: number;
  name: string | null;
}

export interface LaunchInstance {
  instance_ids: string[];
}

export interface AddSSHKeyConfiguration {
  name: string;
  public_key?: string;
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

export interface RestartedInstances {
  restarted_instances: Instance[];
}

export interface TerminatedInstances {
  terminated_instances: Instance[];
}

export class LambdaCloudAPI extends BaseAPI {
  /**
   * List instance types
   * @returns list of instance types, or an empty array if there are none
   * @throws {ErrorResponse} if missing permissions
   */
  async listInstanceTypes(): Promise<ListInstanceTypes> {
    return fetcher<ListInstanceTypes>(
      this.configuration,
      "/instance-types",
      "GET"
    );
  }

  /**
   * List running instances
   * @returns list of running instances, or an empty array if there are none
   */
  async listRunningInstances(): Promise<Instance[]> {
    return fetcher<Instance[]>(this.configuration, "/instances", "GET");
  }

  /**
   * Get a running instance by ID
   * @param id the ID of the instance to get
   * @returns the instance, or null if it does not exist
   * @throws {ErrorResponse} if the instance does not exist
   */
  async getRunningInstance(id: string): Promise<Instance> {
    return fetcher<Instance>(this.configuration, `/instances/${id}`, "GET");
  }

  /**
   * Launch instances
   * @param config instance configuration
   * @returns object with list of launched instances
   * @throws {ErrorResponse} if invalid parameters or missing permissions
   * @throws {ErrorResponse} if there is insufficient capacity in the region
   */
  async launchInstance(
    config: LaunchInstanceConfiguration
  ): Promise<LaunchInstance> {
    return fetcher<LaunchInstance>(
      this.configuration,
      "/instance-operations/launch",
      "POST",
      JSON.stringify(config)
    );
  }

  /**
   * Terminate instances
   * @param instanceIds list of instance IDs to terminate
   * @returns object with list of terminated instances
   */
  async terminateInstances(
    instanceIds: string[] | string
  ): Promise<TerminatedInstances> {
    return fetcher<TerminatedInstances>(
      this.configuration,
      "/instance-operations/terminate",
      "POST",
      JSON.stringify({ instance_ids: instanceIds })
    );
  }

  /**
   * Restart instances
   * @param instanceIds list of instance IDs to restart
   * @returns object with list of restarted instances
   * @throws {ErrorResponse} if invalid parameters or missing permissions
   */
  async restartInstances(instanceIds: string[]): Promise<RestartedInstances> {
    return fetcher<RestartedInstances>(
      this.configuration,
      "/instance-operations/restart",
      "POST",
      JSON.stringify({ instance_ids: instanceIds })
    );
  }

  /**
   * List SSH keys
   * @returns list of SSH keys, or an empty array if there are none
   * @throws {ErrorResponse} if missing permissions
   */
  async listSSHKeys(): Promise<SSHKey[]> {
    return fetcher<SSHKey[]>(this.configuration, "/ssh-keys", "GET");
  }

  /**
   * Add a new SSH key
   * @param config SSH key configuration. If `public_key` is not provided, a new key pair will be generated and the private key will be returned.
   * @returns the SSH key, with the private key if it was generated
   * @throws {ErrorResponse} if invalid parameters or missing permissions
   */
  async addSSHKey(
    config: AddSSHKeyConfiguration
  ): Promise<SSHKeyWithPrivateKey | SSHKey> {
    return fetcher<SSHKey | SSHKeyWithPrivateKey>(
      this.configuration,
      "/ssh-keys",
      "POST",
      JSON.stringify(config)
    );
  }

  /**
   * Delete an SSH key
   * @param id the ID of the SSH key to delete
   * @returns nothing
   * @throws {ErrorResponse} if the SSH key does not exist or missing permissions
   */
  async deleteSSHKey(id: string): Promise<void> {
    return fetcher<void>(this.configuration, `/ssh-keys/${id}`, "DELETE");
  }

  /**
   * List file systems
   * @returns list of file systems, or an empty array if there are none
   */
  async listFileSystems(): Promise<FileSystem[]> {
    return fetcher<FileSystem[]>(this.configuration, "/file-systems", "GET");
  }
}
