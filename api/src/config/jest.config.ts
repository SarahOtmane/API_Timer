// jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',  // Utiliser ts-jest pour les fichiers TypeScript
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/tests/**/*.test.ts'], // Spécifier le dossier des tests
  transformIgnorePatterns: ['/node_modules/'],  // Ignorer node_modules
};

export default config;
