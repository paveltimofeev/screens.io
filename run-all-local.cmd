SET SCREENS_ENV=LOCAL

SET WORKER_CONFIG={"incomingQueue":{"queueUrl":"https://sqs.us-east-1.amazonaws.com/772145494782/vrt_task_dev","pollingInterval":2000,"maxNumberOfMessages":10,"visibilityTimeout": 60,"waitTimeSeconds": 0}, "outgoingQueue": {"queueUrl": "https://sqs.us-east-1.amazonaws.com/772145494782/vrt_results_dev"}}

cd backend && start npm run backend
cd ../auth-proxy && start npm run proxy
cd ../frontend && start npm run frontend.local
cd ../run-worker/bs-function && start npm run worker
cd ..

REM cd frontend && start npm run frontend.local && cd .. && node_modules\.bin\pm2 start ./pm/ecosystem.local.yml
