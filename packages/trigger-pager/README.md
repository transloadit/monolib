> Even though this module is publicly accessible, we do not recommend using it in projects outside of [Transloadit](https://transloadit.com). We won't make any guarantees about its workings and can change things at any time, we won't adhere strictly to SemVer.

> This module is maintained from a monorepo called [monolib](https://github.com/transloadit/monolib).

## Usage

```js
const triggerPager = require('@transloadit/trigger-pager')

await triggerPager({
  token,
  serviceId,
  incidentKey: 'OHNO',
  description: 'the bad thing',
  // urgency: 'high',
  // title: 'OHNO',
})
```
