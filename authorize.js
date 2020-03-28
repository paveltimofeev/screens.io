const Chromy = require('chromy')
 
async function main () {
  
  console.log('started...')
    
  let chromy = new Chromy( {visible: true} )
  
  await chromy.goto('https://yandex.ru/')
  await chromy.wait('.desk-notif-card__login-enter-expanded');
  await chromy.click('.desk-notif-card__login-enter-expanded');

  console.log('wait for login input')
  //await chromy.wait('input[name=login]');
  await chromy.wait('.passp-form-field__label');
  //await chromy.wait('#passp-field-login');
  
  console.log('ready to type login')
  await chromy.type('.passp-form-field__label', 'patico.pro');
  
  console.log('submitting')
  await chromy.click('button[type=submit]');
  
  const cookies = await chromy.getCookies()
  
  console.log(cookies)
  await chromy.close()
}
 
main()