import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambda_nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dotenv from 'dotenv';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';

dotenv.config();

export class CartServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const nodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(100),
      memorySize: 1024,
      environment: {
        DATABASE_NAME: process.env.DATABASE_NAME || '',
        DATABASE_HOST: process.env.DATABASE_HOST || '',
        DATABASE_PORT: process.env.DATABASE_PORT || '5432',
        DATABASE_USERNAME: process.env.DATABASE_USERNAME || '',
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '', 
      }
    };

    const cartServiceLambda = new lambda_nodejs.NodejsFunction(this, 'CartServiceFunction', {
      entry: '../dist/main.js',
      handler: 'handler',
      ...nodejsFunctionProps
    });

    cartServiceLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['rds-db:connect', 'rds:DescribeDBInstances'],
        resources: ['*'], // You might want to restrict this to specific RDS ARN
      }),
    );

    const restApi = new RestApi(this, 'cartRestAPI', {
      restApiName: 'cartRestAPI',
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      }
    });

    const cartApiIntegration = new LambdaIntegration(cartServiceLambda);

    restApi.root.addProxy({
      defaultIntegration: cartApiIntegration,
    });

  }
}
