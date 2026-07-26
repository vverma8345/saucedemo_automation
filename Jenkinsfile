pipeline {

    agent any

    tools {
        nodejs 'node26'
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

            archiveArtifacts(
                artifacts: 'custom-report/**',
                allowEmptyArchive: true,
                fingerprint: true
            )

            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'custom-report',
                reportFiles: 'custom-report.html',
                reportName: 'Custom Automation Report'
            ])
        }
    }
}