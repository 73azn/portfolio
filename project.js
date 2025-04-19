// Parse repo name from URL
function getRepoName() {
    const params = new URLSearchParams(window.location.search);
    return params.get('repo');
}

async function fetchRepoDetails(repoName) {
    const username = '73azn';
    const repoApi = `https://api.github.com/repos/${username}/${repoName}`;
    const readmeApi = `https://api.github.com/repos/${username}/${repoName}/readme`;
    let repo, readmeHtml = '';
    try {
        const repoRes = await fetch(repoApi);
        repo = await repoRes.json();
        // Fetch README and decode from base64
        const readmeRes = await fetch(readmeApi);
        if (readmeRes.ok) {
            const readme = await readmeRes.json();
            const decoded = atob(readme.content.replace(/\n/g, ''));
            // Use GitHub's markdown API to render HTML
            const rendered = await fetch('https://api.github.com/markdown', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: decoded, mode: 'gfm', context: `${username}/${repoName}` })
            });
            readmeHtml = await rendered.text();
        }
    } catch (err) {
        document.getElementById('project-details').innerHTML = '<p>Error loading project details.</p>';
        return;
    }
    renderProject(repo, readmeHtml);
}

function renderProject(repo, readmeHtml) {
    if (!repo || repo.message === 'Not Found') {
        document.getElementById('project-details').innerHTML = '<p>Project not found.</p>';
        return;
    }
    document.title = repo.name + ' - Project Details';
    document.getElementById('project-details').innerHTML = `
        <div class="project-details-header">
            <h2>${repo.name}</h2>
            <div class="project-details-meta">
                <span class="project-lang">${repo.language ? repo.language : 'Unknown'}</span>
                <span class="project-stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                <span class="project-forks"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                <span class="project-updated">Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
            </div>
            <div class="project-details-links">
                <a href="${repo.html_url}" target="_blank"><i class="fab fa-github"></i> View on GitHub</a>
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
            </div>
            <p class="project-details-desc">${repo.description ? repo.description : ''}</p>
            ${repo.topics && repo.topics.length ? `<div class="project-details-topics">${repo.topics.map(t => `<span>${t}</span>`).join('')}</div>` : ''}
        </div>
        <div class="project-details-readme">
            <h3>README</h3>
            <div class="readme-content">${readmeHtml}</div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const repoName = getRepoName();
    if (repoName) {
        fetchRepoDetails(repoName);
    } else {
        document.getElementById('project-details').innerHTML = '<p>No project selected.</p>';
    }
});
