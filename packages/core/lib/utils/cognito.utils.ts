import {
  CognitoIdentityProvider,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
} from "@aws-sdk/client-cognito-identity-provider";
import { Logger } from "@nestjs/common";
import { CognitoJwtVerifier as CognitoJwtVerifierAWS } from "aws-jwt-verify";
import {
  CognitoJwtVerifierProperties,
  CognitoJwtVerifierSingleUserPool,
} from "aws-jwt-verify/cognito-verifier";
import {
  CognitoIdentityProviderAdapter,
  CognitoIdentityProviderClientAdapter,
} from "../adapters";
import { CognitoModuleOptions } from "../interfaces/cognito-module.options";
/**
 * Get the CognitoJwtVerifier instance
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @returns {CognitoJwtVerifier} - The CognitoJwtVerifier instance
 */
export const createCognitoJwtVerifierInstance = (
  cognitoModuleOptions: CognitoModuleOptions,
): CognitoJwtVerifierSingleUserPool<CognitoJwtVerifierProperties> => {
  const jwtVerifier = cognitoModuleOptions.jwtVerifier;

  if (!jwtVerifier) {
    return null;
  }

  const logger = new Logger("CognitoJwtVerifier");

  const {
    userPoolId,
    clientId,
    tokenUse = "id",
    additionalProperties,
    ...others
  } = jwtVerifier;

  if (!Boolean(userPoolId)) {
    logger.warn(
      "The userPoolId is missing in the CognitoJwtVerifier configuration",
    );
  }

  if (!Boolean(clientId)) {
    logger.warn(
      "The clientId is missing in the CognitoJwtVerifier configuration",
    );
  }

  return CognitoJwtVerifierAWS.create(
    {
      clientId,
      userPoolId,
      tokenUse,
      ...others,
    },
    additionalProperties,
  );
};

/**
 * Get the CognitoIdentityProvider instance
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @returns {CognitoIdentityProvider} - The CognitoIdentityProvider instance
 */
export const createCognitoIdentityProviderInstance = (
  cognitoModuleOptions: CognitoModuleOptions,
): CognitoIdentityProvider => {
  if (!Boolean(cognitoModuleOptions.identityProvider)) {
    return null;
  }

  return new CognitoIdentityProvider(
    buildConfigurationFromOptions(
      cognitoModuleOptions.identityProvider,
      "CognitoIdentityProvider",
    ),
  );
};

/**
 * Get the CognitoIdentityProviderClient instance
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @returns {CognitoIdentityProviderClient} - The CognitoIdentityProviderClient instance
 */
export const createCognitoIdentityProviderClientInstance = (
  cognitoModuleOptions: CognitoModuleOptions,
): CognitoIdentityProviderClient => {
  if (!Boolean(cognitoModuleOptions.identityProvider)) {
    return null;
  }

  return new CognitoIdentityProviderClient(
    buildConfigurationFromOptions(
      cognitoModuleOptions.identityProvider,
      "CognitoIdentityProviderClient",
    ),
  );
};

/**
 * Get the mutable CognitoIdentityProviderAdapter instance
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @returns {CognitoIdentityProviderAdapter} - The CognitoIdentityProviderAdapter instance
 */
export const createMutableCognitoIdentityProviderInstance = (
  cognitoModuleOptions: CognitoModuleOptions,
): CognitoIdentityProviderAdapter => {
  if (!Boolean(cognitoModuleOptions.identityProvider)) {
    return null;
  }

  return new CognitoIdentityProviderAdapter(
    buildConfigurationFromOptions(
      cognitoModuleOptions.identityProvider,
      "CognitoIdentityProviderAdapter",
    ),
  );
};

/**
 * Get the mutable CognitoIdentityProviderClientAdapter instance
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @returns {CognitoIdentityProviderClientAdapter} - The CognitoIdentityProviderClientAdapter instance
 */
export const createMutableCognitoIdentityProviderClientInstance = (
  cognitoModuleOptions: CognitoModuleOptions,
): CognitoIdentityProviderClientAdapter => {
  if (!Boolean(cognitoModuleOptions.identityProvider)) {
    return null;
  }

  return new CognitoIdentityProviderClientAdapter(
    buildConfigurationFromOptions(
      cognitoModuleOptions.identityProvider,
      "CognitoIdentityProviderClientAdapter",
    ),
  );
};

/**
 * Get the configuration from the CognitoModuleOptions
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @param {string} from - The name from where the configuration is coming from
 */
function buildConfigurationFromOptions(
  cognitoModuleOptions: CognitoIdentityProviderClientConfig,
  from: string,
): CognitoIdentityProviderClientConfig {
  const logger = new Logger(from);
  const { region, ...options } = cognitoModuleOptions;

  if (!Boolean(region)) {
    logger.warn(`The region is missing in the ${from} configuration`);
  }

  return {
    region: region,
    ...options,
  };
}
