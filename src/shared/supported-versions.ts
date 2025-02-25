export const SUPPORTED_VERSIONS = ['v1'] as const;
export type SupportedVersion = typeof SUPPORTED_VERSIONS[number];

export const isValidVersion = (version: string): version is SupportedVersion => 
  SUPPORTED_VERSIONS.includes(version as SupportedVersion);
