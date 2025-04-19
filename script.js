// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// Fixed header on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// Project card animations
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Fetch and display all GitHub projects beautifully
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayProjects();
});

async function fetchAndDisplayProjects() {
    const username = '73azn';
    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    try {
        const response = await fetch(apiUrl);
        const repos = await response.json();
        // Sort by stargazers_count desc, then updated_at desc
        repos.sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));
        const container = document.getElementById('projects-list');
        if (!repos.length) {
            container.innerHTML = '<p>No public projects found.</p>';
            return;
        }
        container.innerHTML = repos.map(repo => `
            <div class="project-card enhanced">
                <div class="project-header">
                    <h3><a href="project.html?repo=${encodeURIComponent(repo.name)}">${repo.name}</a></h3>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" title="View on GitHub"><i class="fab fa-github"></i></a>
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    </div>
                </div>
                <p>${repo.description ? repo.description : 'No description provided.'}</p>
                <div class="project-meta">
                    <span class="project-lang">${repo.language ? repo.language : 'Unknown'}</span>
                    <span class="project-stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span class="project-updated">Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    } catch (err) {
        document.getElementById('projects-list').innerHTML = '<p>Error fetching projects.</p>';
    }
}

// Theme toggle logic
function setTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('light-theme');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    setTheme(isLight ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', () => {
    // Set theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme === 'light' ? 'light' : 'dark');
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    fetchAndDisplayOtherProjects();
});

const staticProjects = [
    'rubys-projects',
    'Algo_data',
    'converter',
    'basicConvertor_android',
    'visualize_data_structure',
    'destiny2'
];

async function fetchAndDisplayOtherProjects() {
    const username = '73azn';
    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    try {
        const response = await fetch(apiUrl);
        const repos = await response.json();
        // Filter out static projects
        const otherRepos = repos.filter(repo => !staticProjects.includes(repo.name));
        // Sort by stargazers_count desc, then updated_at desc
        otherRepos.sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));
        const container = document.getElementById('other-projects-list');
        if (!otherRepos.length) {
            container.innerHTML = '<p>No other public projects found.</p>';
            return;
        }
        container.innerHTML = otherRepos.map(repo => `
            <div class="project-card enhanced">
                <div class="project-header">
                    <h3><a href="project.html?repo=${encodeURIComponent(repo.name)}">${repo.name}</a></h3>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" title="View on GitHub"><i class="fab fa-github"></i></a>
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    </div>
                </div>
                <p>${repo.description ? repo.description : 'No description provided.'}</p>
                <div class="project-meta">
                    <span class="project-lang">${repo.language ? repo.language : 'Unknown'}</span>
                    <span class="project-stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span class="project-updated">Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    } catch (err) {
        document.getElementById('other-projects-list').innerHTML = '<p>Error fetching projects.</p>';
    }
}
