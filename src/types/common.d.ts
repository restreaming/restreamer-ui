type DynamicObject = Record<string, any>;

declare module 'semver/functions/gt' {
	const gt: (version: string, comparison: string) => boolean;
	export default gt;
}
declare module 'semver/functions/valid' {
	const valid: (version: string) => string | null;
	export default valid;
}
declare module 'semver/functions/lte' {
	const lte: (version: string, comparison: string) => boolean;
	export default lte;
}
declare module 'semver/functions/eq' {
	const eq: (version: string, comparison: string) => boolean;
	export default eq;
}
