module.exports = async (page, scenario) => {

  const authConfig = scenario.authConfig;

  if (authConfig) {

    console.log('[auth Config] enabled:', authConfig.enabled);

    if (!authConfig.enabled) {
      return;
    }

    console.log('[auth Config] login selector:', authConfig.loginSelector);
    console.log('[auth Config] password selector:', authConfig.passwordSelector);
    console.log('[auth Config] submit selector:', authConfig.submitSelector);
    console.log('[auth Config] login page:', authConfig.loginPage);


    console.log('[auth Config] > goto login page', authConfig.loginPage);
    await page.goto( authConfig.loginPage );


    console.log('[auth Config] > wait for login and password fields');
    await page.waitFor(authConfig.loginSelector);
    await page.waitFor(authConfig.passwordSelector);


    console.log('[auth Config] > typing login to', authConfig.loginSelector);
    await page.type(authConfig.loginSelector, authConfig.loginValue, {delay: 100});

    console.log('[auth Config] > typing password to', authConfig.passwordSelector);
    await page.type(authConfig.passwordSelector, authConfig.passwordValue, {delay: 100});


    console.log('[auth Config] > clicking submit', authConfig.submitSelector);
    await Promise.all([
      page.waitForNavigation(),
      await page.click(authConfig.submitSelector)
    ]);


    console.log('[auth Config] > goto', scenario.url);
    await page.goto( scenario.url );
  }
};
