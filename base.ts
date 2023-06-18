import { Configuration } from "./configuration";

export const DEFAULT_BASE_PATH = "https://cloud.lambdalabs.com/api/v1";

export class BaseAPI {
  protected configuration: Configuration;

  constructor(configuration: Configuration) {
    this.configuration = configuration;
    if (!this.configuration.basePath) {
      this.configuration.basePath = DEFAULT_BASE_PATH;
    }
  }
}
