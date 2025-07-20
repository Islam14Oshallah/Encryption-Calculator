// Dark mode functionality
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  
  // Check for saved user preference
  const savedTheme = localStorage.getItem('theme');
  
  // Apply saved theme or default to light
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  
  // Toggle dark mode on button click
  darkModeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Set the new theme
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save user preference
    localStorage.setItem('theme', newTheme);
  });
});