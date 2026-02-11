# Senior Code Review — Verifiable Bugs

## 1) `ENGrid.deepMerge` throws when `target` is undefined
- **Severity:** High (runtime crash)
- **Location:** `packages/scripts/src/engrid.ts` (`deepMerge`)
- **Why this is a bug:** The implementation dereferences `target[key]` before ensuring `target` exists. Passing `undefined` as `target` throws `TypeError`.

### Reproduction
```bash
node - <<'NODE'
const {ENGrid}=require('./packages/scripts/dist/engrid.js');
try { console.log(ENGrid.deepMerge(undefined,{a:{b:1}})); }
catch(e){ console.error('ERR', e.message); }
NODE
```

### Actual result
```text
ERR Cannot read properties of undefined (reading 'a')
```

### Expected result
A deep merge utility should safely initialize missing objects instead of throwing on `undefined` input.

---

## 2) `ENGrid.getOption` drops valid falsy option values
- **Severity:** High (configuration corruption)
- **Location:** `packages/scripts/src/engrid.ts` (`getOption`)
- **Why this is a bug:** `getOption` returns `window.EngridOptions[key] || null`, which converts `false`, `0`, and `""` to `null`. This makes it impossible to distinguish explicit values from missing options.

### Reproduction
```bash
node - <<'NODE'
const {ENGrid}=require('./packages/scripts/dist/engrid.js');
global.window={EngridOptions:{Debug:false, MinAmount:0, Label:''}};
console.log('Debug', ENGrid.getOption('Debug'));
console.log('MinAmount', ENGrid.getOption('MinAmount'));
console.log('Label', ENGrid.getOption('Label'));
NODE
```

### Actual result
```text
Debug null
MinAmount null
Label null
```

### Expected result
Should return `false`, `0`, and `""` respectively.

---

## 3) `ENGrid.getUrlParameter("name[]")` matches unintended keys by prefix
- **Severity:** Medium (incorrect data mapping)
- **Location:** `packages/scripts/src/engrid.ts` (`getUrlParameter` array branch)
- **Why this is a bug:** The current logic uses `key.startsWith(name.replace("[]", ""))`, so querying `foo[]` also captures unrelated keys like `fooBar`.

### Reproduction
```bash
node - <<'NODE'
const {ENGrid}=require('./packages/scripts/dist/engrid.js');
global.window={location:{search:'?fooBar=1&foo[0]=a&foo[1]=b'}};
console.log(JSON.stringify(ENGrid.getUrlParameter('foo[]')));
NODE
```

### Actual result
```text
[{"fooBar":"1"},{"foo[0]":"a"},{"foo[1]":"b"}]
```

### Expected result
Only `foo[...]` keys should be returned.
