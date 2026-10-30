# Changelog

## 1.1.0

### Changed
- The platform formerly known as Deep Intelligence is now AIR-Core. The strategy now defaults to `https://app.air-core.io` (1.0.1 used `https://app.deepint.net`). Endpoint paths are unchanged: `/oauth/authorize`, `/api/oauth/login`, `/api/v1/who` and `/api/v1/profile`.
- README and package metadata updated to the AIR-Core name.

### Added
- New options to override the endpoints: `baseURL`, `authorizationURL`, `tokenURL`, `userInfoURL` and `profileURL`. Set `baseURL: 'https://app.deepint.net'` to keep using the legacy host.
- `StrategyOptions` TypeScript interface.

### Compatibility
- Package name, strategy name (`deepint`), exported `Strategy`, the `deepint_id` user field and the `x-auth-token` header are unchanged.
