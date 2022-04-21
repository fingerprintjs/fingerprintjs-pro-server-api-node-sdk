#### 1.0.5 (2022-04-21)

##### Bug Fixes

*  ap region URL ([aba47938](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/aba47938bd180eaae492f8a44bb6340c7aa8fece))

#### 1.0.4 (2022-04-21)

##### Chores

*  another attempt to fix git issue with safe.directory ([675e1749](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/675e1749fe576856a07647fcb2b7b83e1f9088c3))

#### 1.0.3 (2022-04-21)

##### Chores

*  another work around to make publish work ([ef40e525](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/ef40e5253185434c1e2ca1ad1baaa1299c140bc9))

#### 1.0.2 (2022-04-21)

##### Chores

*  update checkout action version ([b6446386](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/b6446386c3006e6ab2f758ccfa9a0decc2fb3b20))

#### 1.0.1 (2022-04-21)

##### Chores

* try a new git version workaround to publish the new version to npm ([99e1f05d](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/99e1f05d9f9d08e37e904e2d7c7a395549eb8ee1))

## 1.0.0 (2022-04-20)

##### Build System / Dependencies

*  add "--no-git-tag-version" flag to release commands ([b8f2bc77](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/b8f2bc7727f0f09b8f83f24e795f6ae29d60b36b))
*  use generate-changelog for releases ([a9d2b336](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/a9d2b336df2270306e1c2a01f90c3ca058f0df3e))

##### Chores

*  move "generate-changelog" to dev dependencies ([f57c5ae3](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/f57c5ae3220de6c360adfe4310064c06cbab20b5))
*  remove changelog ([4a32ec30](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/4a32ec30d4c217131d9c12f7af7d7b27c02fbade))
*  format existing mocked response data ([b000f361](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/b000f361b7a0e25811c4dbe729ece0cd5a3b13ed))
*  use npm-publish action by SHA for security reasons ([4ff1b409](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/4ff1b409f325b4729d4a652a77f2df6b535d2217))
*  don't use npx to run jest ([d0426e3c](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/d0426e3c553499c390851d82e0a40f30e2a49bf5))
*  add lint job to github actions, fix command to run test job ([e7044f16](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/e7044f16ee2b20cf23eaaa3490d65abced21f558))
*  add deps to repair eslint and prettier, fix eslint and prettier rules ([de0f7e53](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/de0f7e53edcd59c81a933cd0c8c446269edb2515))
*  migrate from npm to yarn ([1c112ae5](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/1c112ae5c7e0a799d7cfa713853b066f1d610fcc))
*  ignore .idea folder ([6bb5fe90](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/6bb5fe902f2b91c6aa5c4440f14d25a9395a39ab))

##### Continuous Integration

*  add missing node setup action ([c3371b8d](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/c3371b8d5f819ca7b3407ce4f549f5b55a5954f7))

##### Documentation Changes

*  better formatting, add links, extend example ([93147b85](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/93147b859ca907e0b780dfea0b4d74025d22d4d4))
*  update readme ([a68dddad](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/a68dddadb0cb9f96295aeca9d25cf940686de456))
*  add CODEOWNERS and contributing guide ([a30fc0d3](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/a30fc0d3d63a1989fb9524780caf4816cf31fc3e))
*  update readme.md ([12685b7d](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/12685b7d909e60ebf247dd851e44a2bc63bc129e))
*  update src/types.ts ([e5cdd25d](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/e5cdd25d2618921b254bcf06346880dca43ed4c1))
*  update readme.md ([adee5c70](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/adee5c7054e973c5e7d43f84ee335099cf0224e1))
*  add ci badge, fix markup formatting ([ea517213](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/ea517213d53ff6dfc49328588ccfcc23860b8d8b))
*  add installing using yarn instruction ([f02626e7](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/f02626e754f0e0ed6c315ab9d86d9ca2a982649d))

##### New Features

*  support passing custom fetch implementation in options ([80bf983c](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/80bf983c3f901c1ebe477cc79aecfbea657fb8e0))
*  replace "querystring" with "URLSearchParams" ([6a34d0bb](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/6a34d0bb95d3647aa315b0a462aff22af238f11d))
*  add confidence score, visitor found, and timestamps to data types ([97d8c39a](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/97d8c39aa71b36cd302581cbc450d1f9f35e1ca5))
*  rename token to api key ([6d08efe0](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/6d08efe0d17d8e8c265b502f5f2c86d61cf534e6))
*  add Asia region (ap) ([539f071d](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/539f071df4bc04368677e505e202effa48a8bdf2))

##### Bug Fixes

*  fix typo ([d6a9396b](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/d6a9396b5f845d4273129b170c9a61210540945c))
*  change subdivisons type from tuple to array ([a9947493](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/a994749314bdedd5dfa85f30acb530ecd02498e3))
*  removed unnecessary commented code from test ([cbcf87e7](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/cbcf87e7631dca2ab78cb64736c3c541bea4a18a))
*  simplify Promise chain and add negative test ([adc94d83](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/adc94d838d85e048c6bf63f4199802a20cdde13d))

##### Other Changes

* lint fixes ([ff526eee](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/commit/ff526eeef9a5c19e1fdf3922db79e08e171d73d8))

