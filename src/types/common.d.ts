type DynamicObject = Record<string, any>;
type Any = ReturnType<Function>;

declare module "semver/functions/gt" {
  const gt: (version: string, comparison: string) => boolean;
  export default gt;
}
declare module "semver/functions/valid" {
  const valid: (version: string) => string | null;
  export default valid;
}
declare module "semver/functions/lte" {
  const lte: (version: string, comparison: string) => boolean;
  export default lte;
}
declare module "semver/functions/eq" {
  const eq: (version: string, comparison: string) => boolean;
  export default eq;
}
declare module "semver/functions/compare" {
  const compare: (version: string, comparison: string) => number;
  export default compare;
}
declare module "semver/functions/satisfies" {
  const satisfies: (version: string, range: string) => boolean;
  export default satisfies;
}
declare module "semver/functions/gte" {
  const gte: (version: string, comparison: string) => boolean;
  export default gte;
}
declare module "semver/functions/major" {
  const major: (version: string) => number;
  export default major;
}
declare module "semver/functions/minor" {
  const minor: (version: string) => number;
  export default minor;
}
declare module "url-parse" {
  const UrlParse: any;
  export default UrlParse;
}
declare module "handlebars/dist/cjs/handlebars" {
  const Handlebars: any;
  export default Handlebars;
}
