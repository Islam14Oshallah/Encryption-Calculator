const CryptanalysisDialog = require('./cryptanalysisDialog');
const cryptanalysisDialog = new CryptanalysisDialog();

function addCryptanalysisButton(algorithm, container) {
  const analysisBtn = document.createElement('button');
  analysisBtn.innerText = 'Show Security Analysis';
  analysisBtn.className = 'analysis-button';
  analysisBtn.addEventListener('click', () => {
    cryptanalysisDialog.show(algorithm);
  });
  
  container.appendChild(analysisBtn);
}
