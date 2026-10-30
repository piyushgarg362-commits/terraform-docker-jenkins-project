
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "piyushgarg949/devops-webapp"
        APP_HOST = "3.145.42.157"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/piyushgarg362-commits/terraform-docker-jenkins-project.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t $DOCKER_IMAGE:$BUILD_NUMBER .
                '''
            }
        }

        stage('Login and Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    sh '''
                        echo "$DOCKERHUB_TOKEN" | docker login \
                          -u "$DOCKERHUB_USER" --password-stdin

                        docker push $DOCKER_IMAGE:$BUILD_NUMBER

                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                sshagent(credentials: ['app-ssh-key-new']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=accept-new \
                          ubuntu@$APP_HOST \
                          "sudo docker pull $DOCKER_IMAGE:$BUILD_NUMBER && \
                          (sudo docker rm -f devops-webapp || true) && \
                          sudo docker run -d \
                          --restart unless-stopped \
                          --name devops-webapp \
                          -p 80:3000 \
                          $DOCKER_IMAGE:$BUILD_NUMBER"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Application deployed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check Console Output.'
        }
    }
}

