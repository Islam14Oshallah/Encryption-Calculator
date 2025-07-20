class CryptanalysisDialog {
  constructor() {
    this.dialog = document.createElement('div');
    this.dialog.className = 'crypto-analysis-dialog';
    this.dialog.style.display = 'none';
    this.dialog.style.position = 'fixed';
    this.dialog.style.zIndex = '1000';
    this.dialog.style.left = '50%';
    this.dialog.style.top = '50%';
    this.dialog.style.transform = 'translate(-50%, -50%)';
    this.dialog.style.backgroundColor = 'white';
    this.dialog.style.padding = '20px';
    this.dialog.style.borderRadius = '5px';
    this.dialog.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    this.dialog.style.maxWidth = '80%';
    this.dialog.style.maxHeight = '80%';
    this.dialog.style.overflow = 'auto';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close';
    closeBtn.style.float = 'right';
    closeBtn.addEventListener('click', () => this.hide());
    
    this.content = document.createElement('div');
    
    this.dialog.appendChild(closeBtn);
    this.dialog.appendChild(this.content);
    
    document.body.appendChild(this.dialog);
    
    // Backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.style.position = 'fixed';
    this.backdrop.style.top = '0';
    this.backdrop.style.left = '0';
    this.backdrop.style.width = '100%';
    this.backdrop.style.height = '100%';
    this.backdrop.style.backgroundColor = 'rgba(0,0,0,0.5)';
    this.backdrop.style.zIndex = '999';
    this.backdrop.style.display = 'none';
    this.backdrop.addEventListener('click', () => this.hide());
    
    document.body.appendChild(this.backdrop);
  }
    show(algorithm) {
    // Try to get analysis from additional cryptanalysis first
    if (additionalCryptanalysis && additionalCryptanalysis[algorithm]) {
      const analysis = additionalCryptanalysis[algorithm];
      this.content.innerHTML = `
        <h2>${analysis.title}</h2>
        <h3>Key Vulnerabilities:</h3>
        <ul>
          ${analysis.vulnerabilities.map(v => `<li>${v}</li>`).join('')}
        </ul>
        <h3>Example:</h3>
        <p style="white-space: pre-line">${analysis.example}</p>
        <h3>Mitigation Strategies:</h3>
        <p style="white-space: pre-line">${analysis.mitigation}</p>
      `;
    } else {
      // Fall back to original cryptanalysis
      this.content.innerHTML = showCryptanalysis(algorithm);
    }
    
    this.dialog.style.display = 'block';
    this.backdrop.style.display = 'block';
  }
  
  hide() {
    this.dialog.style.display = 'none';
    this.backdrop.style.display = 'none';
  }
}

module.exports = CryptanalysisDialog;
