module.exports = async (page, scenario) => {

  console.log('[StubInnerText] scenario', scenario)

  const stubs = scenario.stubInnerTextSelectors || []; // [ { selector:string, value:string } ]

  for (var i = 0; i < stubs.length; i++) {
    console.log('- stubInnerTextSelector ' + i, stubs[i]);      
  }


  if (stubs && stubs.length > 0) {
    
    for (var i = 0; i < stubs.length; i++) {
        
        const stub = stubs[i]
        
        if (!stub.selector || stub.selector === '' || stub.selector === '*')
            return;
        
        await page.waitFor(stub.selector);
        await page.evaluate(
            s => { 
                var els = document.querySelectorAll(s.selector);
                for(var j =0; j < els.length; j++) {
                    els[j].innerText = s.value;
                }
            }, 
            stub);
    }
    
    /*
    for (const clickSelectorIndex of [].concat(clickSelector)) {
      await page.waitFor(clickSelectorIndex);
      await page.click(clickSelectorIndex);
    }
    */
  }
};
