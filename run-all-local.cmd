SET SCREENS_ENV=LOCAL
REM SET WORKER_CONFIG={"incomingQueue": {"queueUrl": "https://sqs.us-east-1.amazonaws.com/772145494782/vrt_task_dev"}}

cd backend && start npm run backend && cd ../auth-proxy && start npm run proxy && cd ../frontend && start npm run frontend.local && cd ../run-worker/bs-function && start npm run worker && cd ..

REM cd frontend && start npm run frontend.local && cd .. && node_modules\.bin\pm2 start ./pm/ecosystem.local.yml
