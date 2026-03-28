const generateBtn = document.getElementById('generateBtn');
const promptInput = document.getElementById('prompt');
const generatedImage = document.getElementById('generatedImage');
const status = document.getElementById('status');
const loading = document.getElementById('loading');

async function generateImage() {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        status.textContent = 'Please enter a prompt';
        status.className = 'status error';
        return;
    }
    
    generateBtn.disabled = true;
    status.textContent = 'Generating...';
    status.className = 'status loading';
    
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer Hf_qAZYgZmEOKoAKFzPkqBIpOjuYFmloboCKC',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    steps: 20,
                    width: 512,
                    height: 512,
                    num_images: 1,
                    guidance_scale: 7.5,
                    negative_prompt: 'blurry, low quality, watermark'
                }
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const imageUrl = URL.createObjectURL(new Blob([data[0].data], { type: 'image/jpeg' }));
            generatedImage.src = imageUrl;
            generatedImage.style.display = 'block';
            status.textContent = 'Image generated successfully!';
            status.className = 'status success';
        } else {
            throw new Error(data.error || 'API request failed');
        }
    } catch (error) {
        status.textContent = `Error: ${error.message}`;
        status.className = 'status error';
    } finally {
        generateBtn.disabled = false;
    }
}

generateBtn.addEventListener('click', generateImage);

promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateImage();
    }
});