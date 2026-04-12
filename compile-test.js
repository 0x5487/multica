const { compile } = require('svelte/compiler');
const fs = require('fs');

const svelteCode = `
<script module>
class Base {
  _token = null;
  
  setToken(t) {
    this._token = t;
  }
  
  getToken() {
    return this._token;
  }
}

export class Derived extends Base {
  _token = $state(null);
  
  constructor() {
    super();
  }
}

export function test() {
  const d = new Derived();
  d.setToken("hello");
  console.log("Derived getToken():", d.getToken());
  console.log("Derived _token property:", d._token);
}
</script>
`;

fs.writeFileSync('test.svelte', svelteCode);
