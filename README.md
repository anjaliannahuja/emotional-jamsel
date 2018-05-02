#Initial setup
1. If you haven't installed docker & started the docker daemon, do that.
2. In the top level directory, if you haven't run the app yet, run `docker-compose up --build`
3. If you have run the app before, run `docker-compose up`

=====DEPLOYMENT INSTRUCTIONS=====
1. Install the aws ecs cli https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI_installation.html
2. Configure the aws ecs cli using your account details https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI_Configuration.html
3. Install the aws cli https://docs.aws.amazon.com/cli/latest/userguide/installing.html
4. Configure the aws cli https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-quick-configuration
5. Run aws iam --region us-east-1 create-role --role-name ecsExecutionRole --assume-role-policy-document file://execution-assume-role.json
6. Run aws iam --region us-east-1 attach-role-policy --role-name ecsExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
7. Run ecs-cli up --cluster (cluster)
8. Run aws ec2 create-security-group --group-name "my-sg" --description "My security group" --vpc-id "VPC_ID", using the vpc id from the previous command
9. Run aws ec2 authorize-security-group-ingress --group-id "security_group_id" --protocol tcp --port 80 --cidr 0.0.0.0/0, using the security group id from the previous command
10. Change the ports of the web service in the docker-compose.prod.yml from 8089:8089 to 80:80
11. Change the ecs-params.yml subnet IDs to the two subnets outputted by step 7, and the security group id to that of the output of step 8
12. Run docker-compose up --build to build all images
13. Create an elastic container repository- https://console.aws.amazon.com/ecs/home?region=us-east-1#/repositories
14. Follow the instructions of "view push commands" to set up the ability to push docker images
15. Push all of your images up with tags of their names
16. Change the image URLs in docker-compose.prod.yml
17. Run ecs-cli compose --file docker-compose.prod.yml --project-name magic-box service up  --create-log-groups