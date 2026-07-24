'use client'

import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../RestreamerUI'), { ssr: false })

const urlParams = new URLSearchParams(window.location.search.substring(1));
const address = urlParams.has('address')
	? urlParams.get('address')
	: window.location.pathname.endsWith('/ui/')
		? window.location.protocol +
			'//' +
			window.location.host +
			window.location.pathname.replace(/ui\/$/, '')
		: window.location.protocol + '//' + window.location.host;

export function ClientOnly() {
  return <App address={address} />
}
