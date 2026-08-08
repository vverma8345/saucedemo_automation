```groovy
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

        stage('Verify Custom Report') {
            steps {
                sh '''
                    echo "======================================"
                    echo "REPORT FILES"
                    echo "======================================"
                    ls -lah custom-report/

                    echo ""
                    echo "======================================"
                    echo "HTML FILE SIZE"
                    echo "======================================"
                    wc -c custom-report/custom-report.html

                    echo ""
                    echo "======================================"
                    echo "HTML START"
                    echo "======================================"
                    head -40 custom-report/custom-report.html

                    echo ""
                    echo "======================================"
                    echo "CHECK CSS"
                    echo "======================================"
                    grep -n "<style>" custom-report/custom-report.html || true

                    echo ""
                    echo "======================================"
                    echo "CHECK CHART"
                    echo "======================================"
                    grep -n "Chart\\|canvas\\|chart.js" custom-report/custom-report.html || true

                    echo ""
                    echo "======================================"
                    echo "CHECK TEST RESULTS"
                    echo "======================================"
                    grep -n "Checkout flow\\|Login with invalid\\|Login with valid" custom-report/custom-report.html || true
                '''
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
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'custom-report',
                reportFiles: 'custom-report.html',
                reportName: 'Custom Automation Report'
            ])
        }
    }
}
```
