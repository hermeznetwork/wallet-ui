// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules

import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

// Required since Workbox compilation plugin checks for this value when generating a manifest of URLs to precache
const ignored = self.__WB_MANIFEST // eslint-disable-line

const cacheName = 'withdraw-circuit-cache'
const urls = [
  'https://raw.githubusercontent.com/hermeznetwork/hermezjs/main/withdraw-circuit-files/withdraw.wasm',
  'https://raw.githubusercontent.com/hermeznetwork/hermezjs/main/withdraw-circuit-files/withdraw_hez4_final.zkey'
]
const matchCallback = ({ request }) => urls.includes(request.url)

registerRoute(
  matchCallback,
  new StaleWhileRevalidate({
    cacheName,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
)
