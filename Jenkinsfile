pipeline {
    agent { label 'node1' }
    
    tools {
        nodejs "nodejs"
    }

    environment {
        // GENERATE_SOURCEMAP = credentials('GENERATE_SOURCEMAP')
        // REACT_APP_BACKEND_URL = credentials('REACT_APP_BACKEND_URL')
        DISTRIBUTION_ID = 'E1O2ZPYOQGSOFW'  
        PATHS_TO_INVALIDATE = '/*'
    }

    stages {

        stage('Checkout') {
            steps {
                 git branch: 'feature-1', url: 'https://github.com/hangzh521/Techscrum.fe'
            }
        }

        stage('SonarQube Scan') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube Server') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage("Quality Gate") {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Install') {
            steps {
                sh 'npm install --force'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            
            // environment {
            //     AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
            //     AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
            //     AWS_DEFAULT_REGION = credentials('AWS_DEFAULT_REGION')
            // }

            steps {
               withVault(configuration: [timeout: 60, vaultCredentialId: 'vault-jenkins-role', vaultUrl: 'http://3.25.111.118:8200'], vaultSecrets: [[path: 'secrets/techscrum', secretValues: [[vaultKey: 'AWS_ACCESS_KEY_ID'], [vaultKey: 'AWS_SECRET_ACCESS_KEY'], [vaultKey: 'AWS_DEFAULT_REGION'],[vaultKey: 'REACT_APP_BACKEND_BASE_URL'],[vaultKey: 'GENERATE_SOURCEMAP']]]]) {
                    sh "aws s3 sync ./build s3://www.hangzhao.net/"
                    // clean cloudfront cache
                    sh 'aws cloudfront create-invalidation --distribution-id  "${DISTRIBUTION_ID}" --paths "${PATHS_TO_INVALIDATE}"'
             }
          }
       } 
   }
}