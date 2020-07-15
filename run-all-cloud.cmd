SET SCREENS_ENV=CLOUD
cd backend && start npm run backend && cd ../auth-proxy && start npm run proxy && cd ../frontend && start npm run frontend && cd ..
