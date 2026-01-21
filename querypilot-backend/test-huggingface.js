import dotenv from 'dotenv';

dotenv.config();

async function testHuggingFaceNew() {
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;

    if (!hfApiKey) {
        console.error('❌ HUGGINGFACE_API_KEY not found in .env');
        return;
    }

    console.log('✅ API Key found');
    console.log('🧪 Testing Hugging Face Serverless Inference API...\n');

    const testPrompt = `You are SchemaCat, a MongoDB assistant.

DATABASE SCHEMA CONTEXT:
Database: school
Collections: students (2 documents)
Fields: _id, name, age, hobbies

USER QUESTION: Show me all students

Provide your response as SchemaCat:`;

    // Try multiple models to find one that works
    const modelsToTest = [
        'meta-llama/Llama-3.2-3B-Instruct',
        'microsoft/Phi-3-mini-4k-instruct',
        'mistralai/Mistral-7B-Instruct-v0.3',
        'HuggingFaceH4/zephyr-7b-beta'
    ];

    for (const modelName of modelsToTest) {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`Testing model: ${modelName}`);
        console.log('='.repeat(80));

        try {
            const apiUrl = `https://api-inference.huggingface.co/models/${modelName}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${hfApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: testPrompt,
                    parameters: {
                        max_new_tokens: 300,
                        temperature: 0.7,
                        return_full_text: false
                    }
                })
            });

            console.log(`📊 Status: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.log(`❌ Error: ${errorText.substring(0, 200)}`);
                continue;
            }

            const data = await response.json();

            console.log('✅ SUCCESS! Response received\n');

            // Extract the generated text
            let aiResponse;
            if (Array.isArray(data) && data.length > 0) {
                aiResponse = data[0].generated_text || data[0].text || JSON.stringify(data[0]);
            } else if (data.generated_text) {
                aiResponse = data.generated_text;
            } else {
                aiResponse = JSON.stringify(data);
            }

            console.log('💬 AI Response:');
            console.log('─'.repeat(80));
            console.log(aiResponse);
            console.log('─'.repeat(80));

            console.log(`\n✅ WORKING MODEL FOUND: ${modelName}`);
            break;

        } catch (error) {
            console.error(`❌ Error with ${modelName}:`, error.message);
        }
    }
}

testHuggingFaceNew();
