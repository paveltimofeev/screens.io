SET SCREENS_ENV=LOCAL

cd backend && start npm run backend && cd ../auth-proxy && start npm run proxy && cd ../frontend && start npm run frontend.local && cd ..

REM cd frontend && start npm run frontend.local && cd .. && node_modules\.bin\pm2 start ./pm/ecosystem.local.yml
