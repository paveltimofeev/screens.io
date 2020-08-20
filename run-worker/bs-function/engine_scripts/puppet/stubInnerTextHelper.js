module.exports = async (page, scenario) => {

  const stubs = scenario.stubContentRules || []; // [ { selector:string, value:string } ]

  if (stubs && stubs.length > 0) {

    console.log('[Stab Content] Stubs count:', stubs.length);

    for (var i = 0; i < stubs.length; i++) {

        const stub = stubs[i];

        if (!stub.selector || stub.selector === '' || stub.selector === '*') {
          return;
        }

        // Could leeds to timeout error and test crash if selector is wrong or not found
        // await page.waitFor(stub.selector);

        await page.evaluate(
            s => {

                var els = document.querySelectorAll(s.selector);
                console.log(`[Stab Content] selector "${s.selector}" found ${els.length} elements`);

                for (var j = 0; j < els.length; j++) {
                    els[j].innerText = s.value;
                }
            },
            stub);
    }
  }
};
