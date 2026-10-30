pipeline {
  agent { docker { image 'mcr.microsoft.com/playwright:v1.58.0-noble' } }
  stages { stage('Install') { steps { sh 'npm ci' } } stage('Smoke') { steps { sh 'npm run test:smoke' } } }
  post { always { junit 'test-results/junit.xml'; archiveArtifacts artifacts: 'playwright-report/**,test-results/**', allowEmptyArchive: true } }
}
