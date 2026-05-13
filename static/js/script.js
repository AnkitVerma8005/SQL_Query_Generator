document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const queryInput = document.getElementById('queryInput');
    const resultContainer = document.getElementById('resultContainer');
    const errorContainer = document.getElementById('errorContainer');
    const sqlOutput = document.getElementById('sqlOutput');
    const errorMessage = document.getElementById('errorMessage');
    const loading = document.getElementById('loading');
    const copyBtn = document.getElementById('copyBtn');

    generateBtn.addEventListener('click', async () => {
        const query = queryInput.value.trim();
        if (!query) return;

        // Reset UI
        resultContainer.classList.add('hidden');
        errorContainer.classList.add('hidden');
        loading.classList.remove('hidden');
        generateBtn.disabled = true;

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();

            loading.classList.add('hidden');
            generateBtn.disabled = false;

            if (response.ok) {
                resultContainer.classList.remove('hidden');
                typeWriter(data.sql, sqlOutput);
            } else {
                errorMessage.textContent = data.error || 'An error occurred.';
                errorContainer.classList.remove('hidden');
            }
        } catch (error) {
            loading.classList.add('hidden');
            generateBtn.disabled = false;
            errorMessage.textContent = 'Failed to connect to the server.';
            errorContainer.classList.remove('hidden');
        }
    });

    queryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateBtn.click();
        }
    });

    function typeWriter(text, element) {
        element.textContent = '';
        let i = 0;
        const speed = 10; // ms per character

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    copyBtn.addEventListener('click', () => {
        const text = sqlOutput.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalTitle = copyBtn.getAttribute('title');
            copyBtn.setAttribute('title', 'Copied!');
            setTimeout(() => {
                copyBtn.setAttribute('title', originalTitle);
            }, 2000);
        });
    });
});
