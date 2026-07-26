pipeline {

    agent any

    tools {
        nodejs 'node26'
    }

    environment {
        CI = "true"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npx playwright test'
            }
        }

        stage('Generate Custom Report') {
            steps {
                sh 'npx ts-node custom-report/generate-html-report.ts'
            }
        }
    }

    post {

        always {

            archiveArtifacts artifacts: 'custom-report/**', fingerprint: true

            archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true

            junit allowEmptyResults: true,
                  testResults: 'test-results/**/*.xml'

            publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Report'
            ])

            publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'custom-report',
                    reportFiles: 'custom-report.html',
                    reportName: 'Custom HTML Report'
            ])
        }
    }
}
